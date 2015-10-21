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
        src: [
          "Gruntfile.js",
          "app.js",
          "lib/index.js",
          "lib/config/**/*.json",
          "lib/server/**/*.js"
        ],
        options: {
          jshintrc: true,
          globals: {
            jQuery: true,
            console: true,
            module: true
          }
        }
      },
      client: {
        src: [
          "lib/client_admin/js/**/*.js",
          "lib/client_admin/js/**/*.json",
          "lib/client_admin/js/**/*.jsx"
        ],
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
    browserify: {
      options: {
        transform: [
          require("grunt-react").browserify
        ]
      },
      dist: {
        src: "lib/client_admin/js/app.jsx",
        dest: "lib/content/js/admin.js"
      }
    },
    less: {
      dist: {
        files: {
          "lib/content/css/admin.css": "lib/client_admin/less/app.less"
        }
      }
    },
    watch: {
      options: {
        livereload: reloadPort,
        nospawn: true
      },
      configFiles: {
        files: [
          "Gruntfile.js",
          "app.js",
          "lib/index.js",
          "lib/config/**/*.json",
          "lib/server/**/*.json",
          "lib/server/**/*.js"
        ],
        tasks: [
          "jshint:server",
          "develop"
        ],
        options: {
          nospawn: true,
          livereload: reloadPort
        }
      },
      browserify: {
        files: [
          "lib/client_admin/js/**/*.jsx",
          "lib/client_admin/js/**/*.js"
        ],
        tasks: [
          "jshint:client",
          "browserify"
        ],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: [
          "lib/client_admin/less/**/*.less"
        ],
        tasks: [
          "less"
        ],
        options: {
          livereload: reloadPort
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

  grunt.registerTask("build", ["jshint", "browserify", "css"]);

};
