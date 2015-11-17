/*
 * Awesome tutorial - http://blog.elenakolevska.com/using-grunt-with-laravel-and-bootstrap/
 */
module.exports = function(grunt) {

  //Initializing the configuration object
  grunt.initConfig({

    // Task configuration
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      "css": {
        files: {
          "dist/cardjs.min.css": ["./src/css/**/*.css"]
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      js: {
        files: {
          "dist/cardjs.min.js": [ "src/js/**/*.js" ]
        }
      }
    },

    watch: {
      "css": {
        files: [
          "./src/css/**/*.css"
        ],
        tasks: ["cssmin:css"],
        options: {
          livereload: true
        }
      },
      "js": {
        files: [
          './src/js/**/*.js'
        ],
        tasks: ["uglify:js"],
        options: {
          livereload: true
        }
      }
    }

  });

  // // Plugin loading
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Task definition
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['cssmin:css', 'uglify:js']);

};