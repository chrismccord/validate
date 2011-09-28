(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Validate = {
    mimes: {
      images: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/x-png', 'image/gif']
    },
    inclusionOf: function(str, collection) {
      var el, included;
      included = false;
      if ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = collection.length; _i < _len; _i++) {
          el = collection[_i];
          _results.push(el.toString() === str.toString());
        }
        return _results;
      })()) {
        included = true;
      }
      return included;
    },
    numericalityOf: function(str) {
      return str.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/);
    },
    presenceOf: function(str, options) {
      if (options == null) {
        options = {};
      }
      return str && str.length > 0;
    },
    lengthOf: function(str, options) {
      var length;
      if (options == null) {
        options = {};
      }
      length = str.length;
      if (length === 0 && options.allow_blank) {
        return true;
      }
      if (length >= options.less_than) {
        return false;
      }
      if (length <= options.greater_than) {
        return false;
      }
      if (length > options.less_than_or_equal) {
        return false;
      }
      if (length < options.greater_than_or_equal) {
        return false;
      }
      return true;
    },
    formatOf: function(str, regexp, options) {
      if (options == null) {
        options = {};
      }
      if (str.length === 0 && options.allow_blank) {
        return true;
      }
      if (!str.match(regexp)) {
        return false;
      }
      if (!this.lengthOf(str, options)) {
        return false;
      }
      return true;
    },
    uniquenessOf: function(value, url_options, callbacks) {
      var field, model, url;
      if (url_options == null) {
        url_options = {};
      }
      if (callbacks == null) {
        callbacks = {};
      }
      model = url_options.model;
      field = url_options.field;
      url = "/validations/" + model + "/" + field + "/uniqueness.json?value=" + value;
      return $.getJSON(url, __bind(function(response) {
        if (response.unique) {
          return typeof callbacks.valid == "function" ? callbacks.valid() : void 0;
        } else if (response.unique === false) {
          return typeof callbacks.invalid == "function" ? callbacks.invalid() : void 0;
        } else {
          return typeof callbacks.error == "function" ? callbacks.error() : void 0;
        }
      }, this));
    },
    file: function(file_input, valid_mimes, options) {
      var $file, bytes, filename, mime, mimetype, valid_mime, valid_size;
      if (valid_mimes == null) {
        valid_mimes = [];
      }
      if (options == null) {
        options = {};
      }
      $file = $(file_input).prop('files')[0];
      filename = $file.name;
      mimetype = $file.type;
      bytes = $file.size;
      valid_mime = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = valid_mimes.length; _i < _len; _i++) {
          mime = valid_mimes[_i];
          if (mime === mimetype) {
            _results.push(mime);
          }
        }
        return _results;
      })()).length > 0;
      valid_size = !options.size || bytes <= options.size;
      if (valid_mime && valid_size) {
        return true;
      }
      if ((!mimetype || !bytes) && options.pass_on_ambiguity) {
        return true;
      }
      return false;
    },
    image: function(file_input, options) {
      if (options == null) {
        options = {};
      }
      return this.file(file_input, this.mimes.images, options);
    }
  };
}).call(this);
