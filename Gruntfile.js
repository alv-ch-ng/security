;(function () {
    'use strict';

    module.exports = function (grunt) {
        require('load-grunt-tasks')(grunt, {
            pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
        });
        require('time-grunt')(grunt);

        // Project configuration.
        grunt.initConfig({

            // Metadata.
            pkg: grunt.file.readJSON('package.json'),
            alvchng: grunt.file.readJSON('.alvchngrc'),
             // Task configurations.
            clean: {
                dist: ['dist']
            },
            ngtemplates:  {
              'templates':  {
                cwd:      'src/',
                src:      'templates/**.html',
                dest:     'src/js/security.templates.js'
              }
            },
            'ngAnnotate': {
                'dist': {
                    'files': {
                        'dist/alv-ch-ng.security.js': [
                            "src/js/security.module.js",
                            "src/js/security.authInterceptor.service.js",
                            "src/js/security.authServerProvider.service.js",
                            "src/js/security.principal.service.js",
                            "src/js/security.securityConfig.service.js",
                            "src/js/security.securityService.service.js",
                            "src/bower_components/angular-utf8-base64/angular-utf8-base64.js"
                        ]
                    }
                }
            },
            uglify: {
                options: {
                    banner: '<%= alvchng.banner %>'
                },
                prod: {
                    files: {
                        'dist/alv-ch-ng.security.min.js': ['dist/alv-ch-ng.security.js'],
                        'dist/alv-ch-ng.security.templates.min.js': ['dist/alv-ch-ng.security.templates.js']
                    }
                },
                example: {
                  options: {
                    'mangle': false
                  },
                  files: {
                    'src/example/lib.min.js': [
                      'lib/jquery/dist/jquery.js',
                      'lib/bootstrap/dist/js/bootstrap.js',
                      'lib/angular/angular.js',
                      'lib/angular-cookies/angular-cookies.js',
                      'lib/angular-route/angular-route.js',
                      'lib/angular-sanitize/angular-sanitize.js',
                      'lib/angular-scroll/angular-scroll.js',
                      'lib/ng-lodash/build/ng-lodash.js',
                      'lib/alv-ch-ng.core/dist/alv-ch-ng.core.js',
                      'lib/alv-ch-ng.core/dist/alv-ch-ng.core.templates.js'
                    ]
                  }
                }
            },
            browserSync: {
                dev: {
                    bsFiles: {
                        src : 'src/**/*'
                    },
                    options: {
                        server: {
                            baseDir: './src',
                            directory: false
                        },
                        watchTask: true
                    }
                }
            },
            jasmine: {
                unit: {
                    src: [
                        'src/js/security.module.js',
                        'src/js/security.securityConfig.service.js',
                        'src/js/security.securityService.service.js',
                        'src/js/security.authInterceptor.service.js',
                        'src/js/security.securityCtrl.controller.js',
                        'src/js/security.login.directive.js',
                        'src/js/security.principal.service.js',
                        'src/js/security.authServerProvider.service.js'
                    ],
                    options: {
                        specs: ['test/unit/**/*.spec.js'],
                        helpers: 'test/unit/helpers/*.helper.js',
                        vendor: [
                            'src/bower_components/jquery/dist/jquery.js',
                            'src/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
                            'src/bower_components/angular/angular.js',
                            'src/bower_components/angular-mocks/angular-mocks.js',
                            'src/bower_components/angular-resource/angular-resource.js',
                            'src/bower_components/angular-local-storage/dist/angular-local-storage.js',
                            'src/bower_components/angular-utf8-base64/angular-utf8-base64.js',
                            'node_modules/grunt-contrib-jasmine/vendor/jasmine-2.0.0/jasmine.js'
                        ],
                        version: '2.0.0',
                        template: require('grunt-template-jasmine-istanbul'),
                        templateOptions: {
                            coverage: 'test/coverage/coverage.json',
                            report: [
                                {
                                    type: 'html',
                                    options: {
                                        dir: 'test/coverage/reports/html'
                                    }
                                },
                                {
                                    type: 'lcov',
                                    options: {
                                        dir: 'test/coverage/reports/lcov'
                                    }
                                },
                                {
                                    type: 'text-summary'
                                }
                            ]
                        }
                    }
                }
            },
            coveralls: {
                options: {
                    force: false
                },
                all: {
                    src: 'test/coverage/reports/lcov/lcov.info'
                }
            },
            jshint: {
                gruntfile: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: 'Gruntfile.js'
                },
                src: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: ['src/**/*.js', '!src/bower_components/**/*.js']
                },
                test: {
                    options: {
                        jshintrc: 'test/.jshintrc'
                    },
                    src: ['test/unit/**/*.js', '!test/**/helpers/*.helper.js']
                }
            },
            versioncheck: {
                options: {
                    skip : [
                        "angular",
                        "angular-local-storage",
                        "angular-mocks",
                        "angular-resource",
                        "angular-route",
                        "npm",
                        "semver"
                    ],
                    hideUpToDate : false
                }
            }
        });

        // Tests
        grunt.registerTask('test', [ 'jshint', 'jasmine']);

        // CI
        grunt.registerTask('travis', ['default', 'coveralls']);

        // Default task.
        grunt.registerTask('default', ['test', 'clean', 'ngtemplates', 'ngAnnotate', 'uglify:prod']);
    };


})();
