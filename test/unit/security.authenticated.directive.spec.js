;(function () {

    'use strict';
    describe('authenticated directive', function () {

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
                inject(function ($compile, Principal) {
                    var elem = angular.element('<div><div authenticated=""></div></div>');
                    $compile(elem)($scope);
                    expect(elem.html()).toBe('<div authenticated="" style="display: none; "></div>');
                    Principal.authenticate({userName: 'testUser'});
                    $scope.$digest();
                    expect(elem.html()).toBe('<div authenticated="" style="display: block; "></div>');
                    Principal.authenticate(null);
                    $scope.$digest();
                    expect(elem.html()).toBe('<div authenticated="" style="display: none; "></div>');
                });
            }
        );

    });
}());
