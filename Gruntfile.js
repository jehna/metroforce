module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      default: {
        files: {
          'metroforce.js': ['src/*.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['build'],
        options: {
          spawn: false,
        },
      },
    },
    wrap: {
      default: {
        src: ['metroforce.js'],
        dest: '',
        options: {
          wrapper: ['window.metroforce = (function() {\n', '\nreturn metroforce;\n})();']
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wrap');
  
  grunt.registerTask('build', ['concat', 'wrap']);
  grunt.registerTask('default', ['build', 'watch']);

};