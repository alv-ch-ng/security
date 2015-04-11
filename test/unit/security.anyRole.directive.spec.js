;(function () {

    'use strict';
    describe('anyRole directive', function () {

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
                    var elem = angular.element('<div><div any-role="a,b"></div></div>');
                    $compile(elem)($scope);
                    expect(elem.html()).toBe('<div any-role="a,b"></div>');
                    Principal.authenticate({userName: 'testUser', roles: ['a']});
                    $scope.$digest();
                    expect(elem.html()).toBe('<div any-role="a,b" style="display: block; "></div>');
                    Principal.authenticate(null);
                    $scope.$digest();
                    expect(elem.html()).toBe('<div any-role="a,b" style="display: none; "></div>');
                });
            }
        );

    });
}());
