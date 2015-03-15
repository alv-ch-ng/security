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
              'templates':  {
                cwd:      'src/',
                src:      'templates/**.html',
                dest:     'src/js/security.templates.js'
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
                },
                unit: {
                    options: {
                        'mangle': false
                    },
                    files: {
                        'test/unit/alv-ch-ng.security.js': [

                        ]
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
                        'src/js/security.principal.service.js',
                        'src/js/security.base64.service.js',
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
            lesslint: {
                options: {
                    csslint: {
                        csslintrc: '.csslintrc'
                    },
                    imports: ['src/less/**/*.less']
                },
                src: ['src/less/security.less']
            },
            watch: {
              templates: {
                files: 'src/template/**/*.html',
                  tasks: ['templates']
              },
              less: {
                files: 'src/less/**/*.less',
                  tasks: ['less:prod']
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
            versioncheck: {
                options: {
                    skip : ["semver", "npm", "lodash"],
                    hideUpToDate : false
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

        grunt.registerTask('all-test', [ 'htmlhint:templates', 'jshint-test', 'unit-test']);
        // CI
        grunt.registerTask('travis', ['jshint', 'clean:build', 'unit-test', 'coveralls']);

        // Templates
        grunt.registerTask('templates', ['ngtemplates:templates']);

        // DEV
        grunt.registerTask('build', ['templates','all-test','copy:example','uglify:example']);
        grunt.registerTask('dev', [/*'build',*/ 'browserSync:dev', 'watch']);

        // Default task.
        grunt.registerTask('default', ['clean:all','templates','all-test', 'concat','uglify:prod']);
    };


})();
