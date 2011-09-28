# Validate
#   Handles validating client-side data, files, and deferring validation 
#   to backend resources

@Validate = 
  mimes:
    images: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/x-png', 'image/gif']

  inclusionOf: (str, collection) ->
    included = false
    included = true if el.toString() == str.toString() for el in collection
    included

  numericalityOf: (str) ->
    str.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/)

  presenceOf: (str, options = {}) ->
    str && str.length > 0

  # Validate length of string given options
  #   options =
  #     allow_blank
  #     less_than
  #     greater_than
  #     less_than_or_equal
  #     greater_than_or_equal
  #
  lengthOf: (str, options = {}) ->
    length = str.length
    return true if length == 0 && options.allow_blank
    return false if length >= options.less_than
    return false if length <= options.greater_than
    return false if length > options.less_than_or_equal
    return false if length < options.greater_than_or_equal
    true

  # Validate string against regexp and options
  #   options = 
  #    allow_blank
  #    @lengthOf.options
  #
  formatOf: (str, regexp, options = {}) ->
    return true if str.length == 0 && options.allow_blank
    return false unless str.match(regexp)
    return false unless @lengthOf(str, options)
    true

  # Validate uniqueness of model field with backend resource
  #   url_options =
  #     model:            server model name
  #     field:            server field name
  #     value:            value to be validate uniqueness of
  #
  #   callbacks =
  #     valid():         Fired when server returns {unique: true}
  #     invalid():         Fired when server returns {unique: false}
  #     error():        Fired when requested resource is invalid
  #
  uniquenessOf: (value, url_options = {}, callbacks = {}) ->
    model = url_options.model
    field = url_options.field
    url = "/validations/#{model}/#{field}/uniqueness.json?value=#{value}"
    $.getJSON url, (response) =>
      if response.unique
        callbacks.valid?()
      else if response.unique == false
        callbacks.invalid?()
      else
        callbacks.error?()
        
  # Pass file input selector and mimes to be checked against
  # - options:
  #     pass_on_ambiguity [boolean]        Returns true if browser mime data is ambigous to
  #                                        defer to server and not restrict valid client upload
  #     size [Integer]                     File size (bytes) to validate against
  #
  file: (file_input, valid_mimes = [], options = {}) ->
    $file = $(file_input).prop('files')[0]
    filename = $file.name
    mimetype = $file.type
    bytes = $file.size    
    valid_mime = (mime for mime in valid_mimes when mime == mimetype).length > 0
    valid_size = (!options.size || bytes <= options.size)
    return true if valid_mime and valid_size
    return true if (!mimetype || !bytes) and options.pass_on_ambiguity
    false

  image: (file_input, options = {}) -> 
    @file(file_input, @mimes.images, options)