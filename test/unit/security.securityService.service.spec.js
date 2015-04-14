;(function () {

    'use strict';
    describe('SecurityService', function () {

        beforeEach(module('alv-ch-ng.security'));

        it('"login()" passes silently when login is successful and no custom "_onLoginSuccess()" fn is set.', function() {
            inject(function ($rootScope, $httpBackend, SecurityService, SecurityConfig) {
                $httpBackend.expectPOST(SecurityConfig.getAuthPath()).respond(200, { 'userName': 'testUserName' });
                $httpBackend.expectGET(SecurityConfig.getAccountPath()).respond(200, { 'userName': 'testUserName' });
                $rootScope.back = function(){};
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            });
        });

        it('"login()" executes a custom "_onLoginSuccess()" fn when login is successful.', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                var callback = {
                    fn: function() { }
                };
                spyOn(callback, 'fn');
                SecurityService.setOnLoginSuccess(callback.fn);
                $httpBackend.expectPOST(SecurityConfig.getAuthPath()).respond(200, { data: { 'userName': 'testUserName', roles: ['ADMIN'] }});
                $httpBackend.expectGET(SecurityConfig.getAccountPath()).respond(200, { 'userName': 'testUserName' });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(callback.fn).toHaveBeenCalled();
            });
        });

        it('"login()" is tolerant for null loginSuccess listeners', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                SecurityService.setOnLoginSuccess(null);
                $httpBackend.expectPOST(SecurityConfig.getAuthPath()).respond(200, { data: { 'userName': 'testUserName', roles: ['ADMIN'] }});
                $httpBackend.expectGET(SecurityConfig.getAccountPath()).respond(200, { 'userName': 'testUserName' });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            });
        });

        it('"login()" fails silently when login is not successful and no custom "_onLoginFail()" fn is set.', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                $httpBackend.expectPOST(SecurityConfig.getAuthPath()).respond(400, { 'userName': 'testUserName' });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            });
        });

        it('"login()" executes a custom "_onLoginFail()" when login is not successful', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                $httpBackend.expectPOST(SecurityConfig.getAuthPath()).respond(400, { 'userName': 'testUserName' });
                SecurityService.setOnLoginFail(function() {
                    expect(true).toEqual(true);
                });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
            });
        });

        it('"login()" is tolerant for null loginFail listeners', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                SecurityService.setOnLoginFail(null);
                $httpBackend.expectPOST(SecurityConfig.getAuthPath()).respond(400, { data: { 'userName': 'testUserName', roles: ['ADMIN'] }});
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            });
        });

        it('"logout()" sends a logout request to the api server and resets the Principal service.', function() {
            inject(function ($httpBackend, SecurityService, Principal, SecurityConfig) {
                Principal.authenticate({ 'userName': 'testUserName', 'password': 'testPassword' });
                expect(Principal.isAuthenticated()).toBeTruthy();
                $httpBackend.expectPOST(SecurityConfig.getLogoutPath()).respond(400, { 'userName': 'testUserName' });
                SecurityService.logout();
                $httpBackend.flush();
                expect(Principal.isAuthenticated()).toBeFalsy();
            });
        });

        it('"register()" executes a request to "api/register" ', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                $httpBackend.expectPOST(SecurityConfig.getRegisterPath()).respond(200, { 'userName': 'testUserName' });
                SecurityService.register({ 'userName': 'testUserName' }).success(function() {
                    expect(true).toEqual(true);
                });
                $httpBackend.flush();
            });
        });

        it('"activateAccount()" executes a request to "api/activate" ', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                var data = { 'key': 'testKey' };
                $httpBackend.expectPOST(SecurityConfig.getActivationPath(), data).respond(200, { 'userName': 'testUserName' });
                SecurityService.activateAccount(data).success(function() {
                    expect(true).toEqual(true);
                });
                $httpBackend.flush();
            });
        });

        it('"updateAccount()" sends a valid request to "api/account/<key>"', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                $httpBackend.expectPOST(SecurityConfig.getAccountPath() + '/2', remotePrincipal ).respond(200, { data: remotePrincipal });
                SecurityService.updateAccount(remotePrincipal);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            });
        });

        it('"getAccount()" sends a request to "api/account/<key>"', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                $httpBackend.expectGET(SecurityConfig.getAccountPath() + '/2').respond(200, { data: remotePrincipal });
                SecurityService.getAccount(2);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            });
        });

        it('"changePassword()" sends a request to "api/account/newPassword"', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                var newPassword = "testPW";
                $httpBackend.expectPOST(SecurityConfig.getNewPasswordPath(), {'newPassword': newPassword}).respond(200, { data: remotePrincipal });
                SecurityService.changePassword(newPassword);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            });
        });

        it('"resendPassword()" sends a request to "api/account/resendPassword"', function() {
            inject(function ($httpBackend, SecurityService, SecurityConfig) {
                var userName = "testUser";
                $httpBackend.expectPOST(SecurityConfig.getResendPasswordPath(), {'userName': userName}).respond(200, { data: remotePrincipal });
                SecurityService.resendPassword(userName);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            });
        });

        afterEach(inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

    });
}());
