Package.describe({
  name: 'kevb:secure-methods',
  summary: 'Secure meteor methods - a middleware approach',
  version: '0.0.1',
  git: 'https://github.com/kevb/meteor-secure-methods.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');
  api.use('underscore');
  api.mainModule('secure-methods.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ecmascript');
  api.use('kevb:secure-methods');
  api.mainModule('secure-methods.test.js', 'server');
});