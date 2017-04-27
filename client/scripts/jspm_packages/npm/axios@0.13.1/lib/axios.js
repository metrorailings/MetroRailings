/* */ 
'use strict';
var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);
  utils.extend(instance, Axios.prototype, context);
  utils.extend(instance, context);
  return instance;
}
var axios = module.exports = createInstance();
axios.Axios = Axios;
axios.create = function create(defaultConfig) {
  return createInstance(defaultConfig);
};
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');
