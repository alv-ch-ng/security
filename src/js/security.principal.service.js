;(function() {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('Principal', function Principal($q, $resource, SecurityConfig) {
        var _identity = null,
            _authenticated = false;

        return {
            isIdentityResolved: function () {
                return _authenticated;
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isInRole: function (role) {
                if (!role) {
                    return true;
                }
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                return _identity.roles.indexOf(role) !== -1;
            },
            isInAnyRole: function (roles) {
                if (!roles || roles.length === 0) {
                    return true;
                }

                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) {
                        return true;
                    }
                }

                return false;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = identity !== null;
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
                        _identity = account.data;
                        _authenticated = true;
                        deferred.resolve(_identity);
                    })
                    .catch(function() {
                        _identity = null;
                        _authenticated = false;
                        if (angular.isFunction(onUnAuthenticated)) {
                            onUnAuthenticated();
                        }
                        deferred.resolve(_identity);
                    });
                return deferred.promise;
            }
        };
    });
}());


