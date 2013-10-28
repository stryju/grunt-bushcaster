'use strict';

var grunt = require( 'grunt' );
var path  = require( 'path' );

exports[ 'grunt-bushcaster' ] = {
  setUp: function( done ) {
    // setup here if necessary
    done();
  },

  all: function( test ) {
    var testsNum = 0;

    grunt.file.recurse(
      [ 'test', 'expected' ].join( path.sep ),
      function ( abspath, rootdir, subdir, filename ) {
        var actual = grunt.file.read( [ 'tmp',  subdir, filename ].join( path.sep ) );
        var expected = grunt.file.read( abspath );

        test.equal( actual, expected, 'should hash and update references.' );

        testsNum ++;
      }
    );

    test.expect( testsNum );

    test.done();
  }
};
