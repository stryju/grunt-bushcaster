/*
 * grunt-requirejs-cachebuster
 * https://github.com/stryju/grunt-hashmap-ext
 *
 * Copyright (c) 2013 tomasz stryjewski
 * Licensed under the MIT license.
 */

/* global
  module: false
*/

module.exports = function ( grunt ) {
  'use strict';

  /**
   * 1. grab the files
   * 2. md5 them
   * 3. update the references
   * 4. profit
   */

  var path   = require( 'path' );
  var crypto = require( 'crypto' );

  var hashes = {};

  // keeping it DRY
  function forEachFilename( files, base, callback ) {
    files.forEach( function ( file ) {
      file.src.forEach( function ( filepath ) {
        if ( ! grunt.file.exists( filepath ) ) {
          grunt.verbose.writeln( 'source file "' + filepath + '" not found' );
          return false;
        }

        if ( grunt.file.isDir( filepath ) ) {
          grunt.verbose.writeln( 'source file "' + filepath + '" seems to be a directory' );
          return false;
        }

        var filename;

        if ( base ) {
          filename = path.relative( base, filepath );
        }

        callback( filepath, filename );
      });
    });
  }

  grunt.registerMultiTask( 'requirejs-cachebuster', 'voodoo', function () {

    var options = this.options({
      hashLength : 8
    });
    var base    = options.dir ? path.resolve( options.dir ) : false;

    // generate hashes
    forEachFilename( this.files, base, function( filepath, filename ) {
      var source = grunt.file.read( filepath, {
        encoding : null
      });

      var hash = crypto
        .createHash( 'md5' )
        .update( source )
        .digest('hex')
        .substr( 0, options.hashLength );

      hashes[ filename || filepath ] = hash;

      grunt.log.writeln( filename || filepath, hash );
    });

    // now update the references
    forEachFilename( this.files, base, function( filepath, filename ) {
      var hashedFilename = filepath
        .replace( /\.js$/, '' ) + '-' + hashes[ filename || filepath ] + '.js';

      var fileRefs = Object.keys( hashes );

      grunt.file.copy( filepath, hashedFilename, {
        process : function ( content ) {
          fileRefs.forEach( function ( ref ) {
            console.log( '>>>', ref, hashes[ ref ] );

            var fixedRef = ref.replace( /\.js$/, '' ).replace( '\\', '/' );

            content = content
              .replace( '"' + fixedRef + '"', '"' + fixedRef + '-' + hashes[ ref ] + '"' );
          });

          return content;
        }
      } );
    });
  });
};
