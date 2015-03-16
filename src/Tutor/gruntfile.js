// This file in the main entry point for defining grunt tasks and using grunt plugins.
// Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409

module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },

        uglify: {
            build: {
                files: {
                    "wwwroot/scripts/tutor.js": ["wwwroot/lib/jquery/**/*.js", "wwwroot/lib/jquery-validation/**/*.js", "wwwroot/lib/**/*.js", "Scripts/**/*.js"]
                }
            }
        },
        watch: {
            scripts: {
                files: ["Scripts/**/*.js"],
                tasks: ["copy:dev"]
            }
        },

        copy: {
            dev: {
                files: [
                    { expand: true, flatten:true, cwd:"Scripts/", filter:"isFile", src: ["**"], dest: "wwwroot/scripts/" }
                ]
            }
        }
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("dev", ["bower:install", "copy:dev"]);


    grunt.registerTask("prod", ["bower:install", "uglify:build"]);

    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.
    grunt.loadNpmTasks("grunt-bower-task");

    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.loadNpmTasks("grunt-contrib-watch");
};