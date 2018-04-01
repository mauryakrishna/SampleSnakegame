module.exports = function (grunt) {
    grunt.initConfig({
        srcDir: './app',
        distDir: './public',
        clean: {
            on_start: ['<%= distDir %>'],
            on_finish: []
        },
        htmlmin:{
            dist: {
                options:{
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand:true,
                cwd:'<%= distDir %>',
                src: ['**/*.html'],
                dest: '<%= distDir %>'
            }
        },
        //correct the index to pickup right css file
        'string-replace': {
            inline: {
                files: {
                    '<%= distDir %>/index.html': '<%= distDir%>/index.html'
                },
                options: {
                    replacements: [
                        {
                            pattern: 'app.css',
                            replacement: 'app.min.css'
                        },
                        {
                            pattern: 'bootstrap.css',
                            replacement: 'bootstrap.min.css'
                        }
                    ]
                }
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            dev: {
                files: {
                    '<%= srcDir %>/app.css': ['./app/css/app.css',
                                                    './app/home/home.css',
                                                    './app/play/board.css',
                                                    './app/validateemailid/validateemailid.css']
                }
            },
            release: {
                files: {
                    '<%= distDir %>/app.min.css': ['./app/css/app.css', './app/home/home.css', './app/play/board.css']
                }
            }
        },
        //the below replace uses @@key syntax for finding the replacing word
        replace: {
            dist_build_time: {
                options:{
                    variables:{
                        "build-time": (new Date()).getTime().toString()
                    },
                    prefix:'@@'
                },
                files: [
                    {src: ['<%=distDir%>/index.html'], dest: './'}
                ]
            }
        },

        requirejs: {
            //https://github.com/requirejs/r.js/blob/master/build/example.build.js
            compile: {
                options: {
                    optimize: 'uglify2',
                    uglify2: {
                        mangle:true
                    },
                    baseUrl: './',
                    appDir: '<%= srcDir %>',
                    dir:'<%= distDir %>',
                    generateSourceMaps:false,
                    removeCombined: true,
                    fileExclusionRegExp: /^(r|build)\.js$/,
                    modules: [
                        {
                            name: 'require-config'
                        }
                    ],
                    preserveLicenseComments: true,
                    mainConfigFile: "./app/require-config.js"
                }
            }
        }
    });


    grunt.registerTask('dev', ['cssmin:dev']);

    //release
    grunt.registerTask('default', 'release');
    grunt.registerTask('clean', 'clean');
    grunt.registerTask('cssmin', 'cssmin');
    grunt.registerTask('string-replace', 'string-replace:inline');
    grunt.registerTask('htmlmin', 'htmlmin');
    grunt.registerTask('replace', 'replace');
    grunt.registerTask('release', ['clean:on_start', 'requirejs', 'cssmin:release', 'htmlmin', 'string-replace', 'replace']);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-replace');
};