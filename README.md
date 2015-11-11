# fs-readstream-many

read a glob of files as a single read stream

```js
var readmany = require('fs-readstream-many')

var stream = readmany('./logs/*.log')

stream.on('files',function(files){
  console.log('data from files',files)
}).on('data',function(buf){
  console.log(buf)
})

```
