###
 debouncedresize: special jQuery event that happens once after a window resize

 latest version and complete README available on Github:
 https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js

 Copyright 2011 @louis_remi
 Licensed under the MIT license.
###
$event = $.event
$special
resizeTimeout


$special = $event.special.debouncedresize = {
  setup: ->
    $(@).on "resize", $special.handler

  teardown: ->
    $(@).off "resize", $special.handler

  handler: (event, execAsap) ->
    # Save the context
    context = @
    args = arguments
    dispatch = ->
      # set correct event type
      event.type = "debouncedresize"
      $event.dispatch.apply context, args
    if resizeTimeout
      clearTimeout resizeTimeout

    if execAsap then dispatch() else resizeTimeout = setTimeout dispatch, $special.threshold
  threshold: 250
}

### 
======================= imagesLoaded Plugin ===============================
https://github.com/desandro/imagesloaded

$('#my-container').imagesLoaded(myFunction)
execute a callback when all images have loaded.
needed because .load() doesn't work on cached images
callback function gets image collection as argument
this is the container

original: MIT license. Paul Irish. 2010.
contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou

blank image data-uri bypasses webkit log warning (thx doug jones)
###
BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

$.fn.imagesLoaded = (callback) ->
  $this = @

  if $.isFunction($.Deferred)
    deferred = $.Deferred()
  else
    deferred = 0
  hasNotify = $.isFunction(deferred.notify)
  $images = $this.find('img').add $this.filter 'img'
  loaded = []
  proper = []
  broken = []

  # Register deferred callbacks
  if $.isPlainObject(callback)
    $.each callback, (key, value) ->
      if key is 'callback'
        callback = value
      else if deferred
        deferred[key](value)


  doneLoading = ->
    $proper = $(proper)
    $broken = $(broken)

    if deferred
      if broken.length
        deferred.reject $images, $proper, $broken
      else
        deferred.resolve $images

    if $.isFunction(callback)
      callback.call $this, $images, $proper, $broken

  imgLoaded = (img, isBroken) ->
    # don't proceed if BLANK image, or image is already loaded
    if img.src is BLANK or $.inArray(img, loaded) isnt -1
      return 

    # store element in loaded images array
    loaded.push img

    # keep track of broken and properly loaded images
    if isBroken
      broken.push img
    else
      proper.push img

    # cache image and its state for future calls
    $.data(img, 'imagesLoaded', { isBroken: isBroken, src: img.src } )
    # trigger deferred progress method if present
    if hasNotify
      deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] )

    # call doneLoading and clean listeners if all images are loaded
    if $images.length is loaded.length
      setTimeout doneLoading
      $images.unbind '.imagesLoaded'

  # if no images, trigger immediately
  if !$images.length
    doneLoading()
  else
    $images.bind 'load.imagesLoaded error.imagesLoaded', (event) ->
      # trigger imgLoaded
      imgLoaded(event.target, event.type is 'error')
    .each (i, el) ->
      src = el.src

      # find out if this image has been already checked for status
      # if it was, and src has not changed, call imgLoaded on it
      cached = $.data(el, 'imagesLoaded')
      if cached and cached.src is src
        imgLoaded(el, cached.isBroken)
        return


      # if complete is true and browser supports natural sizes, try
      # to check for image status manually
      if el.complete and el.naturalWidth isnt undefined
        imgLoaded(el, el.naturalWidth is 0 or el.naturalHeight is 0)


      # cached images don't fire load sometimes, so we reset src, but only when
      # dealing with IE, or image is complete (loaded) and failed manual check
      # webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      if el.readyState or el.complete
        el.src = BLANK
        el.src = src

  if deferred then deferred.promise($this) else $this


Grid = ( () ->
  #list of items
  $grid = $ '#og-grid'
  #the items
  $items = $grid.children('li')
  # current expanded item's index
  current = -1
  # position (top) of the expanded item
  # used to know if the preview will expand in a different row
  previewPos = -1
  # extra amount of pixels to scroll the window
  scrollExtra = 0
  # extra margin when expanded (between preview overlay and the next items)
  marginExpanded = 10
  $window = $(window)
  winsize
  $body = $('html, body')
  # transitionend events
  transEndEventNames =
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition' : 'transitionend',
    'OTransition' : 'oTransitionEnd',
    'msTransition' : 'MSTransitionEnd',
    'transition' : 'transitionend'
  transEndEventName = transEndEventNames[ Modernizr.prefixed('transition' )]
  # support for csstransitions
  support = Modernizr.csstransitions
  # default settings
  settings =
    minHeight : 500,
    speed : 350,
    easing : 'ease'

  init = (config) ->
    
    # the settings..
    settings = $.extend(true, {}, settings, config )

    # preload all images
    $grid.imagesLoaded( () ->

      # save item´s size and offset
      saveItemInfo(true)
      # get window´s size
      getWinSize()
      # initialize some events
      initEvents()
    )
  # saves the item´s offset top and height (if saveheight is true)
  saveItemInfo = (saveheight) ->
    $items.each( ->
      $item = $(@)
      $item.data('offsetTop', $item.offset().top)
      if saveheight
        $item.data('height', $item.height())
        # ------------------------START HERE-----------------------------------


    )
  )
