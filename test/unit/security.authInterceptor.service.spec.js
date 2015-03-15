;(function () {

    'use strict';
    describe('authInterceptor', function () {

        beforeEach(module('alv-ch-ng.security'));

        it('Does not change header values that are not involved in Auth process.', function() {
            inject(function (authInterceptor) {
                var config = {
                    headers: {
                        customAttribute: 'testValue'
                    }
                };
                config = authInterceptor.request(config);
                expect(config.headers.customAttribute).toBe('testValue');
            });
        });

        it('Does add the bearer token if one is stored in the localStorage', function() {
            inject(function (authInterceptor, localStorageService) {
                var config = { };
                var expires = new Date();
                expires.setSeconds(expires.getSeconds() + 1800);
                var token = {
                    expires_at: expires,
                    access_token: "123456789"
                };
                localStorageService.set('token', token);
                config = authInterceptor.request(config);
                expect(config.headers.Authorization).toBe('Bearer 123456789');
            });
        });


    });
}());
