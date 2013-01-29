basePath = '../';

files = [
  MOCHA,
  MOCHA_ADAPTER,
  //source files
  'app/js/lib/angular.js',
  'app/js/lib/angular-*.js',
  'build/app.js',

  //have to require the app module
  './run.js',
  
  //test assertion lib and mocks
  'node_modules/expect.js/expect.js',
  'test/lib/angular/angular-mocks.js',
  //main app module
  // 'app/js/app.js',
  //everything else
  // 'app/js/**/*.js',
  //tests to run
  'test/browser/**/*.js'
];

browsers = ['Chrome'];
require = 'expect';
reporters = ['dots'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
