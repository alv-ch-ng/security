;(function () {

    'use strict';

    describe('Security module config', function () {

        beforeEach(function () {
            angular.module('testApp', function () {
            })
                .config(function ($stateProvider, $translateProvider) {
                    $stateProvider.state('site', {
                    });
                    $stateProvider.state('public', {
                        parent: 'site'
                    });
                    $stateProvider.state('authenticated', {
                        parent: 'site',
                        data: {
                            authenticated: true
                        }
                    });
                    $stateProvider.state('protected', {
                        parent: 'site',
                        data: {
                            roles: ['ROLE_TEST']
                        }
                    });

                    $translateProvider.useLoader('$translatePartialLoader', {
                        urlTemplate: 'i18n/{lang}/{part}.json'
                    });
                });

            module('alv-ch-ng.security', 'testApp');
        });

        it('registers a $stateChangeListener storing state and params to $rootScope', function() {
            inject(function ($rootScope) {
                var state = { stateAttr: 'testValue' };
                var params = { stateParam: 'testParamValue' };
                $rootScope.$broadcast('$stateChangeStart', state, params);
                expect($rootScope.toState).toBe(state);
                expect($rootScope.toStateParams).toBe(params);
            });
        });

        describe('registers a $stateChangeListener for access checks that', function () {
            it('does nothing, when the target state is unprotected', function() {
                inject(function ($rootScope, $state, SecurityService, Principal) {
                    spyOn(Principal, 'isIdentityResolved');
                    $state.go('public');
                    expect(Principal.isIdentityResolved).not.toHaveBeenCalled();
                });
            });

            it('checks authentication locally first', function() {
                inject(function ($rootScope, $state, $httpBackend, SecurityService, SecurityConfig, Principal) {
                    Principal.authenticate({});
                    spyOn(Principal, 'authenticate');
                    $state.go('authenticated');
                    $rootScope.$digest();
                    expect(Principal.authenticate).not.toHaveBeenCalled();
                    expect($state.current.name).toBe('authenticated');
                });
            });

            it('checks authentication remotely if local check was not successful', function() {
                inject(function ($rootScope, $state, $httpBackend, SecurityService, SecurityConfig, Principal) {
                    $httpBackend.expectGET(SecurityConfig.getAccountPath()).respond(200, {});
                    spyOn(Principal, 'authenticate');
                    $state.go('authenticated');
                    $httpBackend.flush();
                    expect(Principal.authenticate).toHaveBeenCalled();
                    expect($state.current.name).toBe('authenticated');
                });
            });

            it('redirects to login if local and remote checks were not successful', function() {
                inject(function ($rootScope, $state, $httpBackend, SecurityService, SecurityConfig) {
                    $httpBackend.expectGET(SecurityConfig.getAccountPath()).respond(401, {});
                    $state.go('authenticated');
                    spyOn($state, 'go');
                    $httpBackend.flush();
                    expect($state.go).toHaveBeenCalledWith('login');
                });
            });

            it('checks authorization successfully when required roles are present', function() {
                inject(function ($rootScope, $state, Principal) {
                    Principal.authenticate({roles: ['ROLE_TEST']});
                    $rootScope.toState = {
                        data: {
                            roles: ['ROLE_TEST']
                        }
                    };
                    $state.go('protected');
                    $rootScope.$digest();
                    expect($state.current.name).toBe('protected');
                });
            });

            it('checks authorization with failure when required roles are not present', function() {
                inject(function ($rootScope, $httpBackend, $state, Principal) {
                    $httpBackend.expectGET('template/alvchsecurity/accessdenied.html').respond(200, {});
                    Principal.authenticate({roles: ['ROLE_TESTFAIL']});
                    $rootScope.toState = {
                        data: {
                            roles: ['ROLE_TEST']
                        }
                    };
                    $state.go('protected');
                    $httpBackend.flush();
                    $rootScope.$digest();
                    expect($state.current.name).toBe('accessdenied');
                });
            });

            it('tries to fetch a remote account to check authorization', function() {
                inject(function ($rootScope, $httpBackend, $state) {
                    $httpBackend.expectGET('api/account').respond(200, {
                        roles: ['ROLE_TEST']
                    });
                    //$httpBackend.expectGET('template/alvchsecurity/accessdenied.html').respond(200, {});
                    $rootScope.toState = {
                        data: {
                            roles: ['ROLE_TEST']
                        }
                    };
                    $state.go('protected');
                    $httpBackend.flush();
                    $rootScope.$digest();
                    expect($state.current.name).toBe('protected');
                });
            });

            it('tries to fetch a remote account and fails if required roles are not presend', function() {
                inject(function ($rootScope, $httpBackend, $state) {
                    $httpBackend.expectGET('api/account').respond(200, {
                        roles: ['ROLE_TESTFAIL']
                    });
                    $httpBackend.expectGET('template/alvchsecurity/accessdenied.html').respond(200, {});
                    $rootScope.toState = {
                        data: {
                            roles: ['ROLE_TEST']
                        }
                    };
                    $state.go('protected');
                    $httpBackend.flush();
                    $rootScope.$digest();
                    expect($state.current.name).toBe('accessdenied');
                });
            });

            it('tries to fetch a remote account and redirects to login if account getting fails', function() {
                inject(function ($rootScope, $httpBackend, $state) {
                    $httpBackend.expectGET('api/account').respond(401, {
                        roles: ['ROLE_TESTFAIL']
                    });
                    $httpBackend.expectGET('template/alvchsecurity/login.html').respond(200, {});
                    $rootScope.toState = {
                        data: {
                            roles: ['ROLE_TEST']
                        }
                    };
                    $state.go('protected');
                    $httpBackend.flush();
                    $rootScope.$digest();
                    expect($state.current.name).toBe('login');
                });
            });
        });

        describe('states', function() {
            it('adds a login state with the required params', function() {
                inject(function ($state) {
                    var loginState = $state.get('login');
                    expect(loginState.name).toBe('login');
                    expect(loginState.parent).toBe('site');
                    expect(loginState.url).toBe('/login');
                    expect(loginState.views['content@'].templateUrl).toBe('template/alvchsecurity/login.html');
                    expect(loginState.views['content@'].controller).toBe('SecurityCtrl');
                    expect(loginState.hidden).toBeTruthy();
                    expect(loginState.data).toBeFalsy();
                });
            });

            it('adds a accessdenied state with the required params', function() {
                inject(function ($state) {
                    var loginState = $state.get('accessdenied');
                    expect(loginState.name).toBe('accessdenied');
                    expect(loginState.parent).toBe('site');
                    expect(loginState.url).toBe('/accessdenied');
                    expect(loginState.views['content@'].templateUrl).toBe('template/alvchsecurity/accessdenied.html');
                    expect(loginState.views['content@'].controller).toBeFalsy();
                    expect(loginState.hidden).toBeTruthy();
                });
            });
        });

    });
}());