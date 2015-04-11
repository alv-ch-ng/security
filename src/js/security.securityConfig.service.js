;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.provider('SecurityConfig', function () {

        var _clientId = '';
        var _clientSecret = '';
        var _authPath = 'oauth/token';
        var _logoutPath = 'api/logout';
        var _registerPath = 'api/register';
        var _activationPath = 'api/activate';
        var _accountPath = 'api/account';
        var _resendPasswordPath = 'api/account/resendPassword';
        var _newPasswordPath = 'api/account/newPassword';
        var _userIdParam = 'key';
        var _authType = 'oauth2';


        this.setClientId = function(clientId) {
            _clientId = clientId;
        };

        this.setClientSecret = function(clientSecret) {
            _clientSecret = clientSecret;
        };

        this.setAuthPath = function(authPath) {
            _authPath = authPath;
        };

        this.setLogoutPath = function(logoutPath) {
            _logoutPath = logoutPath;
        };

        this.setRegisterPath = function(registerPath) {
            _registerPath = registerPath;
        };

        this.setActivationPath = function(activationPath) {
            _activationPath = activationPath;
        };

        this.setAccountPath = function(accountPath) {
            _accountPath = accountPath;
        };

        this.setResendPasswordPath = function(resendPasswordPath) {
            _resendPasswordPath = resendPasswordPath;
        };

        this.setNewPasswordPath = function(newPasswordPath) {
            _newPasswordPath = newPasswordPath;
        };

        this.setUserIdParam = function(userIdParam) {
            _userIdParam = userIdParam;
        };

        this.setAuthType = function(authType) {
            _authType = authType;
        };

        this.$get = function() {
            return {
                getClientId: function() { return _clientId; },
                getClientSecret: function() { return _clientSecret; },
                getAuthPath: function() { return _authPath; },
                getLogoutPath: function() { return _logoutPath; },
                getRegisterPath: function() { return _registerPath; },
                getActivationPath: function() { return _activationPath; },
                getAccountPath: function() { return _accountPath; },
                getResendPasswordPath: function() { return _resendPasswordPath; },
                getNewPasswordPath: function() { return _newPasswordPath; },
                getUserIdParam: function() { return _userIdParam; },
                getAuthType: function() { return _authType; }
            };
        };
    });

}());
