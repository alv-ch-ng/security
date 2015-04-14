;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('Principal', function() {
        var _identity = null;

        function checkRoles(roles) {
            var results = [];
            for (var i = 0; i < roles.length; i++) {
                results.push(service.isInRole(roles[i]));
            }
            return results;
        }

        function splitIfString(roles) {
            if (angular.isString(roles)) {
                return roles.split(',');
            }
            return roles;
        }

        var service = {
            authenticated: false,
            isIdentityResolved: function () {
                return _identity ? true : false;
            },
            isAuthenticated: function () {
                return service.authenticated;
            },
            isInRole: function (role) {
                if (!role) {
                    return true;
                }
                if (!service.authenticated || !_identity.roles) {
                    return false;
                }
                return _identity.roles.indexOf(role.trim()) !== -1;
            },
            isInAnyRole: function (roles) {
                if (!roles || roles.length === 0) {
                    return true;
                }
                return checkRoles(splitIfString(roles)).indexOf(true) > -1;
            },
            authenticate: function (identity) {
                _identity = identity;
                service.authenticated = identity !== null;
            },
            getIdentity: function() {
                return _identity;
            }
        };

        return service;
    });

}());
