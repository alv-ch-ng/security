;
(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.provider('SecurityConfig', function () {

        var _clientId = '';
        var _clientSecret = '';
        var _tokenEndpoint = 'oauth/token';
        var _logoutEndpoint = 'api/logout';
        var _registerPath = "api/register";
        var _accountPath = "api/account";
        var _resendPasswordPath = "api/account/resendPassword";
        var _newPasswordPath = "api/account/newPassword";


        this.setClientId = function(clientId) {
            _clientId = clientId;
        };

        this.setClientSecret = function(clientSecret) {
            _clientSecret = clientSecret;
        };

        this.setTokenEndpoint = function(tokenEndpoint) {
            _tokenEndpoint = tokenEndpoint;
        };

        this.setLogoutEndpoint = function(logoutEndpoint) {
            _logoutEndpoint = logoutEndpoint;
        };

        this.setRegisterPath = function(registerPath) {
            _registerPath = registerPath;
        }

        this.setAccountPath = function(accountPath) {
            _accountPath = accountPath;
        }

        this.setResendPasswordPath = function(resendPasswordPath) {
            _resendPasswordPath = resendPasswordPath;
        }

        this.setNewPasswordPath = function(newPasswordPath) {
            _newPasswordPath = newPasswordPath;
        }

        this.$get = function() {
            return {
                getClientId: function() { return _clientId; },
                getClientSecret: function() { return _clientSecret; },
                getTokenEndpoint: function() { return _tokenEndpoint; },
                getLogoutEndpoint: function() { return _logoutEndpoint; },
                getRegisterPath: function() { return _registerPath; },
                getAccountPath: function() { return _accountPath; },
                getResendPasswordPath: function() { return _resendPasswordPath; },
                getNewPasswordPath: function() { return _newPasswordPath; }
            }
        }

    });

}());

