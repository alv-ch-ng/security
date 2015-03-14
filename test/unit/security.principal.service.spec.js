;(function () {

    'use strict';
    describe('Principal', function () {

        beforeEach(module('alv-ch-ng.security'));

        it('"isIdentityResolved()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isIdentityResolved()).toBeFalsy();
                Principal.authenticate({});
                expect(Principal.isIdentityResolved()).toBeTruthy();
            })
        });

        it('"isAuthenticated()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isAuthenticated()).toBeFalsy();
                Principal.authenticate({});
                expect(Principal.isAuthenticated()).toBeTruthy();
            })
        });

        it('"isInRole()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isInRole()).toBeTruthy();
                expect(Principal.isInRole("expectedRole")).toBeFalsy();
                Principal.authenticate({ roles: [ 'expectedRole' ] });
                expect(Principal.isInRole("expectedRole")).toBeTruthy();
                Principal.authenticate({ roles: [ 'otherThanExpectedRole' ] });
                expect(Principal.isInRole("expectedRole")).toBeFalsy();
            })
        });

        it('"isInAnyRole()" determines a correct value" ', function() {
            inject(function ($httpBackend, Principal) {
                expect(Principal.isInAnyRole()).toBeTruthy();
                expect(Principal.isInAnyRole([])).toBeTruthy();
                expect(Principal.isInAnyRole(['expectedRole'])).toBeFalsy();
                Principal.authenticate({ roles: [ 'expectedRole' ] });
                expect(Principal.isInAnyRole(['dummyRole', 'expectedRole'])).toBeTruthy();
                expect(Principal.isInAnyRole(['dummyRole', 'dummyRole2'])).toBeFalsy();
            })
        });

        it('"identity()" uses the local entity if it is present" ', function() {
            inject(function ($httpBackend, Principal) {
                Principal.authenticate(localPrincipal);
                Principal.identity().then(function(identity) {
                    expect(identity).toBe(localPrincipal);
                });
            })
        });

        it('"identity()" with force === true fetches a remote entity if it is present" ', function() {
            inject(function ($httpBackend, Principal) {
                Principal.authenticate(localPrincipal);
                $httpBackend.expectGET("api/account").respond(200, { data: remotePrincipal }  );
                Principal.identity(true).then(function(identity) {
                    expect(identity).toEqual(remotePrincipal);
                });
                $httpBackend.flush();
            })
        });

        it('"identity()" resets the state when account cannot be fetched" ', function() {
            inject(function ($httpBackend, Principal) {
                Principal.authenticate(localPrincipal);
                $httpBackend.expectGET("api/account").respond(400);
                Principal.identity(true).then(function() {
                    expect(Principal.isIdentityResolved()).toBeFalsy();
                    expect(Principal.isAuthenticated()).toBeFalsy();
                });
                $httpBackend.flush();
            })
        });

        afterEach(inject(function ($httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }));

    });
}());
