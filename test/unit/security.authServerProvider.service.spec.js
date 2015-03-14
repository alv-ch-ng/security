;(function () {

    'use strict';
    describe('AuthServerProvider', function () {

        var clientId = 'testClientId';
        var clientSecret = 'testClientSecret';
        var host = 'oauth/token';

        beforeEach(function() {
            angular.module('testApp', function () {})
                .config(function (SecurityConfigProvider) {
                    SecurityConfigProvider.setClientId(clientId);
                    SecurityConfigProvider.setClientSecret(clientSecret);
                    SecurityConfigProvider.setTokenEndpoint(host);
                });

            module('alv-ch-ng.security', 'testApp');
        });

        it('"login()" executes a request to ' + host + ' ', function() {
            inject(function ($httpBackend, AuthServerProvider) {
                var data = 'username=testuser&password=testPW&grant_type=password&scope=read%20write&' +
                    'client_secret=' + clientSecret + '&client_id=' + clientId;
                $httpBackend.expectPOST(host, data).respond(200, { expires_in: 11, key: '1234567890' });
                AuthServerProvider.login({ 'username': 'testuser', 'password': 'testPW'}).success(function() {
                    expect(true).toBeTruthy();
                });
                $httpBackend.flush();
            })
        });

        it('"logout()" executes a request to "api/logout and clears the localStorageService" ', function() {
            inject(function ($httpBackend, AuthServerProvider, localStorageService) {
                spyOn(localStorageService, 'clearAll');
                $httpBackend.expectPOST("api/logout").respond(200, {});
                AuthServerProvider.logout();
                $httpBackend.flush();
                expect(localStorageService.clearAll).toHaveBeenCalled();
            })
        });

        it('"getToken()" returns the persisted token when set', function() {
            inject(function ($httpBackend, AuthServerProvider, localStorageService) {
                localStorageService.clearAll();
                expect(AuthServerProvider.getToken()).toBeNull();
                localStorageService.set('token', "myFreshToken");
                expect(AuthServerProvider.getToken()).toEqual("myFreshToken");
            })
        });

        it('"hasValidToken()" determines a correct state', function() {
            inject(function ($httpBackend, AuthServerProvider, localStorageService) {
                localStorageService.clearAll();
                var expiredAt = new Date();
                expiredAt.setSeconds(expiredAt.getSeconds() + 20);
                localStorageService.set('token', { expires_at: expiredAt.getTime() });
                expect(AuthServerProvider.hasValidToken()).toBeTruthy();

                localStorageService.clearAll();
                expiredAt = new Date();
                expiredAt.setSeconds(expiredAt.getSeconds() - 20);
                localStorageService.set('token', { expires_at: expiredAt.getTime() });
                expect(AuthServerProvider.hasValidToken()).toBeFalsy();
            })
        });

        afterEach(inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

    });
}());
