;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.config(function($translateProvider) {

        $translateProvider.translations('de', {
                "errors": {
                    "title": "Fehlerseite!",
                    "403": "Sie haben nicht die nötigen Berechtigungen diese Seite anzuzeigen."
                }
            }
        );

        $translateProvider.translations('fr', {
            "errors": {
                "title": "Page d'erreur!",
                "403": "Vous n'avez pas les droits pour accéder à cette page."
            }
        });

        $translateProvider.translations('it', {
            "errors": {
                "title": "[IT] Fehlerseite!",
                "403": "[IT] Sie haben nicht die nötigen Berechtigungen diese Seite anzuzeigen."
            }
        });

        $translateProvider.translations('en', {
            "errors": {
                "title": "Error page!",
                "403": "You are not authorized to access the page."
            }
        });


    });

}());
