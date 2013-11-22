# grunt-bushcaster

> cachebuster with a function to update references in the sources
> (useful for requirejs dependencies)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bushcaster --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bushcaster');
```

## The "bushcaster" task

### Overview
In your project's Gruntfile, add a section named `bushcaster` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bushcaster: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.hashLength
Type: `Number`
Default value: `8`

Length of the hash to be added.

#### options.removeSources
Type: `Boolean`
Default value: `false`

Should we removed the source files?

#### options.requirejs
Type: `Boolean`
Default value: `true`

Are we processing requirejs modules?
Some internal processing relies on this variable.

#### options.refPathTransform
Type: `Function`
Default value: `null`

Function to transform the updated reference (in case you need to change path? url?)

#### options.noProcess
Type: `String|Boolean`
Default value: `false`

Globbing pattern for files that sould not be processed with updated references.
Useful for libs, like jquery, or so - might speed up the whole process a bit.

#### options.onComplete
Type: `Function`
Default value: `null`

Function to handle the hash map, so you can write the output to json or sth ;-)

### Usage Examples

```js
grunt.initConfig({
  'bushcaster' : {
    test : {
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

        // globbing pattern for files that should not be processed with updated references
        // useful for libs, like jquery, or so - might speed up the whole process a bit
        noProcess : 'test/dist/vendor/**/*.js',

        // this is handy, if your module references' path differ from the current CWD structure
        // in  this example, we add 1 level of depth - the 'root/' folder
        refPathTransform : function ( ref ) {
           return 'root/' + ref;
        },

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
          grunt.file.write( 'test/dist/map.json', JSON.stringify( map ) );
        }
      }
    }
  }
})
```

## todos
- support reading the config from requirejs config
- more sophisticated testing
- lots'more afaik...

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 0.0.7 2013-11-22 fixed error with map / files objects not being purged for more than one task
* 0.0.6 2013-11-06 tweaked the way the requirejs references processing work ...oh, and docs
* 0.0.5 2013-10-30 erm... docs fix
* 0.0.4 2013-10-30 further cleaning, fixed keywords, improved docs, added a proper license
* 0.0.3 2013-10-28 added first batch of tests, cleaned up
* 0.0.2 2013-10-28 added support for `dest` option
* 0.0.1 2013-10-28 ported requirejs-cachebuster task and renamed to bushcaster
