;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security', ['ngResource', 'ui.router', 'LocalStorageModule', 'pascalprecht.translate', 'ab-base64']);

    module.config(function ($stateProvider) {
        $stateProvider.state('login', {
            parent: 'site',
            url: '/login',
            views: {
                'content@': {
                    templateUrl: 'template/security/login.html',
                    controller: 'LoginCtrl'
                }
            },
            hidden: true
        });
        $stateProvider.state('accessdenied', {
            parent: 'site',
            url: '/accessdenied',
            views: {
                'content@': {
                    templateUrl: 'template/security/accessdenied.html'
                }
            },
            hidden: true
        });
    });

    module.run(function($rootScope, Principal, $state, $http, $window, SecurityService, localStorageService) {

        var STATE_LOGIN = 'login';
        var STATE_ACCESS_DENIED = 'accessdenied';

        var token = localStorageService.get('auth_token');

        function authenticate(userData) {
            Principal.authenticate({
                userName: userData.user_name,
                roles: userData.authorities,
                jti: userData.jti
            });
        }

        function handleSB64UserData(data) {
            if (data) {
                authenticate(decodeURIComponent($window.atob(data)));
            }
        }

        if (token && token.expires_at && new Date(token.expires_at).getTime() > new Date().getTime()) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
            handleSB64UserData(token.access_token.split('.')[1]);
        }

        function redirectTo(redirectTarget, event) {
            event.preventDefault();
            $state.go(redirectTarget);
        }

        function checkAuthorization(event) {
            if (Principal.isIdentityResolved() && !Principal.isInAnyRole($rootScope.toState.data.roles)) {
                redirectTo(STATE_ACCESS_DENIED, event);
            }
        }

        function checkAccess(event) {
            if ($rootScope.toState.data.authenticated && !Principal.isIdentityResolved()) {
                redirectTo(STATE_LOGIN, event);
            } else if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0) {
                checkAuthorization(event);
            }
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            if ($rootScope.toState.data) {
                checkAccess(event)
            }
        });
    });

}());
