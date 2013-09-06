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
    dir : 'test/dist'
  }
}
```

contributing
------------
since it's work in progress, please don't file any bugs or PRs - i know there's a lot to do...
