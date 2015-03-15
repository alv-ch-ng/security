;(function () {

    'use strict';
    describe('Base64', function () {

        beforeEach(module('alv-ch-ng.security'));

        it('"encode()" does its work correctly', function() {
            inject(function (Base64) {
                expect(Base64.encode('u')).toBe('dQ==');
                expect(Base64.encode('userName:Token&Password')).toBe('dXNlck5hbWU6VG9rZW4mUGFzc3dvcmQ=');
            });
        });

        it('"decode()" does its work correctly', function() {
            inject(function (Base64) {
                expect(Base64.decode('dQ==')).toBe('u');
                expect(Base64.decode('dXNlck5hbWU6VG9rZW4mUGFzc3dvcmQ=')).toBe('userName:Token&Password');
            });
        });


    });
}());
