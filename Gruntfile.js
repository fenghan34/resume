module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      compile: {
        src: './styles/less/theme.less',
        dest: './styles/css/theme.css',
      },
    },
    watch: {
      styles: {
        files: ['styles/less/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true,
        },
      },
    },
  })

  // Load the plugin that compiles less to css
  grunt.loadNpmTasks('grunt-contrib-less')

  // Load the plugin that watches file changes
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Default tasks
  grunt.registerTask('default', ['less'])
}
