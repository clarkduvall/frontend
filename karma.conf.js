// Karma configuration
// Generated on Sun Mar 30 2014 20:33:07 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.15/angular.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.15/angular-mocks.js',
      'http://cdnjs.cloudflare.com/ajax/libs/d3/3.4.4/d3.min.js',
      'js/*.js',
      'test/*.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
