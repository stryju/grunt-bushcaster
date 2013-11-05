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
   * 2. build the reference list
   * 3. hash/update the references in recursive process
   * 4. profit
   */

  var path   = require( 'path' );
  var crypto = require( 'crypto' );

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
      } );
    } );
  }

  function isFunc( ref ) {
    return ref && typeof ref === 'function';
  }

  grunt.registerMultiTask( 'bushcaster', 'voodoo', function () {
    var options = this.options( {
      hashLength       : 8,
      hashAlgorithm    : 'md5',
      removeSource     : false,
      noProcess        : false,
      onComplete       : null,
      refPathTransform : null,
      requirejs        : true,
      encoding         : 'utf8'
    } );

    var referenceMap    = {};
    var fileList        = {};
    var map             = {};

    // build file list
    forEachFilename( this.files, function ( src, filename, dest, cwd ) {
      var ref = filename || src;
      var fixedRef = ref;

      if ( options.requirejs ) {
        fixedRef =
          fixedRef
            .replace( /\.js$/, '' )
            .replace( '\\', '/' );
      }

      if ( isFunc( options.refPathTransform ) ) {
        fixedRef = options.refPathTransform( fixedRef );
      }

      // escape chars for regexp
      fixedRef = fixedRef.replace( /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&' );

      var rex;
      if ( fixedRef === '' ) {
        grunt.verbose.writeln( ' ==> EMPTY FIXED REF: ' + src + ' > ' + filename );
      } else {
        rex = new RegExp( '(\'|\")(' + fixedRef + ')[\'|\"]', 'g' );
      }

      fileList[ src ] = {
        src        : src,
        filename   : filename,
        dest       : dest,
        destHashed : undefined,
        cwd        : cwd,
        regex      : rex,
        hash       : undefined
      };

      grunt.verbose.writeln( 'Adding file ' + JSON.stringify( fileList[ src ] ) + ', regex: (\'|\")(' + fixedRef + ')[\'|\"]' );
    } );

    // generate hashes
    grunt.verbose.subhead( 'building reference list' );

    // build reference list
    Object.keys( fileList ).forEach( function ( fileSrc ) {
      // read file source
      var source = grunt.file.read( fileSrc, { encoding: options.encoding } );
      referenceMap[ fileSrc ] = [];
      grunt.verbose.writeln( 'Searching for references in ' + fileSrc );

      Object.keys( fileList ).forEach( function ( refFileSrc ) {
        // and scan for references
        var regex = fileList[ refFileSrc ].regex;
        if ( regex && source.match( regex ) ) {
          grunt.verbose.writeln( '   Found reference ' + refFileSrc );
          referenceMap[ fileSrc ].push( refFileSrc );
        }
      } );
    } );

    function replace( source, file ) {
      return source.replace( file.regex, function ( match, quot, name ) {
        grunt.verbose.writeln( '    reference found: ' + match );
        if ( ! options.requirejs ) {
          var ext = path.extname( name );
          var realName = path.join( path.dirname( name ), path.basename( name, ext ) );
          return quot + realName + '-' + file.hash + ext + quot;
        } else {
          return quot + name + '-' + file.hash + quot;
        }
      } );
    }

    function hashFiles( files ) {
      var fileKeys = Object.keys( files );
      if ( ! files || ! fileKeys.length) {
        return;
      }

      var restFiles = {};
      fileKeys.forEach( function ( fileSrc ) {
        var file = fileList[ fileSrc ];
        if ( canBeHashed( file.src ) ) {
          grunt.verbose.writeln( '   Hashing file: ' + file.src );
          var source = grunt.file.read( file.src, { encoding: options.encoding } );

          // replace references with hash
          var hasOwnReference = false;
          referenceMap[ file.src ].forEach( function ( refFileSrc ) {
            // handle own references differently to avoid infinite loops
            if ( fileSrc !== refFileSrc ) {
              var refFile = fileList[ refFileSrc ];
              source = replace( source, refFile );
            } else {
              hasOwnReference = true;
            }
          } );

          // hash file after references have been updated (except own references)
          fileList[ file.src ].hash = crypto
            .createHash( options.hashAlgorithm )
            .update( source, options.encoding )
            .digest( 'hex' )
            .substr( 0, options.hashLength );

          // replace own reference with hash
          source = replace( source, fileList[ file.src ] );

          // build destination path with hash included
          var fileDest = file.dest ? file.cwd + file.dest : file.src;
          var fileDestSplit = fileDest.split('.');
          if ( fileDestSplit.length >= 2) {
            fileDestSplit[ fileDestSplit.length - 2 ] += '-' + fileList[ file.src ].hash;
          }
          fileList[ file.src ].destHashed = fileDestSplit.join( '.' );

          map[ file.dest || path.relative( file.cwd, file.src ) ] = path.relative( file.cwd, fileList[ file.src ].destHashed );

          grunt.file.copy( file.src, fileList[ file.src ].destHashed, { encoding: options.encoding,
            process: function () {
              // return source with updated references
              return source;
            },

            // skip those files for updating refs - handy for libs
            noProcess: options.noProcess
          } );
        } else if ( ! fileList[ file.src ].hash ) {
          grunt.verbose.writeln( '   Storing file: ' + file.src );
          restFiles[ file.src ] = file;
        }
      } );

      if ( Object.keys( restFiles ).length === fileKeys.length ) {
        grunt.fail.warn( 'Infinite loop while bushcasting ' + JSON.stringify( restFiles ) );
      }
      if ( Object.keys( restFiles ).length ) {
        hashFiles( restFiles );
      }
    }

    function canBeHashed( fileSrc) {
      if ( ! referenceMap [ fileSrc ].length ) {
        return true;
      }

      var nonHashedCount = 0;
      referenceMap[ fileSrc ].forEach( function ( refFileSrc ) {
        if ( ! fileList[ refFileSrc] .hash && refFileSrc !== fileSrc) {
          nonHashedCount++;
        }
      } );

      return nonHashedCount === 0;
    }

    // generate hashes
    grunt.verbose.subhead( 'hashing files and copying/updating references' );
    hashFiles( fileList );

    // remove source files for hashes, if desired
    if ( options.removeSource ) {
      grunt.verbose.subhead( 'deleting source files' );

      forEachFilename( this.files, function ( src ) {
        grunt.file.delete( src );
      } );
    }

    // do something with the map of hashes
    if ( isFunc( options.onComplete ) ) {
      grunt.verbose.subhead( 'executing onComplete' );
      options.onComplete( map, Object.keys( map ) );
    }

  } );
};
