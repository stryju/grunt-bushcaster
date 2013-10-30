/*
 * grunt-bushcaster
 * https://github.com/stryju/grunt-bushcaster
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
  var map    = {};

  // keeping it DRY
  function forEachFilename( files, callback ) {
    files.forEach( function ( file ) {
      file.src.forEach( function ( src ) {
        if ( ! grunt.file.exists( src ) ) {
          grunt.verbose.writeln( 'source file "' + src + '" not found' );
          return false;
        }

        if ( grunt.file.isDir( src ) ) {
          grunt.verbose.writeln( 'source file "' + src + '" seems to be a directory' );
          return false;
        }

        var filename = path.relative( file.orig.cwd, src );

        callback( src, filename, file.dest, file.orig.cwd );
      });
    });
  }

  grunt.registerMultiTask( 'bushcaster', 'voodoo', function () {
    var options = this.options({
      hashLength   : 8,
      removeSource : false,
      noProcess    : false,
      onComplete   : null
    });

    // generate hashes
    grunt.verbose.subhead( 'hashing files' );

    forEachFilename( this.files, function ( src, filename ) {
      var source = grunt.file.read( src, {
        encoding : null
      });

      var hash = crypto
        .createHash( 'md5' )
        .update( source )
        .digest('hex')
        .substr( 0, options.hashLength );

      hashes[ filename || src ] = hash;

      grunt.log.writeln( filename || src, hash );
    });

    // // now update the references
    grunt.verbose.subhead( 'copying files and updating references' );

    forEachFilename( this.files, function ( src, filename, dest, cwd ) {
      var hash           = hashes[ filename || src ];
      var hashedFilename = ( dest ? cwd + dest : src )
        .replace( /(\.\w+)$/, '-' + hash + '$1' );

      map[ dest || path.relative( cwd, src ) ] = path.relative( cwd, hashedFilename );

      var fileRefs = Object.keys( hashes );

      grunt.file.copy( src, hashedFilename, {
        process : function ( content, filepath ) {
          grunt.verbose.writeln();
          grunt.verbose.write( '  updating refs in ' + filepath + '...' );

          fileRefs.forEach( function ( ref ) {
            var fixedRef = ref.replace( /\.js$/, '' ).replace( '\\', '/' );

            content = content
              .replace( '"' + fixedRef + '"', '"' + fixedRef + '-' + hashes[ ref ] + '"' );
          });

          return content;
        },

        // skip those files for updating refs - handy for libs
        noProcess : options.noProcess
      });
    });

    // remove source files for hashes, if desired
    if ( options.removeSource ) {
      grunt.verbose.subhead( 'deleting source files' );

      forEachFilename( this.files, function ( src ) {
        grunt.file.delete( src );
      });
    }

    // do something with the map of hashes
    if ( options.onComplete && typeof options.onComplete === 'function' ) {
      grunt.verbose.subhead( 'executing onComplete' );
      options.onComplete( map, Object.keys( map ) );
    }

  });
};
