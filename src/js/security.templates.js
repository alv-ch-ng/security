angular.module('alv-ch-ng.security').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/security/accessdenied.html',
    "<div ng-cloak>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <h1 translate=\"errors.title\">Error Page!</h1>\n" +
    "\n" +
    "            <div class=\"alert alert-danger\" translate=\"errors.403\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('template/security/login.html',
    "<div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4 col-md-offset-4\">\n" +
    "            <h1 translate=\"login.title\">Authentication</h1>\n" +
    "\n" +
    "            <div class=\"alert alert-danger\" ng-show=\"authenticationError\"\n" +
    "                 translate=\"login.messages.error.authentication\">\n" +
    "                <strong>Authentication failed!</strong> Please check your credentials and try again.\n" +
    "            </div>\n" +
    "            <form class=\"form\" role=\"form\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"username\" translate=\"global.form.username\">Login</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" id=\"username\"\n" +
    "                           placeholder=\"{{\\'global.form.username.placeholder\\' | translate}}\" ng-model=\"username\" />\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"password\" translate=\"login.form.password\">Password</label>\n" +
    "                    <input type=\"password\" class=\"form-control\" id=\"password\"\n" +
    "                           placeholder=\"{{\\'login.form.password.placeholder\\' | translate}}\" ng-model=\"password\" />\n" +
    "                </div>\n" +
    "                <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"login()\" translate=\"login.form.button\">\n" +
    "                    Authenticate\n" +
    "                </button>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
