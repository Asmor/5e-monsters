(function() {
  'use strict';

  angular
    .module('app')
    .factory('logger', logger);

  logger.$inject = ['$log'];

  /* @ngInject */
  function logger($log) {
    var service = {
      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    };

    return service;
    /////////////////////

    function error(message, data, title) {
      $log.error('Error: ' + message, data);
    }

    function info(message, data, title) {
      $log.info('Info: ' + message, data);
    }

    function success(message, data, title) {
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      $log.warn('Warning: ' + message, data);
    }
  }
} ());
