;(function () {

    'use strict';
    describe('SecurityService', function () {

        beforeEach(module('alv-ch-ng.security'));

        it('"login()" passes silently when login is successful and no custom "_onLoginSuccess()" fn is set.', function() {
            inject(function ($httpBackend, SecurityService) {
                $httpBackend.expectPOST("oauth/token").respond(200, { 'userName': 'testUserName' });
                $httpBackend.expectGET("api/account").respond(200, { 'userName': 'testUserName' });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            })
        });

        it('"login()" executes a custom "_onLoginSuccess()" fn when login is successful.', function() {
            inject(function ($httpBackend, SecurityService) {
                var callback = {
                    fn: function(data) { }
                };
                spyOn(callback, 'fn');
                SecurityService.setOnLoginSuccess(callback.fn);
                $httpBackend.expectPOST("oauth/token").respond(200, { data: { 'userName': 'testUserName', roles: ['ADMIN'] }});
                $httpBackend.expectGET("api/account").respond(200, { 'userName': 'testUserName' });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(callback.fn).toHaveBeenCalled();
            })
        });

        it('"login()" is tolerant for null loginSuccess listeners', function() {
            inject(function ($httpBackend, SecurityService) {
                SecurityService.setOnLoginSuccess(null);
                $httpBackend.expectPOST("oauth/token").respond(200, { data: { 'userName': 'testUserName', roles: ['ADMIN'] }});
                $httpBackend.expectGET("api/account").respond(200, { 'userName': 'testUserName' });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            })
        });

        it('"login()" fails silently when login is not successful and no custom "_onLoginFail()" fn is set.', function() {
            inject(function ($httpBackend, SecurityService) {
                $httpBackend.expectPOST("oauth/token").respond(400, { 'userName': 'testUserName' });
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            })
        });

        it('"login()" executes a custom "_onLoginFail()" when login is not successful', function() {
            inject(function ($httpBackend, SecurityService) {
                $httpBackend.expectPOST("oauth/token").respond(400, { 'userName': 'testUserName' });
                SecurityService.setOnLoginFail(function() {
                    expect(true).toEqual(true);
                })
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
            })
        });

        it('"login()" is tolerant for null loginFail listeners', function() {
            inject(function ($httpBackend, SecurityService) {
                SecurityService.setOnLoginFail(null);
                $httpBackend.expectPOST("oauth/token").respond(400, { data: { 'userName': 'testUserName', roles: ['ADMIN'] }});
                SecurityService.login({ 'userName': 'testUserName', 'password': 'testPassword' });
                $httpBackend.flush();
                expect(true).toEqual(true);
            })
        });

        it('"logout()" sends a logout request to the api server and resets the Principal service.', function() {
            inject(function ($httpBackend, SecurityService, Principal) {
                Principal.authenticate({ 'userName': 'testUserName', 'password': 'testPassword' });
                expect(Principal.isAuthenticated()).toBeTruthy();
                $httpBackend.expectPOST("api/logout").respond(400, { 'userName': 'testUserName' });
                SecurityService.logout();
                $httpBackend.flush();
                expect(Principal.isAuthenticated()).toBeFalsy();
            })
        });

        it('"authorize()" calls _onLoginRequired if no identity is present but a role is needed', function() {
            inject(function ($rootScope, $httpBackend, SecurityService) {
                $rootScope.toState = {
                    data: {
                        roles: ['testRole']
                    }
                };
                $rootScope.toStateParams = {
                    anyName: 'anyValue'
                };
                $httpBackend.expectGET("api/account").respond(400);
                SecurityService.authorize();
                $httpBackend.flush();
                expect($rootScope.returnToState).toBe($rootScope.toState);
                expect($rootScope.returnToStateParams).toBe($rootScope.toStateParams);
            })
        });

        it('"authorize()" passes silently if no role is needed', function() {
            inject(function ($rootScope, $httpBackend, SecurityService) {
                var callback = {
                    required: function(data) { },
                    denied: function() { }
                };
                spyOn(callback, 'required');
                spyOn(callback, 'denied');
                SecurityService.setOnLoginRequired(callback.required);
                SecurityService.setOnAccessDenied(callback.denied);
                $rootScope.toState = {
                    data: {
                        roles: []
                    }
                };
                $httpBackend.expectGET("api/account").respond(400);
                SecurityService.authorize();
                $httpBackend.flush();
                expect(callback.required).not.toHaveBeenCalled();
                expect(callback.denied).not.toHaveBeenCalled();
            })
        });

        it('"authorize()" passes silently if access is granted', function() {
            inject(function ($rootScope, $httpBackend, SecurityService) {
                var callback = {
                    required: function(data) { },
                    denied: function() { }
                };
                spyOn(callback, 'required');
                spyOn(callback, 'denied');
                SecurityService.setOnLoginRequired(callback.required);
                SecurityService.setOnAccessDenied(callback.denied);
                $rootScope.toState = {
                    data: {
                        roles: ['grantingRole']
                    }
                };
                $httpBackend.expectGET("api/account").respond(200, { data: localPrincipal});
                SecurityService.authorize();
                $httpBackend.flush();
                expect(callback.required).not.toHaveBeenCalled();
                expect(callback.denied).not.toHaveBeenCalled();
            })
        });

        it('"authorize()" calls _onLoginRequired if no identity is present but a role is needed', function() {
            inject(function ($rootScope, $httpBackend, SecurityService) {
                $rootScope.toState = {
                    data: {
                        roles: ['testRole']
                    }
                };
                $rootScope.toStateParams = {
                    anyName: 'anyValue'
                };
                $httpBackend.expectGET("api/account").respond(400);
                SecurityService.authorize();
                $httpBackend.flush();
                expect($rootScope.returnToState).toBe($rootScope.toState);
                expect($rootScope.returnToStateParams).toBe($rootScope.toStateParams);
            })
        });

        it('"authorize()" calls _onAccessDenied when the required roles are not given', function() {
            inject(function ($rootScope, $httpBackend, SecurityService, Principal) {
                var cb = {
                    fn: function() { }
                };
                spyOn(cb, 'fn');
                SecurityService.setOnAccessDenied(cb.fn);
                Principal.authenticate(localPrincipal);
                $rootScope.toState = {
                    data: {
                        roles: ['mustHave']
                    }
                };
                SecurityService.authorize().then(function() {
                    expect(cb.fn).toHaveBeenCalled();
                });
            })
        });

        it('"authorize()" uses a custom accessDenied listener when set', function() {
            inject(function ($rootScope, $httpBackend, SecurityService) {
                var callback = {
                    fn: function(data) { console.log('tschatschatscha') }
                };
                spyOn(callback, 'fn');
                SecurityService.setOnAccessDenied(callback.fn);
                $rootScope.toState = {
                    data: {
                        roles: ['mustHave']
                    }
                };
                $httpBackend.expectGET("api/account").respond(200, {data: localPrincipal} );
                SecurityService.authorize();
                $httpBackend.flush();
                expect(callback.fn).toHaveBeenCalled();
            })
        });


        it('"register()" executes a request to "api/register" ', function() {
            inject(function ($httpBackend, SecurityService) {
                $httpBackend.expectPOST("api/register").respond(200, { 'userName': 'testUserName' });
                SecurityService.register({ 'userName': 'testUserName' }).success(function() {
                    expect(true).toEqual(true);
                });
                $httpBackend.flush();
            })
        });

        it('"updateAccount()" sends a valid request to "api/account/<key>"', function() {
            inject(function ($httpBackend, SecurityService) {
                $httpBackend.expectPOST('api/account/2', remotePrincipal ).respond(200, { data: remotePrincipal });
                SecurityService.updateAccount(remotePrincipal);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            })
        });

        it('"getAccount()" sends a request to "api/account/<key>"', function() {
            inject(function ($httpBackend, SecurityService) {
                $httpBackend.expectGET('api/account/2').respond(200, { data: remotePrincipal });
                SecurityService.getAccount(2);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            })
        });

        it('"changePassword()" sends a request to "api/account/<key>"', function() {
            inject(function ($httpBackend, SecurityService) {
                var newPassword = "testPW";
                $httpBackend.expectPOST('api/account/newPassword', {'newPassword': newPassword}).respond(200, { data: remotePrincipal });
                SecurityService.changePassword(newPassword);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            })
        });

        it('"resendPassword()" sends a request to "api/account/<key>"', function() {
            inject(function ($httpBackend, SecurityService) {
                var userName = "testUser";
                $httpBackend.expectPOST('api/account/resendPassword', {'userName': userName}).respond(200, { data: remotePrincipal });
                SecurityService.resendPassword(userName);
                $httpBackend.flush();
                expect(true).toEqual(true); // dummy, when $httpBackend is satisfied, all is fine
            })
        });

        afterEach(inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

    });
}());
