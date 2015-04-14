;(function () {

    'use strict';
    describe('LoginCtrl', function () {

        var $scope, LoginCtrl;

        beforeEach(module('alv-ch-ng.security'));

        beforeEach(
            inject(function ($injector, $rootScope) {
                var $controller = $injector.get('$controller');
                $scope = $rootScope.$new();
                LoginCtrl = $controller('LoginCtrl', {'$scope': $scope});

            })
        );


        it('"login()" calls the SecurityService\'s login method with scope\'s credentials.', function() {
            inject(function ($timeout, SecurityService) {
                spyOn(SecurityService, 'login');
                $scope.username = 'testUser';
                $scope.password = 'testPassword';
                $scope.rememberMe = false;
                $timeout.flush(1);
                $scope.login();
                expect(SecurityService.login).toHaveBeenCalledWith({ username: $scope.username, password: $scope.password, rememberMe: $scope.rememberMe});
            });
        });

    });
}());
