var t2 = require('through2')
var fs = require('fs')
var eos = require('end-of-stream')
var glob = require('glob')
var once = require('once')

module.exports = function(patterns){
  var s = t2()
  if(!Array.isArray(patterns)) patterns = [patterns]
  
  var todo = patterns.length;
  var streamFiles = []  

  deglob(patterns,function(err,files){
    files.sort()
    s.emit('files',files.slice())
    stream(files)
  })

  function stream (files){
    var f = files.shift()
    if(!f) return;
    var rs = fs.createReadStream(f)
    eos(rs,function(err){
      if(err) {
        err.file = f
        return s.emit('error',err)
      }
      stream(files)
    })

    var opts = {};
    if(files.length) opts.end = false

    rs.pipe(s,opts)
  }

  return s;  
}

function deglob(patterns,cb,_res){
  if(!patterns.length) return cb(false,_res||[])
  if(!_res) _res = []

  glob(patterns.shift(),function(err,files){
    if(err) return cb(err)
    // filter for only files.
    filterFiles(files,function(err,files){
      if(err) return cb(err)
      _res.push.apply(_res,files)
      deglob(patterns,cb,_res)
    })
  })
}

function filterFiles(files,cb){
  cb = once(cb) 
  if(!files.length) return setImmediate(function(){
    cb(false,[])
  })

  var filtered = []

  var todo = files.length;

  work()
  work()
  work()

  function work(){
    if(!files.length) return
    
    var f = files.shift()
    fs.stat(f,function(err,stat){
      if(err) return cb(err)
      if(stat.isFile()) filtered.push(f)
      if(!--todo) cb(false,filtered)
      work()
    })
  }

}
