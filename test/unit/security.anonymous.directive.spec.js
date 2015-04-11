;(function () {

    'use strict';
    describe('anonymous directive', function () {

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
                    var elem = angular.element('<div><div anonymous=""></div></div>');
                    $compile(elem)($scope);
                    expect(elem.html()).toBe('<div anonymous=""></div>');
                    Principal.authenticate({userName: 'testUser'});
                    $scope.$digest();
                    expect(elem.html()).toBe('<div anonymous="" style="display: none; "></div>');
                    Principal.authenticate(null);
                    $scope.$digest();
                    expect(elem.html()).toBe('<div anonymous="" style="display: block; "></div>');
                });
            }
        );

    });
}());
