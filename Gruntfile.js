module.exports = function(grunt) {
  grunt.initConfig({


    //
    // CSS Minify
    //
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      "css": {
        files: {
          "card-js.min.css": ["./src/css/**/*.css"]
        }
      }
    },


    //
    // JavaScript Minify
    //
    uglify: {
      options: {
        mangle: false
      },
      js: {
        files: {
          "card-js.min.js": [ "src/js/**/*.js" ]
        }
      }
    },


    //
    // Watch Configuration
    //
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


  //
  // Plugin loading
  //
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');


  //
  // Task definition
  //
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['cssmin:css', 'uglify:js']);

};