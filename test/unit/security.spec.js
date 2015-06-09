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

            it('redirects to login if local and remote checks were not successful', function() {
                inject(function ($rootScope, $state, $httpBackend) {
                    $httpBackend.expectGET('template/security/login.html').respond(200, '');
                    $state.go('authenticated');
                    $httpBackend.flush();
                    $rootScope.$digest();
                    expect($state.current.name).toBe('login');
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
                    $httpBackend.expectGET('template/security/accessdenied.html').respond(200, {});
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

        });

        describe('states', function() {
            it('adds a login state with the required params', function() {
                inject(function ($state) {
                    var loginState = $state.get('login');
                    expect(loginState.name).toBe('login');
                    expect(loginState.parent).toBe('site');
                    expect(loginState.url).toBe('/login');
                    expect(loginState.views['content@'].templateUrl).toBe('template/security/login.html');
                    expect(loginState.views['content@'].controller).toBe('LoginCtrl');
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
                    expect(loginState.views['content@'].templateUrl).toBe('template/security/accessdenied.html');
                    expect(loginState.views['content@'].controller).toBeFalsy();
                    expect(loginState.hidden).toBeTruthy();
                });
            });
        });

    });
}());
