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
      expand: true,
      cwd: 'test/dist/',
      src: ['**/*.js']
    }
  ],

  options : {
    // working directory, to be stripped from filepaths
    // might work around it to use cwd in files...
    dir : 'test/dist',

    // length of the hash to be added
    hashLength : 8,

    // should we removed the source files?
    removeSources : true,

    // globbing pattern for files that sould not be processed with updated references
    // useful for libs, like jquery, or so - might speed up the whole process a bit
    noProcess : 'test/dist/vendor/**/*.js',

    // function to handle the hash map
    // so you can write the output to json or sth ;-)
    onComplete  : function ( map, files ) { ... }
  }
}
```

contributing
------------
since it's work in progress, i know there's a lot to do... but feel free to send in bugs, PRs here
