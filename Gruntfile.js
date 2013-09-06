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
          appDir         : 'test/src/',
          mainConfigFile : 'test/src/config.js',
          dir            : '../test/dist',
          keepBuildDir   : true,

          // optimize       : 'uglify2',
          // removeCombined : true,

          modules : [
            {
              name    : 'main',
              exclude : [
                'module1/module'
              ]
            }
          ]
        }
      }
    }

  });

  grunt.registerTask(
    'default',
    [
      'jshint',
      'clean',
      'requirejs'
      // 'requirejs-cachebuster'
    ]
  );
};
