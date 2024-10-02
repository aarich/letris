/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

var config = require('../app.json');
var fs = require('fs');

// write file from root diretory
fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
