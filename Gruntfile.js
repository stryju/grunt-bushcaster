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
      tests : 'tmp',
    },

    jshint : {
      options : {
        jshintrc : '.jshintrc'
      },
      files : {
        src : [
          'Gruntfile.js',
          'test/fixtures/**/*.js',
          '!test/fixtures/vendor/**/*.js'
        ]
      }
    },

    requirejs : {
      test : {
        options : {
          appDir         : 'test/fixtures',
          baseUrl        : '.',
          mainConfigFile : 'test/fixtures/require-config.js',
          dir            : 'tmp',
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

    nodeunit: {
      tests: [
        'test/*_test.js'
      ]
    },

    'bushcaster' : {
      test : {
        files : [
          {
            expand : true,
            cwd    : 'tmp/',
            src    : [ '**/*.js' ],
            // dest   : 'test/build/'
          }
        ],

        options : {
          hashLength       : 8,
          removeSource     : true,
          requirejs        : true,
          noProcess        : 'test/dist/vendor/**/*.js',
          // refPathTransform : function ( ref ) {
          //   return 'x__' + ref;
          // },
          onComplete       : function ( map, files ) {
            var arr = [];

            files.forEach( function ( file ) {
              arr.push( '\'' + file + '\'=>\'' + map[ file ] + '\'' );
            });

            var out = '<?php\n\n$files = [\n\t' + arr.join( ',\n\t' ) + '\n];\n';

            grunt.file.write( 'tmp/map.php', out );
            grunt.file.write( 'tmp/map.json', JSON.stringify( map ) );
          }
        }
      }
    }
  });

  grunt.registerTask(
    'default',
    [
      'jshint',
      'clean',
      'requirejs',
      'bushcaster',
      'nodeunit'
    ]
  );
};
