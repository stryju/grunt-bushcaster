/* global
  require: false
*/

require( 'require-config', function () {
  'use strict';

  require([
    'module1/module',
    'module2',
    'lib'
  ], function ( Module1, Module2, awesomeLib ) {
    Module1.foo();
    Module2.foo();

    awesomeLib();
  });
});
