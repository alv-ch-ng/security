;(function () {

    'use strict';

    describe('Security module config', function () {

        beforeEach(module('alv-ch-ng.security'));

        it('registers a $stateChangeListener storing state and params to $rootScope', function() {
            inject(function ($rootScope) {
                var state = { stateAttr: 'testValue' };
                var params = { stateParam: 'testParamValue' };
                $rootScope.$broadcast('$stateChangeStart', state, params);
                expect($rootScope.toState).toBe(state);
                expect($rootScope.toStateParams).toBe(params);
            });
        });

        it('registers a $stateChangeListener starting a authorization check if identity is resolved', function() {
            inject(function ($rootScope, SecurityService, Principal) {
                spyOn(SecurityService, 'authorize');
                Principal.authenticate(localPrincipal);
                $rootScope.$broadcast('$stateChangeStart', {}, {});
                expect(SecurityService.authorize).toHaveBeenCalled();
            });
        });

    });
}());
