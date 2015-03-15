;(function () {

    'use strict';
    describe('AuthServerProvider', function () {

        describe('with oauth2 authentication (default)', function () {

            beforeEach(function () {
                angular.module('testApp', function () {
                })
                    .config(function (SecurityConfigProvider) {
                        SecurityConfigProvider.setClientId(clientId);
                        SecurityConfigProvider.setClientSecret(clientSecret);
                        SecurityConfigProvider.setAuthPath(host);
                    });

                module('alv-ch-ng.security', 'testApp');
            });

            it('"login()" executes a request to ' + host + ' ', function () {
                inject(function ($httpBackend, AuthServerProvider) {
                    var data = 'username=testuser&password=testPW&grant_type=password&scope=read%20write&' +
                        'client_secret=' + clientSecret + '&client_id=' + clientId;
                    $httpBackend.expectPOST(host, data).respond(200, oauthToken);
                    AuthServerProvider.login(userLogin).success(function () {
                        expect(true).toBeTruthy();
                    });
                    $httpBackend.flush();
                });
            });

            it('"logout()" executes a request to "api/logout" and clears the localStorageService', function () {
                inject(function ($httpBackend, AuthServerProvider, localStorageService, SecurityConfig) {
                    spyOn(localStorageService, 'clearAll');
                    $httpBackend.expectPOST(SecurityConfig.getLogoutPath()).respond(200, {});
                    AuthServerProvider.logout();
                    $httpBackend.flush();
                    expect(localStorageService.clearAll).toHaveBeenCalled();
                });
            });

            it('"getToken()" returns the persisted token when set', function () {
                inject(function ($httpBackend, AuthServerProvider, localStorageService) {
                    localStorageService.clearAll();
                    expect(AuthServerProvider.getToken()).toBeNull();
                    localStorageService.set('token', "myFreshToken");
                    expect(AuthServerProvider.getToken()).toEqual("myFreshToken");
                });
            });

            it('"hasValidToken()" determines a correct state', function () {
                inject(function ($httpBackend, AuthServerProvider, localStorageService) {
                    localStorageService.clearAll();
                    var expiredAt = new Date();
                    expiredAt.setSeconds(expiredAt.getSeconds() + 20);
                    localStorageService.set('token', {expires_at: expiredAt.getTime()});
                    expect(AuthServerProvider.hasValidToken()).toBeTruthy();

                    localStorageService.clearAll();
                    expiredAt = new Date();
                    expiredAt.setSeconds(expiredAt.getSeconds() - 20);
                    localStorageService.set('token', {expires_at: expiredAt.getTime()});
                    expect(AuthServerProvider.hasValidToken()).toBeFalsy();
                });
            });

            afterEach(inject(function ($httpBackend) {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            }));
        });

        describe('with cookie based authentication', function () {

            beforeEach(function () {
                angular.module('testApp', function () {
                })
                    .config(function (SecurityConfigProvider) {
                        SecurityConfigProvider.setAuthType('cookie');
                        SecurityConfigProvider.setAuthPath('api/login');
                    });

                module('alv-ch-ng.security', 'testApp');
            });

            it('"login()" executes a request to "api/login" ', function () {
                inject(function ($httpBackend, AuthServerProvider) {
                    var data = 'j_username=' + encodeURIComponent(userLogin.username) + '&j_password=' + encodeURIComponent(userLogin.password) + '&submit=Login';
                    $httpBackend.expectPOST('api/login', data).respond(200, oauthToken);
                    AuthServerProvider.login(userLogin).success(function () {
                        expect(true).toBeTruthy();
                    });
                    $httpBackend.flush();
                });
            });

            afterEach(inject(function ($httpBackend) {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            }));
        });

        describe('with unknown authentication type', function () {

            beforeEach(function () {
                angular.module('testApp', function () {
                })
                    .config(function (SecurityConfigProvider) {
                        SecurityConfigProvider.setAuthType('unknown');
                    });

                module('alv-ch-ng.security', 'testApp');
            });

            it('"login()" throws an error', function () {
                inject(function (AuthServerProvider) {
                    expect(AuthServerProvider.login).toThrow(new Error('No or unknown authType found: "unknown".'));
                });
            });

            afterEach(inject(function ($httpBackend) {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            }));
        });

    });
}());
