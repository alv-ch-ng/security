;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('SecurityService', ['$rootScope', '$http', '$q', 'Principal', 'AuthServerProvider', 'SecurityConfig', function ($rootScope, $http, $q, Principal, AuthServerProvider, SecurityConfig) {

        var _onLoginFail = function() {
            $rootScope.loginError = true;
        };

        var _onLoginSuccess = function(identity) {
            Principal.authenticate(identity);
            $rootScope.back();
        };

        function login(credentials) {
            AuthServerProvider.login(credentials).success(function () {
                $http.get(SecurityConfig.getAccountPath()).success(function(account) {
                    Principal.authenticate(account);
                    if (angular.isFunction(_onLoginSuccess)) {
                        _onLoginSuccess(account);
                    }
                });
            }).error(function (error) {
                if (angular.isFunction(_onLoginFail)) {
                    _onLoginFail(error);
                }
            });
        }

        function logout() {
            AuthServerProvider.logout();
            Principal.authenticate(null);
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

        function getUserAccount() {
            return $http.get(SecurityConfig.getAccountPath());
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
            getUserAccount: getUserAccount,
            register: register,
            changePassword: changePassword,
            resendPassword: resendPassword,
            setOnLoginSuccess: function(onLoginSuccess) { _onLoginSuccess =  onLoginSuccess; },
            setOnLoginFail: function(onLoginFail) { _onLoginFail =  onLoginFail; }
        };
    }]);

}());
