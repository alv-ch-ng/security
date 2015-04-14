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
                    controller: 'SecurityCtrl'
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

    module.run(function($rootScope, Principal, $state, SecurityService) {

        var STATE_LOGIN = 'login';
        var STATE_ACCESS_DENIED = 'accessdenied';

        function redirectTo(redirectTarget, event) {
            event.preventDefault();
            $state.go(redirectTarget);
        }

        function checkAuthenticationRemotely(event) {
            SecurityService.getUserAccount().success(function (result) {
                Principal.authenticate(result);
            }).error(function () {
                redirectTo(STATE_LOGIN, event);
            });
        }

        function checkAuthorization(event) {
            if (Principal.isIdentityResolved() && !Principal.isInAnyRole($rootScope.toState.data.roles)) {
                redirectTo(STATE_ACCESS_DENIED, event);
            } else if (!Principal.isIdentityResolved()) {
                checkAuthorizationRemotely(event);
            }
        }

        function checkAuthorizationRemotely(event) {
            SecurityService.getUserAccount().success(function (result) {
                Principal.authenticate(result);
                if (!Principal.isInAnyRole($rootScope.toState.data.roles)) {
                    redirectTo(STATE_ACCESS_DENIED, event);
                }
            }).error(function () {
                redirectTo(STATE_LOGIN, event);
            });
        }

        function checkAccess(event) {
            if ($rootScope.toState.data.authenticated && !Principal.isIdentityResolved()) {
                checkAuthenticationRemotely(event);
            } else if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0) {
                checkAuthorization(event);
            }
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            if (!$rootScope.toState.data) {
                return;
            }
            checkAccess(event);
        });
    });

}());
