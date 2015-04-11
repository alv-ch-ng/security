/* alv-ch-ng.security - 0.2.0 - 2015-04-11 - Copyright (c) 2015 Informatik der Arbeitslosenversicherung; */
;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security', ['ngResource', 'LocalStorageModule', 'ab-base64']);

    module.run(function($rootScope, Principal, SecurityService) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            if (Principal.isIdentityResolved()) {
                SecurityService.authorize();
            }
        });
    });

}());
;;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('anonymous', function(Principal) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                scope.$watch(Principal.isAuthenticated, function( newValue ) {
                    if (newValue) {
                        element.hide();
                    } else {
                        element.show();
                    }
                });
            }
        };
    });

}());
;;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('anyRole', function(Principal) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(
                    function() {
                        return Principal.isInAnyRole(attrs.anyRole);
                    },
                    function( newValue ) {
                        if (newValue) {
                            element.show();
                        } else {
                            element.hide();
                        }
                    }
                );
            }
        };
    });

}());
;;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('authInterceptor', ["$rootScope", "$q", "$location", "localStorageService", function ($rootScope, $q, $location, localStorageService) {
        function addTokenIfNotExpired(token, config) {
            if (token && token.expires_at && new Date(token.expires_at).getTime() > new Date().getTime()) {
                config.headers.Authorization = 'Bearer ' + token.access_token;
            }
        }

        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                addTokenIfNotExpired(localStorageService.get('token'), config);
                return config;
            }
        };
    }]);

}());
;;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('AuthServerProvider', ["$http", "localStorageService", "SecurityConfig", "base64", function($http, localStorageService, SecurityConfig, base64) {

        function createLoginData(credentials) {
            if (SecurityConfig.getAuthType() === 'oauth2') {
                return 'username=' + credentials.username + '&password=' +
                    credentials.password + '&grant_type=password&scope=read%20write&' +
                    'client_secret=' + SecurityConfig.getClientSecret() + '&client_id=' + SecurityConfig.getClientId();
            } else {
                return 'j_username=' + encodeURIComponent(credentials.username) + '&j_password=' + encodeURIComponent(credentials.password) + '&submit=Login';
            }
        }

        function createLoginHeaders() {
            if (SecurityConfig.getAuthType() === 'oauth2') {
                return {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "Authorization": "Basic " + base64.encode(SecurityConfig.getClientId() + ':' + SecurityConfig.getClientSecret())
                };
            } else {
                return {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }

        }

        function createLoginRequest(data, headers) {
            return $http.post(SecurityConfig.getAuthPath(), data, {
                headers: headers,
                ignoreAuthModule: 'ignoreAuthModule'
            })
                .success(function (response) {
                    if (SecurityConfig.getAuthType() === 'oauth2') {
                        var expiredAt = new Date();
                        expiredAt.setSeconds(expiredAt.getSeconds() + response.expires_in);
                        response.expires_at = expiredAt.getTime();
                        localStorageService.set('token', response);
                    }
                });
        }

        function login(credentials) {
            if (SecurityConfig.getAuthType() !== 'oauth2' && SecurityConfig.getAuthType() !== 'cookie') {
                throw new Error('No or unknown authType found: "' + SecurityConfig.getAuthType() + '".');
            }
            return createLoginRequest(createLoginData(credentials), createLoginHeaders());
        }

        function logout() {
            // logout from the server
            $http.post(SecurityConfig.getLogoutPath()).then(function () {
                localStorageService.clearAll();
            });
        }

        function getToken() {
            return localStorageService.get('token');
        }

        function hasValidToken() {
            var token = getToken();
            return token && token.expires_at && token.expires_at > new Date().getTime();
        }

        return {
            login: login,
            logout: logout,
            getToken: getToken,
            hasValidToken: hasValidToken
        };
    }]);

}());
;;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('authenticated', function(Principal) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.hide();
                scope.$watch(Principal.isAuthenticated, function() {
                    if (Principal.authenticated) {
                        element.show();
                    } else {
                        element.hide();
                    }
                });
            }
        };
    });

}());
;;(function() {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.directive('login', function() {

        return {
            restrict: 'E',
            replace: true,
            controller: 'SecurityCtrl',
            link: function() {



            }
        };
    });
}());


;;(function () {
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
;;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.provider('SecurityConfig', function () {

        var _clientId = '';
        var _clientSecret = '';
        var _authPath = 'oauth/token';
        var _logoutPath = 'api/logout';
        var _registerPath = 'api/register';
        var _activationPath = 'api/activate';
        var _accountPath = 'api/account';
        var _resendPasswordPath = 'api/account/resendPassword';
        var _newPasswordPath = 'api/account/newPassword';
        var _userIdParam = 'key';
        var _authType = 'oauth2';


        this.setClientId = function(clientId) {
            _clientId = clientId;
        };

        this.setClientSecret = function(clientSecret) {
            _clientSecret = clientSecret;
        };

        this.setAuthPath = function(authPath) {
            _authPath = authPath;
        };

        this.setLogoutPath = function(logoutPath) {
            _logoutPath = logoutPath;
        };

        this.setRegisterPath = function(registerPath) {
            _registerPath = registerPath;
        };

        this.setActivationPath = function(activationPath) {
            _activationPath = activationPath;
        };

        this.setAccountPath = function(accountPath) {
            _accountPath = accountPath;
        };

        this.setResendPasswordPath = function(resendPasswordPath) {
            _resendPasswordPath = resendPasswordPath;
        };

        this.setNewPasswordPath = function(newPasswordPath) {
            _newPasswordPath = newPasswordPath;
        };

        this.setUserIdParam = function(userIdParam) {
            _userIdParam = userIdParam;
        };

        this.setAuthType = function(authType) {
            _authType = authType;
        };

        this.$get = function() {
            return {
                getClientId: function() { return _clientId; },
                getClientSecret: function() { return _clientSecret; },
                getAuthPath: function() { return _authPath; },
                getLogoutPath: function() { return _logoutPath; },
                getRegisterPath: function() { return _registerPath; },
                getActivationPath: function() { return _activationPath; },
                getAccountPath: function() { return _accountPath; },
                getResendPasswordPath: function() { return _resendPasswordPath; },
                getNewPasswordPath: function() { return _newPasswordPath; },
                getUserIdParam: function() { return _userIdParam; },
                getAuthType: function() { return _authType; }
            };
        };
    });

}());
;;(function() {

    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.controller('SecurityCtrl', ['$scope', 'SecurityService', function($scope, SecurityService) {

        $scope.credentials = {
            username: '',
            password: ''
        };

        $scope.login = function() {
            SecurityService.login($scope.credentials);
        };

        $scope.logout = function() {
            SecurityService.logout();
            $scope.credentials = {
                username: '',
                password: ''
            };
        };

    }]);
}());


;;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.factory('SecurityService', ['$rootScope', '$http', '$q', 'Principal', 'AuthServerProvider', 'SecurityConfig', function ($rootScope, $http, $q, Principal, AuthServerProvider, SecurityConfig) {

        var _onAccessDenied;
        var _onLoginFail = function() {};

        var _onLoginSuccess = function(identity) {
            Principal.authenticate(identity);
        };

        var _onLoginRequired = function() {
            $rootScope.returnToState = $rootScope.toState;
            $rootScope.returnToStateParams = $rootScope.toStateParams;
        };

        function login(credentials) {
            AuthServerProvider.login(credentials).success(function () {
                Principal.identity(true).then(function(account) {
                    if (angular.isFunction(_onLoginSuccess)) {
                        _onLoginSuccess(account);
                    }
                });
            }).error(function (error) {
                if (angular.isFunction(_onLoginFail)) {
                    _onLoginFail(error);
                }
            });
        }

        function logout() {
            AuthServerProvider.logout();
            Principal.authenticate(null);
        }

        function checkAccess() {
            if (!Principal.isIdentityResolved()) {
                _onLoginRequired();
            } else if (!Principal.isInAnyRole($rootScope.toState.data.roles) && angular.isFunction(_onAccessDenied)) {
                _onAccessDenied();
            }
        }

        function authorize() {
            return Principal.identity(false, function() {
                if ($rootScope.toState.data.roles &&
                    $rootScope.toState.data.roles.length > 0) {
                    _onLoginRequired();
                }
            })
                .then(function() {
                    if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0) {
                        checkAccess();
                    }
                });
        }

        function register(account) {
            return $http.post(SecurityConfig.getRegisterPath(), account);
        }

        function activateAccount(data) {
            return $http.post(SecurityConfig.getActivationPath(), data);
        }

        function updateAccount(account) {
            return $http.post(SecurityConfig.getAccountPath() + '/' + account[SecurityConfig.getUserIdParam()], account);
        }

        function getAccount(key) {
            return $http.get(SecurityConfig.getAccountPath() + '/' + key);
        }

        function changePassword(newPassword) {
            return $http.post(SecurityConfig.getNewPasswordPath(), {'newPassword': newPassword});
        }

        function resendPassword(userName) {
            return $http.post(SecurityConfig.getResendPasswordPath(), {'userName': userName});
        }

        return {
            login: login,
            logout: logout,
            authorize: authorize,
            updateAccount: updateAccount,
            activateAccount: activateAccount,
            getAccount: getAccount,
            register: register,
            changePassword: changePassword,
            resendPassword: resendPassword,
            setOnLoginSuccess: function(onLoginSuccess) { _onLoginSuccess =  onLoginSuccess; },
            setOnLoginFail: function(onLoginFail) { _onLoginFail =  onLoginFail; },
            setOnAccessDenied: function(onAccessDenied) { _onAccessDenied =  onAccessDenied; },
            setOnLoginRequired: function(onLoginRequired) { _onLoginRequired =  onLoginRequired; }
        };
    }]);

}());
;;'use strict';

angular.module('ab-base64',[]).constant('base64', (function() {

    /*
     * Encapsulation of Vassilis Petroulias's base64.js library for AngularJS
     * Original notice included below
     */

    /*
     Copyright Vassilis Petroulias [DRDigit]

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
     */
    var B64 = {
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        lookup: null,
        ie: /MSIE /.test(navigator.userAgent),
        ieo: /MSIE [67]/.test(navigator.userAgent),
        encode: function (s) {
            /* jshint bitwise:false */
            var buffer = B64.toUtf8(s),
                position = -1,
                result,
                len = buffer.length,
                nan0, nan1, nan2, enc = [, , , ];
            
            if (B64.ie) {
                result = [];
                while (++position < len) {
                    nan0 = buffer[position];
                    nan1 = buffer[++position];
                    enc[0] = nan0 >> 2;
                    enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
                    if (isNaN(nan1))
                        enc[2] = enc[3] = 64;
                    else {
                        nan2 = buffer[++position];
                        enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
                        enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
                    }
                    result.push(B64.alphabet.charAt(enc[0]), B64.alphabet.charAt(enc[1]), B64.alphabet.charAt(enc[2]), B64.alphabet.charAt(enc[3]));
                }
                return result.join('');
            } else {
                result = '';
                while (++position < len) {
                    nan0 = buffer[position];
                    nan1 = buffer[++position];
                    enc[0] = nan0 >> 2;
                    enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
                    if (isNaN(nan1))
                        enc[2] = enc[3] = 64;
                    else {
                        nan2 = buffer[++position];
                        enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
                        enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
                    }
                    result += B64.alphabet[enc[0]] + B64.alphabet[enc[1]] + B64.alphabet[enc[2]] + B64.alphabet[enc[3]];
                }
                return result;
            }
        },
        decode: function (s) {
            /* jshint bitwise:false */
            s = s.replace(/\s/g, '');
            if (s.length % 4)
                throw new Error('InvalidLengthError: decode failed: The string to be decoded is not the correct length for a base64 encoded string.');
            if(/[^A-Za-z0-9+\/=\s]/g.test(s))
                throw new Error('InvalidCharacterError: decode failed: The string contains characters invalid in a base64 encoded string.');

            var buffer = B64.fromUtf8(s),
                position = 0,
                result,
                len = buffer.length;

            if (B64.ieo) {
                result = [];
                while (position < len) {
                    if (buffer[position] < 128)
                        result.push(String.fromCharCode(buffer[position++]));
                    else if (buffer[position] > 191 && buffer[position] < 224)
                        result.push(String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63)));
                    else
                        result.push(String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63)));
                }
                return result.join('');
            } else {
                result = '';
                while (position < len) {
                    if (buffer[position] < 128)
                        result += String.fromCharCode(buffer[position++]);
                    else if (buffer[position] > 191 && buffer[position] < 224)
                        result += String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63));
                    else
                        result += String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63));
                }
                return result;
            }
        },
        toUtf8: function (s) {
            /* jshint bitwise:false */
            var position = -1,
                len = s.length,
                chr, buffer = [];
            if (/^[\x00-\x7f]*$/.test(s)) while (++position < len)
                buffer.push(s.charCodeAt(position));
            else while (++position < len) {
                chr = s.charCodeAt(position);
                if (chr < 128)
                    buffer.push(chr);
                else if (chr < 2048)
                    buffer.push((chr >> 6) | 192, (chr & 63) | 128);
                else
                    buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128);
            }
            return buffer;
        },
        fromUtf8: function (s) {
            /* jshint bitwise:false */
            var position = -1,
                len, buffer = [],
                enc = [, , , ];
            if (!B64.lookup) {
                len = B64.alphabet.length;
                B64.lookup = {};
                while (++position < len)
                    B64.lookup[B64.alphabet.charAt(position)] = position;
                position = -1;
            }
            len = s.length;
            while (++position < len) {
                enc[0] = B64.lookup[s.charAt(position)];
                enc[1] = B64.lookup[s.charAt(++position)];
                buffer.push((enc[0] << 2) | (enc[1] >> 4));
                enc[2] = B64.lookup[s.charAt(++position)];
                if (enc[2] === 64)
                    break;
                buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2));
                enc[3] = B64.lookup[s.charAt(++position)];
                if (enc[3] === 64)
                    break;
                buffer.push(((enc[2] & 3) << 6) | enc[3]);
            }
            return buffer;
        }
    };

    var B64url = {
        decode: function(input) {
            // Replace non-url compatible chars with base64 standard chars
            input = input
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            // Pad out with standard base64 required padding characters
            var pad = input.length % 4;
            if(pad) {
              if(pad === 1) {
                throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
              }
              input += new Array(5-pad).join('=');
            }

            return B64.decode(input);
        },

        encode: function(input) {
            var output = B64.encode(input);
            return output
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .split('=', 1)[0];
        }
    };

    return {
        decode: B64.decode,
        encode: B64.encode,
        urldecode: B64url.decode,
        urlencode: B64url.encode,
    };
})());

