/* */ 
(function(process) {
  'use strict';
  var utils = require('../utils');
  var transformData = require('./transformData');
  module.exports = function dispatchRequest(config) {
    config.headers = config.headers || {};
    config.data = transformData(config.data, config.headers, config.transformRequest);
    config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});
    utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
      delete config.headers[method];
    });
    var adapter;
    if (typeof config.adapter === 'function') {
      adapter = config.adapter;
    } else if (typeof XMLHttpRequest !== 'undefined') {
      adapter = require('../adapters/xhr');
    } else if (typeof process !== 'undefined') {
      adapter = require('../adapters/xhr');
    }
    return Promise.resolve(config).then(adapter).then(function onFulfilled(response) {
      response.data = transformData(response.data, response.headers, config.transformResponse);
      return response;
    }, function onRejected(error) {
      if (error && error.response) {
        error.response.data = transformData(error.response.data, error.response.headers, config.transformResponse);
      }
      return Promise.reject(error);
    });
  };
})(require('process'));
