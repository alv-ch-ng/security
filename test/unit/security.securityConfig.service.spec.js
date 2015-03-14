;(function () {

    'use strict';

    describe('SecurityConfig', function () {

        var clientId = 'testClientId';
        var clientSecret = 'testClientSecret';
        var tokenEndpoint = 'testAuthHost';
        var logoutEndpoint = 'testLogoutEndpoint';
        var registerPath = 'testRegisterPath';
        var accountPath = 'testAccountPath';
        var resendPasswordPath = 'testResendPasswordPath';
        var newPasswordPath = 'testNewPasswordPath';

        var provider;

        beforeEach(function() {
            angular.module('testApp', function () {})
                .config(function (SecurityConfigProvider) {
                    provider = SecurityConfigProvider;
                    provider.setClientId(clientId);
                    provider.setClientSecret(clientSecret);
                    provider.setTokenEndpoint(tokenEndpoint);
                    provider.setLogoutEndpoint(logoutEndpoint);
                    provider.setRegisterPath(registerPath);
                    provider.setAccountPath(accountPath);
                    provider.setResendPasswordPath(resendPasswordPath);
                    provider.setNewPasswordPath(newPasswordPath);
                });

            module('alv-ch-ng.security', 'testApp');
        });

        it('"offers a clientId setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getClientId()).toEqual(clientId);
            })
        });

        it('"offers a clientSecret setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getClientSecret()).toEqual(clientSecret);
            })
        });

        it('"offers a tokenEndpoint setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getTokenEndpoint()).toEqual(tokenEndpoint);
            })
        });

        it('"offers a logoutEndpoint setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getLogoutEndpoint()).toEqual(logoutEndpoint);
            })
        });

        it('"offers a registerPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getRegisterPath()).toEqual(registerPath);
            })
        });

        it('"offers a accountPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getAccountPath()).toEqual(accountPath);
            })
        });

        it('"offers a resendPasswordPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getResendPasswordPath()).toEqual(resendPasswordPath);
            })
        });

        it('"offers a newPasswordPath setter" ', function() {
            inject(function (SecurityConfig) {
                expect(SecurityConfig.getNewPasswordPath()).toEqual(newPasswordPath);
            })
        });

    });
}());
