grunt-requirejs-cachebuster
===========================
the name says it all, doesn't it?
keep in mind, tho - it's **work in progress** ( you have been warned )

todos
-----
- skip processing for certain files
- support reading the config from requirejs config
- more sophisticated testing
- lots'more afaik...

sample:

```js
'requirejs-cachebuster' : {
  files : [
    'test/dist/**/*.js'
  ],

  options : {
    // working directory, to be stripped from filepaths
    // might work around it to use cwd in files...
    dir : 'test/dist',

    // length of the hash to be added
    hashLength : 8,

    // should we removed the source files?
    removeSources : 'true',

    // globbing pattern for files that sould not be processed with updated references
    // useful for libs, like jquery, or so - might speed up the whole process a bit
    noProcess : 'test/dist/vendor/**/*.js'
  }
}
```

contributing
------------
since it's work in progress, please don't file any bugs or PRs - i know there's a lot to do...
