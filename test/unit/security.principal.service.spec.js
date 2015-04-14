;(function () {

    'use strict';
    describe('Principal', function () {

        beforeEach(module('alv-ch-ng.security'));

        it('"isIdentityResolved()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isIdentityResolved()).toBeFalsy();
                Principal.authenticate({});
                expect(Principal.isIdentityResolved()).toBeTruthy();
            });
        });

        it('"isAuthenticated()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isAuthenticated()).toBeFalsy();
                Principal.authenticate({});
                expect(Principal.isAuthenticated()).toBeTruthy();
            });
        });

        it('"isInRole()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isInRole()).toBeTruthy();
                expect(Principal.isInRole("expectedRole")).toBeFalsy();
                Principal.authenticate({ roles: [ 'expectedRole' ] });
                expect(Principal.isInRole("expectedRole")).toBeTruthy();
                Principal.authenticate({ roles: [ 'otherThanExpectedRole' ] });
                expect(Principal.isInRole("expectedRole")).toBeFalsy();
            });
        });

        it('"isInAnyRole()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isInAnyRole()).toBeTruthy();
                expect(Principal.isInAnyRole([])).toBeTruthy();
                expect(Principal.isInAnyRole(['expectedRole'])).toBeFalsy();
                Principal.authenticate({ roles: [ 'expectedRole' ] });
                expect(Principal.isInAnyRole(['dummyRole', 'expectedRole'])).toBeTruthy();
                expect(Principal.isInAnyRole(['dummyRole', 'dummyRole2'])).toBeFalsy();
                expect(Principal.isInAnyRole('dummyRole, expectedRole')).toBeTruthy();
                expect(Principal.isInAnyRole('dummyRole, dummyRole2')).toBeFalsy();
            });
        });

        it('offers a identity getter', function() {
            inject(function (Principal) {
                var user = { userName: 'fred'};
                Principal.authenticate(user);
                expect(Principal.getIdentity()).toEqual(user);
            });
        });

        afterEach(inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

    });
}());
