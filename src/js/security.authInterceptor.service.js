;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('authInterceptor', ["$rootScope", "$q", "$location", "localStorageService", function ($rootScope, $q, $location, localStorageService) {
        function addTokenIfNotExpired(token, config) {
            if (token && token.expires_at && new Date(token.expires_at).getTime() > new Date().getTime()) {
                config.headers.Authorization = 'Bearer ' + token.access_token;
            }
        }

        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                addTokenIfNotExpired(localStorageService.get('token'), config);
                return config;
            }
        };
    }]);

}());
