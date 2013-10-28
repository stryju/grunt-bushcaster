/*global
  module: false,
  require: false
*/

module.exports = function ( grunt ) {
  'use strict';

  require('time-grunt')
    ( grunt );

  require( 'matchdep' )
    .filterDev( 'grunt-contrib*' )
      .forEach( grunt.loadNpmTasks );

  grunt.loadTasks( 'tasks' );

  grunt.initConfig({
    pkg : grunt.file.readJSON( 'package.json' ),

    clean : {
      scripts : 'test/dist',
    },

    jshint : {
      options : {
        jshintrc : '.jshintrc'
      },
      files : {
        src : [
          'Gruntfile.js',
          'test/src/**/*.js',
          '!test/src/vendor/**/*.js'
        ]
      }
    },

    requirejs : {
      test : {
        options : {
          appDir         : 'test/src',
          baseUrl        : '.',
          mainConfigFile : 'test/src/require-config.js',
          dir            : 'test/dist',
          keepBuildDir   : true,

          optimize       : 'uglify2',
          removeCombined : true,

          modules : [
            {
              name    : 'main',
              exclude : [
                'vendor/lib',
                'module1/module'
              ]
            }
          ]
        }
      }
    },

    'bushcaster' : {
      test : {
        files : [
          {
            expand: true,
            cwd: 'test/dist/',
            src: ['**/*.js']
            // dest: 'test/build/'
          }
        ],

        options : {
          hashLength   : 8,
          removeSource : true,
          noProcess    : 'test/dist/vendor/**/*.js',
          onComplete   : function ( map, files ) {
            var arr = [];

            files.forEach( function ( file ) {
              arr.push( '\'' + file + '\'=>\'' + map[ file ] + '\'' );
            });

            var out = '<?php $files = [' + arr.join( ',' ) + '];';

            grunt.file.write( 'test/dist/file.php', out );
          }
        }
      }
    }
  });

  grunt.registerTask(
    'default',
    [
      'jshint',
      'clean:scripts',
      'requirejs',
      'bushcaster'
    ]
  );
};
