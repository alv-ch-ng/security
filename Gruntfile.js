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
                all: ['dist', 'build'],
                dist: ['dist'],
                build: ['build']
            },
            ngtemplates:  {
              'alv-ch-ng.security':  {
                cwd:      'src/',
                src:      'template/**/*.html',
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
                    options: {
                        'mangle': false
                    },
                    files: {
                        'dist/alv-ch-ng.security.min.js': ['dist/alv-ch-ng.security.js']
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
                      'lib/angular-aria/angular-aria.js',
                      'lib/angular-cookies/angular-cookies.js',
                      'lib/angular-route/angular-route.js',
                      'lib/angular-sanitize/angular-sanitize.js',
                      'lib/angular-resource/angular-resource.js',
                      'lib/angular-scroll/angular-scroll.js',
                      'lib/angular-translate/angular-translate.js',
                      'lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
                      'lib/angular-translate-storage-local/angular-translate-storage-local.js',
                      'lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                      'lib/ng-lodash/build/ng-lodash.js',
                      'lib/alv-ch-ng.core/dist/alv-ch-ng.core.js',
                      'lib/ng-dev/dist/ng-dev.js',
                      'lib/highlightjs/highlight.pack.js'
                    ]
                  }
                }
            },
            copy: {
              prod: {
                files: [
                  {
                    expand: true,
                    cwd: 'src/example/',
                    src: ['fonts/glyphicons*','images/**/*','locales/**/*','pages/**/*','styles/**/*','*.js','*.html', ''],
                    dest: 'dist/example'
                  },
                ]
              },
                i18n: {
                    files: [
                        {
                            expand: true,
                            cwd: 'src/i18n',
                            src: ['**'],
                            dest: 'dist/i18n'
                        },
                    ]
                },
              example: {
                files: [
                  {
                    expand: true,
                    cwd: 'lib/bootstrap/',
                    src: 'fonts/*',
                    dest: 'src/example'
                  },
                  {
                    expand: true,
                    cwd: 'lib/alv-ch-ng.style/dist/css/',
                    src: 'alv-ch-ng.bootstrap.css',
                    dest: 'src/example/styles'
                  },
                  {
                    expand: true,
                    cwd: 'lib/ng-dev/dist/css/',
                    src: '*.min.css',
                    dest: 'src/example/styles'
                  }
                ]
              }
            },
            cssbeautifier: {
                options: {
                    banner: '<%= alvchng.banner %>'
                },
                prod: {
                    files: {
                        'dist/css/security.css': ['dist/css/security.css']
                    }
                }
            },
            cssmin: {
                options: {
                    banner: '<%= alvchng.banner %>'
                },
                prod: {
                    files: {
                        'dist/css/security.min.css': ['dist/css/security.css']
                    }
                }
            },
            compress: {
                main: {
                    options: {
                        mode: 'gzip'
                    },
                    files: [
                        { src: ['dist/css/security.min.css'], dest: 'dist/css/security.min.css' }
                    ]
                }
            },
            concat: {
              options: {
                separator: ';',
                banner: '<%= alvchng.banner %>'
              },
              prod: {
                src: ['src/js/security.js', 'src/js/security.*.*.js', 'src/js/security.templates.js', 'lib/angular-utf8-base64/angular-utf8-base64.js'],
                dest: 'dist/alv-ch-ng.security.js'
              }
            },
            jasmine: {
                unit: {
                    src: [
                        'src/js/security.js',
                        'src/js/security.*.*.js',
                        'src/js/security.template.js'
                    ],
                    options: {
                        specs: ['test/unit/**/*.spec.js'],
                        helpers: 'test/unit/helpers/*.helper.js',
                        vendor: [
                            'lib/jquery/dist/jquery.js',
                            'lib/jasmine-jquery/lib/jasmine-jquery.js',
                            'lib/angular/angular.js',
                            'lib/angular-mocks/angular-mocks.js',
                            'lib/angular-resource/angular-resource.js',
                            'lib/angular-translate/angular-translate.js',
                            'lib/angular-ui-router/release/angular-ui-router.js',
                            'lib/angular-local-storage/dist/angular-local-storage.js',
                            'lib/angular-utf8-base64/angular-utf8-base64.js',
                            'node_modules/grunt-contrib-jasmine/vendor/jasmine-2.0.0/jasmine.js'
                        ],
                        version: '2.0.0',
                        template: require('grunt-template-jasmine-istanbul'),
                        templateOptions: {
                            coverage: 'build/coverage/coverage.json',
                            report: [
                                {
                                    type: 'html',
                                    options: {
                                        dir: 'build/coverage/reports/html'
                                    }
                                },
                                {
                                    type: 'lcov',
                                    options: {
                                        dir: 'build/coverage/reports/lcov'
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
                    src: 'build/coverage/reports/lcov/lcov.info'
                }
            },
            push: {
                options: {
                    files: ['package.json'],
                    updateConfigs: [],
                    releaseBranch: 'master',
                    add: true,
                    addFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '.' for all files except ignored files in .gitignore
                    commit: true,
                    commitMessage: 'Release v%VERSION%',
                    commitFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '-a' for all files
                    createTag: true,
                    tagName: 'v%VERSION%',
                    tagMessage: 'Version %VERSION%',
                    push: false,
                    npm: false,
                    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
                }
            },
            htmlhint: {
              options: {
                htmlhintrc: '.htmlhintrc'
              },
                templates: {
                src: ['src/template/**/*.html']
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
                    src: ['src/js/**/*.js']
                },
                test: {
                    options: {
                        jshintrc: 'test/.jshintrc'
                    },
                    src: ['test/**/*.js', '!test/dev/*.js', '!test/**/helpers/*.helper.js', '!test/e2e/**']
                }
            },
            lesslint: {
                options: {
                    csslint: {
                        csslintrc: '.csslintrc'
                    },
                    imports: ['src/less/**/*.less']
                },
                src: ['src/less/security.less']
            },
            complexity: {
                generic: {
                    src: ['src/js/**/*.js', '!src/js/**/*.templates.js', '!src/js/**/*.translations.js'],
                    exclude: [],
                    options: {
                        breakOnErrors: true,
                        jsLintXML: 'build/complexity/report.xml',         // create XML JSLint-like report
                        checkstyleXML: 'build/complexity/checkstyle.xml', // create checkstyle report
                        pmdXML: 'build/complexity/pmd.xml',               // create pmd report
                        errorsOnly: false,               // show only maintainability errors
                        cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
                        halstead: [8, 13, 20],           // or optionally a single value, like 8
                        maintainability: 100,
                        hideComplexFunctions: false,     // only display maintainability
                        broadcast: false                 // broadcast data over event-bus
                    }
                }
            },
            watch: {
              html: {
                files: 'src/template/**/*.html',
                tasks: ['htmlhint:templates', 'templates']
              },
              jshint: {
                files: 'src/js/*.js',
                  tasks: ['jshint-test']
              },
              test: {
                  files: 'src/js/**/*.js',
                  tasks: ['unit-test']
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
            }
        });

        // Tests
        grunt.registerTask('unit-test', ['jasmine']);
        grunt.registerTask('jshint-test', ['jshint']);

        grunt.registerTask('all-test', [ 'htmlhint:templates', 'jshint-test', 'unit-test', 'complexity']);
        // CI
        grunt.registerTask('travis', ['jshint', 'clean:build', 'all-test', 'coveralls']);

        // Templates
        grunt.registerTask('templates', ['ngtemplates']);

        // DEV
        grunt.registerTask('build', ['templates', 'all-test', 'concat:prod', 'copy:example', 'copy:i18n', 'uglify:prod','uglify:example']);
        grunt.registerTask('dev', ['build', 'browserSync:dev', 'watch']);

        // Default task.
        grunt.registerTask('default', ['clean:all','templates','all-test', 'concat','uglify:prod', 'copy:prod']);
    };


})();
