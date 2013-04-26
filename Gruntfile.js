module.exports = function (grunt) {
    //grunt plugins
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-clear');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-git-describe');
    grunt.loadNpmTasks('grunt-htmlrefs');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-simple-mocha');

    //config
    grunt.initConfig({

        //tool for cutting new releases of this project
        release: {options: {npm: false}},

        //for tests that run in browsers
        karma: {
            //start karma server (the watch task will run the tests when files change)
            unit: {
                configFile: 'config/karma.conf.js'
            },
            //continuous integration mode for the build: run tests once in PhantomJS browser.
            continuous: {
                configFile: 'config/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        //stylus css
        stylus: {
            compile: {
                //specify each "combined" file. Each file can then use @import() to bring in its dependencies
                files: {
                    'build/styles/app.css': ['styles/app.styl']
                }
            }
        },

        //delete the previous build and generated directories
        clean: {
            build: 'build',
            generated: ['build/generated', 'styles/app.css']
        },

        //copy images to the build
        copy: {
            img: {
                src: ['img/**'],
                dest: 'build/img/'
            }
        },

        //inline all Angular templates as Strings into a JS file that can be concatted in the build
        ngtemplates: {
            app: {
                options: {base: '.'},
                src: ['templates/**/*.html'],
                dest: 'build/generated/ngtemplates.js'
            }
        },

        'git-describe': {
            build: {
                options: {
                    prop: "git.buildnumber"
                }
            }
        },

        //replace all the script tags in the HTML file with the single built script
        htmlrefs: {
            options: {
                file: {
                    buildNumber: "<%= git.buildnumber %>"
                }
            },
            build: {
                src: 'index.html',
                dest: 'build/'
            }
        },

        //convert our Angular files that use simple injects to their build-safe versions
        ngmin: {
            app: {
                expand: true,
                cwd: 'js',
                src: ['**/*.js', '!build/', '!components/'],
                dest: 'build/generated'
            }
        },

        //minify the HTML file (index.html)
        htmlmin: {
            index: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'build/index.html': ['build/index.html']
                }
            }
        },

        bower: {
            dev: {
                dest: 'build/components'
            }
        },

        //combine all JS into one file, all CSS into one file
        concat: {
            js: {
                src: [
                    'build/components/*.js',
                    'build/generated/**/*.js' //all our angular components, including templates
                ],
                dest: 'build/app.js'
            }
        },

        //minify the JS file to be as small as possible
        uglify: {
            app: {
                'build/app.js': ['build/app.js']
            }
        },

        //regarde (instead of watch) watches for changes in file to fire tasks
        regarde: {
            js: {
                files: ['js/**/*.js', '**/*.html'],
                tasks: ['clear', 'livereload', 'karma:unit:run']
            },
            templates: {
                files: ['**/*.html'],
                tasks: ['clear', 'livereload', 'karma:unit:run']
            },
            tests: {
                files: ['test/browser/**/*.js'],
                tasks: ['clear', 'livereload', 'karma:unit:run']
            },
            styles: {
                files: ['styles/**/*.styl'],
                tasks: ['clear', 'stylus', 'livereload']
            }
        },

        //launch a tiny-lr server for livereload
        connect: {
            livereload: {
                options: {
                    port: 9001,
                    middleware: function (connect, options) {
                        return [require('grunt-contrib-livereload/lib/utils').livereloadSnippet, (function (c, p) {
                            return c.static(require('path').resolve(p));
                        })(connect, '.')]
                    }
                }
            }
        }

    });

    grunt.registerTask('test', ['karma:continuous']);
    /**
     * build task explanation
     * 1. delete the existing "build" directory.
     * 2. compile stylus into CSS.
     * 3. copy images into the build.
     * 4. generate a JS file containing all our Angular templates.
     * 5. generate build-safe versions of our Angular controllers, services, directives, filters, etc.
     * 6. combine all our scripts, including generated versions, into a single JS file. Also combine all CSS into one file.
     * 7. compress the single JS file.
     * 8. replace all our <script> tags in our index.html file with a single <script> tag pointing to the combined/compressed JS file.
     * 9. compress the index.html file.
     * 10. delete the generated directory
     */
    grunt.registerTask('build', [
        'clean:build',
        'stylus',
        'copy',
        'ngtemplates',
        'ngmin',
        'bower',
        'concat',
        'uglify',
        'git-describe',
        'htmlrefs',
        'htmlmin',
//        'clean:generated'
    ]);
    // 'dev' task calls 'regarde' which indirectly calls 'karma:unit:run'. This expects to connect to a karma server on port 9100.
    // therefore, be sure to run the karma:unit task in a separate console when running the dev task.
    grunt.registerTask('dev', ['livereload-start', 'connect:livereload', 'regarde']);
};
