/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

var config = require('../app.json');
var fs = require('fs');

// Reset sentry token
config.expo.hooks.postPublish[0].config.authToken = 'SENTRY_AUTH_TOKEN';

// write file from root diretory
fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
