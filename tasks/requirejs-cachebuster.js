/*
 * grunt-requirejs-cachebuster
 * https://github.com/stryju/grunt-hashmap-ext
 *
 * Copyright (c) 2013 tomasz stryjewski
 * Licensed under the MIT license.
 */

/* global
  module: false,
  console: false
*/
module.exports = function ( grunt ) {
  'use strict';

  /**
   * 1. grab the files
   * 2. md5 them
   * 3. update the references
   * 4. profit
   */

  // var fs     = require( 'fs' );
  // var path   = require( 'path' );
  // var crypto = require( 'crypto' );

  grunt.registerMultiTask( 'requirejs-cachebuster', 'voodoo', function () {

    this.files.forEach( function ( file ) {
      console.log( file );
    });
  });
};
