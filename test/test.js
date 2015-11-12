var test = require('tape')
var readmany = require('../')
var eos = require('end-of-stream')
var fs = require('fs')

test("can",function(t){

  t.plan(3)

  var expected = Buffer.concat([
      fs.readFileSync(__dirname+'/fixtures/a.log'),
      fs.readFileSync(__dirname+'/fixtures/b.log'),
      fs.readFileSync(__dirname+'/fixtures/c.log'),
  ])+''

  var bufs = []

  var s = readmany(__dirname+'/fixtures/*.log')

  s.on('files',function(files){
    t.equals(files.length,3)
  })

  s.on('data',function(data){
    bufs.push(data)
  })

  eos(s,function(err){
    t.ok(!err,'should not have error!')
    t.equals(Buffer.concat(bufs)+'',expected,'should have read all files in correct order')
  })

})



test("ends when there are no files.",function(t){
  var s = readmany(__dirname+'/fixtures/*.doesnt-exist')
  s.on('data',function(){})
  eos(s,function(err){
    t.ok(!err,'should not have error')
    t.end()
  })
})
