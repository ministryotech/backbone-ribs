// http://gruntjs.com/getting-started

module.exports = function (grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'backbone-ribs.js',
                dest: 'backbone-ribs.min.js'
            }
        },
        jshint: {
            src: ['backbone-ribs.js']
        }
    });
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify']);

};