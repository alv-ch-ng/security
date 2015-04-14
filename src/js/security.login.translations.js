;(function () {
    'use strict';

    var module = angular.module('alv-ch-ng.security');

    module.config(function($translateProvider) {

        $translateProvider.translations('de', {
            "login": {
                "title": "Anmelden",
                "form": {
                    "password": "Passwort",
                    "password.placeholder": "Dein Passwort",
                    "rememberme": "angemeldet bleiben",
                    "button": "Anmelden"
                },
                "messages": {
                    "error": {
                        "authentication": "<strong>Anmelden fehlgeschlagen!</strong> Bitte überprüfen Sie Ihre Eingaben."
                    }
                }
            }
        });

        $translateProvider.translations('fr', {
            "login": {
                "title": "Authentification",
                "form": {
                    "password": "Mot de passe",
                    "password.placeholder": "Votre mot de passe",
                    "rememberme": "Garder la session ouverte",
                    "button": "Connexion"
                },
                "messages": {
                    "error": {
                        "authentication": "<strong>Erreur d'authentification!</strong> Veuillez vérifier vos identifiants de connexion."
                    }
                }
            }
        });

        $translateProvider.translations('it', {
            "login": {
                "title": "[IT] Authentication",
                "form": {
                    "password": "[IT] Password",
                    "password.placeholder": "[IT] Your password",
                    "rememberme": "[IT] Automatic Login",
                    "button": "[IT] Authenticate"
                },
                "messages": {
                    "error": {
                        "authentication": "[IT] <strong>Authentication failed!</strong> Please check your credentials and try again."
                    }
                }
            }
        });

        $translateProvider.translations('en', {
            "login": {
                "title": "Login",
                "form": {
                    "password": "Password",
                    "password.placeholder": "Your password",
                    "rememberme": "Automatic login",
                    "button": "Anmelden"
                },
                "messages": {
                    "error": {
                        "authentication": "<strong>Authentication failed!</strong> Please check your credentials and try again."
                    }
                }
            }
        });


    });

}());
