;(function () {

    'use strict';
    describe('login directive', function () {

        var $scope;

        beforeEach(module('alv-ch-ng.security'));

        beforeEach(
            inject(function ($injector, $rootScope) {
                var $controller = $injector.get('$controller');
                $scope = $rootScope.$new();
                $controller('SecurityCtrl', {'$scope': $scope});

            })
        );

        it('renders the html element as required.',
            function() {
                inject(function ($compile) {
                    var elem = angular.element('<div><login></login></div>');
                    $compile(elem)($scope);
                    expect(true).toBeTruthy();
                });
            }
        );

    });
}());
