;(function () {

    'use strict';
    describe('SecurityCtrl', function () {

        var $scope, SecurityCtrl;

        beforeEach(module('alv-ch-ng.security'));

        beforeEach(
            inject(function ($injector, $rootScope) {
                var $controller = $injector.get('$controller');
                $scope = $rootScope.$new();
                SecurityCtrl = $controller('SecurityCtrl', {'$scope': $scope});

            })
        );


        it('"login()" calls the SecurityService\'s login method with scope\'s credentials.', function() {
            inject(function (SecurityService) {
                spyOn(SecurityService, 'login');
                var credentials = {
                    username: 'testUser',
                    password: 'testPassword'
                };
                $scope.credentials = credentials;
                $scope.login();
                expect(SecurityService.login).toHaveBeenCalledWith(credentials);
            });
        });

        it('"logout()" calls the SecurityService\'s logout method and resets the credentials.', function() {
            inject(function (SecurityService) {
                spyOn(SecurityService, 'logout');
                $scope.logout();
                expect(SecurityService.logout).toHaveBeenCalled();
                expect($scope.credentials.username).toBeFalsy();
                expect($scope.credentials.password).toBeFalsy();
            });
        });

    });
}());
