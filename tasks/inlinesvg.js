'use strict';

module.exports = function (grunt) {
  var MARKER = /\{(\w+)\}/gi;

  grunt.registerMultiTask('inlinesvg', 'Generate inline svg sprite', function () {
    var
      options = this.options(),
      buff = '';

    this.files.forEach(function (f) {
      var
        file = f.src[0],
        parts = file.match(/^(.*)\/([^\/]*)$/),
        fileName = parts[2],
        filePath = parts[1],
        result = options.handler(fileName);

      if (result) {
        buff +=
          options.selector.replace(MARKER, function (match, keyName) {
            return result.selector[keyName];
          }) +
          '{' +
          options.rules.replace(MARKER, function (match, keyName) {
            var file = filePath + '/' + result.rules[keyName];
            if (!grunt.file.exists(file)) {
              grunt.log.warn('Source file "' + file + '" not found.');
              return match;
            } else {
              return encodeURIComponent(grunt.file.read(file));
            }
          }) +
          '}\n'
        ;
      }
    });

    grunt.file.write(options.dest, buff);

  });
};