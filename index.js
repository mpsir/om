var fs = require('fs');
const path = require('path');
// console.log(555);
eval(fs.readFileSync(__dirname + '/DB/d.js').toString());
eval(fs.readFileSync(__dirname + '/DB/r.js').toString());
eval(fs.readFileSync(__dirname + '/DB/f.js').toString());
eval(fs.readFileSync(__dirname + '/DB/App.js').toString());
console.log(555);
// console.log(f);