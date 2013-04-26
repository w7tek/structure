basePath = '../';

files = [
  MOCHA,
  MOCHA_ADAPTER,
  //source files
  'components/angular/angular.js',
  'components/angular-*/angular-*.js',
  //test assertion lib and mocks
  'node_modules/expect.js/expect.js',
  //main app module
  'js/app.js',
  //everything else
  'js/**/*.js',
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
