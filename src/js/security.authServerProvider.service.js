;(function () {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('AuthServerProvider', function($http, localStorageService, SecurityConfig, Base64) {

        function login(credentials) {
            var data = 'username=' + credentials.username + '&password='
                + credentials.password + '&grant_type=password&scope=read%20write&' +
                'client_secret=' + SecurityConfig.getClientSecret() + '&client_id=' + SecurityConfig.getClientId();
            return $http.post(SecurityConfig.getTokenEndpoint(), data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "Authorization": "Basic " + Base64.encode("casksAndBottlesapp" + ':' + "mySecretOAuthSecret")
                }
            }).success(function (response) {
                var expiredAt = new Date();
                expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
                response.expires_at = expiredAt.getTime();
                localStorageService.set('token', response);
            });
        }

        function logout() {
            // logout from the server
            $http.post(SecurityConfig.getLogoutEndpoint()).then(function () {
                localStorageService.clearAll();
            });
        }

        function getToken() {
            return localStorageService.get('token');
        }

        function hasValidToken() {
            var token = this.getToken();
            return token && token.expires_at && token.expires_at > new Date().getTime();
        }

        return {
            login: login,
            logout: logout,
            getToken: getToken,
            hasValidToken: hasValidToken
        };
    });

}());
