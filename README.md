grunt-bushcaster
===========================
cachebuster with a function to update references in the sources
(useful for requirejs dependencies)

todos
-----
- support reading the config from requirejs config
- more sophisticated testing
- lots'more afaik...

sample:

```js
'bushcaster' : {
  files : [
    {
      expand : true,
      cwd    : 'test/dist/',
      src    : [ '**/*.js' ],
      dest   : 'test/build/'
    }
  ],

  options : {

    // length of the hash to be added
    hashLength : 8,

    // should we removed the source files?
    removeSources : true,

    // globbing pattern for files that sould not be processed with updated references
    // useful for libs, like jquery, or so - might speed up the whole process a bit
    noProcess : 'test/dist/vendor/**/*.js',

    // function to handle the hash map
    // so you can write the output to json or sth ;-)
    // in this case, we write json AND php output of our map :-)
    onComplete  : function ( map, files ) {
      var arr = [];

      files.forEach( function ( file ) {
        arr.push( '\'' + file + '\'=>\'' + map[ file ] + '\'' );
      });

      var out = '<?php\n\n$files = [\n\t' + arr.join( ',\n\t' ) + '\n];\n';

      grunt.file.write( 'test/dist/map.php', out );
      grunt.file.write( 'test/dist/fap.json', JSON.stringify( map ) );
    }
  }
}
```

contributing
------------
since it's work in progress, i know there's a lot to do... but feel free to send in bugs, PRs here

version history
===============
* 0.0.3 2013-10-28 added first batch of tests, cleaned up
* 0.0.2 2013-10-28 added support for `dest` option
* 0.0.1 2013-10-28 ported requirejs-cachebuster task and renamed to bushcaster
