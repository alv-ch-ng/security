;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('SecurityService', ['$rootScope', '$http', '$q', 'Principal', 'AuthServerProvider', 'SecurityConfig', '$window', 'localStorageService', function ($rootScope, $http, $q, Principal, AuthServerProvider, SecurityConfig, $window, localStorageService) {

        var _onLoginFail = function() {
            $rootScope.loginError = true;
        };

        var _onLoginSuccess = function(identity) {
            Principal.authenticate(identity);
            $rootScope.back();
        };

        function login(credentials) {
            AuthServerProvider.login(credentials).success(function (data) {
                var userData = decodeURIComponent($window.atob(data.access_token.split('.')[1])) ;
                var account = {
                    userName: userData.user_name,
                    roles: userData.authorities,
                    jti: userData.jti
                };
                Principal.authenticate(account);
                if (angular.isFunction(_onLoginSuccess)) {
                    _onLoginSuccess(account);
                }
            }).error(function (error) {
                if (angular.isFunction(_onLoginFail)) {
                    _onLoginFail(error);
                }
            });
        }

        function logout() {
            Principal.authenticate(null);
            localStorageService.clearAll();
        }

        function register(account) {
            return $http.post(SecurityConfig.getRegisterPath(), account);
        }

        function activateAccount(data) {
            return $http.post(SecurityConfig.getActivationPath(), data);
        }

        function updateAccount(account) {
            return $http.post(SecurityConfig.getAccountPath() + '/' + account[SecurityConfig.getUserIdParam()], account);
        }

        function getAccount(key) {
            return $http.get(SecurityConfig.getAccountPath() + '/' + key);
        }

        function changePassword(newPassword) {
            return $http.post(SecurityConfig.getNewPasswordPath(), {'newPassword': newPassword});
        }

        function resendPassword(userName) {
            return $http.post(SecurityConfig.getResendPasswordPath(), {'userName': userName});
        }

        return {
            login: login,
            logout: logout,
            updateAccount: updateAccount,
            activateAccount: activateAccount,
            getAccount: getAccount,
            register: register,
            changePassword: changePassword,
            resendPassword: resendPassword,
            setOnLoginSuccess: function(onLoginSuccess) { _onLoginSuccess =  onLoginSuccess; },
            setOnLoginFail: function(onLoginFail) { _onLoginFail =  onLoginFail; }
        };
    }]);

}());
