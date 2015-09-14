"use strict";

module.exports = function(grunt) {

  // show elapsed time at the end
  require("time-grunt")(grunt);
  // load all grunt tasks
  require("load-grunt-tasks")(grunt);

  var port = 9000;
  var reloadPort = 35729,
    files;

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    develop: {
      server: {
        file: "app.js"
      }
    },
    jshint: {
      server: {
        src: ["Gruntfile.js", "app.js", "lib/js/**/*.js"],
        options: {
          jshintrc: true,
          globals: {
            jQuery: true,
            console: true,
            module: true
          }
        }
      }
    },
    watch: {
      options: {
        livereload: reloadPort,
        nospawn: true
      },
      configFiles: {
        files: ["Gruntfile.js", "app.js", "lib/**/*.js"],
        tasks: ["jshint:server"],
        options: {
          reload: port
        }
      },
      jade: {
        files: [
          "views/**/*.jade"
        ],
        options: {
          livereload: reloadPort
        }
      }
    }
  });

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask("default", ["develop", "watch"]);

  grunt.registerTask("build", ["jshint"]);

};
