/* global
  require: false
*/

require.config({
  shim : {
    lib : {
      exports: 'superLib'
    }
  },

  paths : {
    lib     : 'vendor/lib',
    module2 : 'module2/module'
  }
});
