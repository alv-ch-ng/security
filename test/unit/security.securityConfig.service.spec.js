;(function () {

    'use strict';

    describe('SecurityConfig', function () {

        var clientId = 'testClientId';
        var clientSecret = 'testClientSecret';
        var authPath = 'testAuthHost';
        var logoutPath = 'testLogoutEndpoint';
        var registerPath = 'testRegisterPath';
        var activationPath = "testActivationPath";
        var accountPath = 'testAccountPath';
        var resendPasswordPath = 'testResendPasswordPath';
        var newPasswordPath = 'testNewPasswordPath';
        var userIdParam = 'testIdAttribute';
        var authType = 'cookie';

        var provider;

        beforeEach(function() {
            angular.module('testApp', function () {})
                .config(function (SecurityConfigProvider) {
                    provider = SecurityConfigProvider;
                    provider.setClientId(clientId);
                    provider.setClientSecret(clientSecret);
                    provider.setAuthPath(authPath);
                    provider.setLogoutPath(logoutPath);
                    provider.setRegisterPath(registerPath);
                    provider.setActivationPath(activationPath);
                    provider.setAccountPath(accountPath);
                    provider.setResendPasswordPath(resendPasswordPath);
                    provider.setNewPasswordPath(newPasswordPath);
                    provider.setUserIdParam(userIdParam);
                    provider.setAuthType(authType);
                });

            module('alv-ch-ng.security', 'testApp');
        });

        it('"offers a clientId setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getClientId()).toEqual(clientId);
            });
        });

        it('"offers a clientSecret setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getClientSecret()).toEqual(clientSecret);
            });
        });

        it('"offers a tokenEndpoint setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getAuthPath()).toEqual(authPath);
            });
        });

        it('"offers a logoutEndpoint setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getLogoutPath()).toEqual(logoutPath);
            });
        });

        it('"offers a registerPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getRegisterPath()).toEqual(registerPath);
            });
        });

        it('"offers an activationPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getActivationPath()).toEqual(activationPath);
            });
        });

        it('"offers a accountPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getAccountPath()).toEqual(accountPath);
            });
        });

        it('"offers a resendPasswordPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getResendPasswordPath()).toEqual(resendPasswordPath);
            });
        });

        it('"offers a newPasswordPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getNewPasswordPath()).toEqual(newPasswordPath);
            });
        });

        it('"offers a userIdParam setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getUserIdParam()).toEqual(userIdParam);
            });
        });

        it('"offers a authType setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getAuthType()).toEqual(authType);
            });
        });

    });
}());
