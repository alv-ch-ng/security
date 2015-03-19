;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('SecurityService', ['$rootScope', '$http', '$q', 'Principal', 'AuthServerProvider', 'SecurityConfig', function ($rootScope, $http, $q, Principal, AuthServerProvider, SecurityConfig) {

        var _onAccessDenied = function() { };
        var _onLoginFail = function() {};

        var _onLoginSuccess = function(identity) {
            Principal.authenticate(identity);
        };

        var _onLoginRequired = function() {
            $rootScope.returnToState = $rootScope.toState;
            $rootScope.returnToStateParams = $rootScope.toStateParams;
        };

        function login(credentials) {
            AuthServerProvider.login(credentials).success(function () {
                Principal.identity(true).then(function(account) {
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

        function authorize() {
            return Principal.identity(false, function() {
                if ($rootScope.toState.data.roles &&
                    $rootScope.toState.data.roles.length > 0 &&
                    !Principal.isInAnyRole($rootScope.toState.data.roles)) {
                    _onAccessDenied();
                }
            })
            .then(function() {
                if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0) {
                    if (!Principal.isIdentityResolved()) {
                        _onLoginRequired();
                    } else if (!Principal.isInAnyRole($rootScope.toState.data.roles) && angular.isFunction(_onAccessDenied)) {
                        _onAccessDenied();
                    }
                }
            });
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
            authorize: authorize,
            updateAccount: updateAccount,
            activateAccount: activateAccount,
            getAccount: getAccount,
            register: register,
            changePassword: changePassword,
            resendPassword: resendPassword,
            setOnLoginSuccess: function(onLoginSuccess) { _onLoginSuccess =  onLoginSuccess; },
            setOnLoginFail: function(onLoginFail) { _onLoginFail =  onLoginFail; },
            setOnAccessDenied: function(onAccessDenied) { _onAccessDenied =  onAccessDenied; },
            setOnLoginRequired: function(onLoginRequired) { _onLoginRequired =  onLoginRequired; }
        };
    }]);

}());

