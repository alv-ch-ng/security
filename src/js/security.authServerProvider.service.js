;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('AuthServerProvider', ["$http", "localStorageService", "SecurityConfig", "base64", function($http, localStorageService, SecurityConfig, base64) {

        function createLoginData(credentials) {
            if (SecurityConfig.getAuthType() === 'oauth2') {
                return 'username=' + credentials.username + '&password=' +
                    credentials.password + '&grant_type=password&scope=read%20write&' +
                    'client_secret=' + SecurityConfig.getClientSecret() + '&client_id=' + SecurityConfig.getClientId() + "&response_type=code";
            } else {
                return 'j_username=' + encodeURIComponent(credentials.username) + '&j_password=' + encodeURIComponent(credentials.password) + '&submit=Login';
            }
        }

        function createLoginHeaders() {
            if (SecurityConfig.getAuthType() === 'oauth2') {
                return {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "Authorization": "Basic " + base64.encode(SecurityConfig.getClientId() + ':' + SecurityConfig.getClientSecret())
                };
            } else {
                return {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }

        }

        function createLoginRequest(data, headers) {
            return $http.post(SecurityConfig.getAuthPath(), data, {
                headers: headers,
                ignoreAuthModule: 'ignoreAuthModule'
            })
                .success(function (response) {
                    if (SecurityConfig.getAuthType() === 'oauth2') {
                        var expiredAt = new Date();
                        expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
                        response.expires_at = expiredAt.getTime();
                        localStorageService.set('auth_token', response);
                    }
                });
        }

        function login(credentials) {
            if (SecurityConfig.getAuthType() !== 'oauth2' && SecurityConfig.getAuthType() !== 'cookie') {
                throw new Error('No or unknown authType found: "' + SecurityConfig.getAuthType() + '".');
            }
            return createLoginRequest(createLoginData(credentials), createLoginHeaders());
        }

        function getToken() {
            return localStorageService.get('auth_token');
        }

        function hasValidToken() {
            var token = getToken();
            return token && token.expires_at && token.expires_at > new Date().getTime();
        }

        return {
            login: login,
            getToken: getToken,
            hasValidToken: hasValidToken
        };
    }]);

}());
