;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('Principal', ["$q", "$resource", "SecurityConfig", function($q, $resource, SecurityConfig) {
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
                return service.authenticated;
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
            identity: function (force, onUnAuthenticated) {
                var deferred = $q.defer();

                // check and see if we have retrieved the identity data from the server.
                // if we have, reuse it by immediately resolving
                if (_identity !== null && !force) {
                    deferred.resolve(_identity);
                    return deferred.promise;
                }

                // retrieve the identity data from the server, update the identity object, and then resolve.
                $resource(SecurityConfig.getAccountPath()).get().$promise
                    .then(function (account) {
                        _identity = account;
                        service.authenticated = true;
                        deferred.resolve(_identity);
                    })
                    .catch(function() {
                        _identity = null;
                        service.authenticated = false;
                        if (angular.isFunction(onUnAuthenticated)) {
                            onUnAuthenticated();
                        }
                        deferred.resolve(_identity);
                    });
                return deferred.promise;
            }
        };

        return service;
    }]);

}());
