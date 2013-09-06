/* global
  define: false
*/

define([
  'module1/module',
  'module2/module',
  'vendor/lib'
], function ( Module1, Module2, awesomeLib ) {
  'use strict';

  Module1.foo();
  Module2.foo();

  awesomeLib();
});
