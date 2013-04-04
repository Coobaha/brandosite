  $(function() {
        var $sidescroll = (function() {
          var $rows = $('#ss-container > div.ss-row'), // the row elements
            $rowsViewport, $rowsOutViewport, // we will cache the inviewport rows and the outside viewport rows
            $links = $('#ss-links > a'), // navigation menu links
            $toTop = $("#back-top > a"), //back to top button
            $win = $(window), // the window element            
            winSize = {}, // we will store the window sizes here
            anim = false,  // used in the scroll setTimeout function
            scollPageSpeed = 2000 ,  // page scroll speed            
            scollPageEasing = 'easeInOutExpo',  // page scroll easing
            hasPerspective = true,  // perspective? SURE!
            perspective = hasPerspective && Modernizr.csstransforms3d,

            // just creating a bunch of functions that are defined later
            init = function() {  // initialize function
              $toTop.hide(); // hide back to top button on initial view
              getWinSize();  // get window sizes
              initEvents();  // initialize events
              defineViewport(); // define the inviewport selector
              setViewportRows();  // gets the elements that match the previous selector
              if( perspective ) {  // if perspective's true, do the css dance
                $rows.css({
                  '-webkit-perspective' : 600,
                  '-webkit-perspective-origin' : '50% 0%'
                });
              }
              // $rowsViewport are just that, in window at the moment
              $rowsViewport.find('a.ss-circle').addClass('ss-circle-deco'); // show the pointers for the inviewport rows              
              placeRows();  // set positions for each row
            },
            // defines a selector that gathers the row elems that are initially visible.
            // the element is visible if its top is less than the window's height.
            // these elements will not be affected when scrolling the page.
            defineViewport  = function() {
              $.extend( $.expr[':'], { inviewport : function ( el ) {
                  // if the element's y value is less than the window's height, show it
                  if ( $(el).offset().top < winSize.height ) {
                    return true;
                  }
                  return false;
                }
              });
            },  
            // check which rows are initially visible and filter them into two arrays
            setViewportRows = function() {
              $rowsViewport = $rows.filter(':inviewport'); // Creates a new array with all elements that are initially visable
              $rowsOutViewport = $rows.not( $rowsViewport ) // Creates a new array with all elements that are NOT initially visable
            }, 
            getWinSize = function() {  // get window sizes
              winSize.width = $win.width();
              winSize.height = $win.height();
            },            
            initEvents = function() {  // initialize some events 
              // navigation menu links, scroll to the respective section.
              $links.on( 'click.Scrolling', function( event ) {
                $('html, body').stop().animate({
                  // scroll to the trigger element or (this)'s href (href="#someScrollStop")
                  scrollTop: $( $(this).attr('href') ).offset().top  // scroll to elem that has id=menu's href
                }, scollPageSpeed, scollPageEasing );
                return false;
              });
              $toTop.on( 'click.Scrolling', function( event ) {
                $('html, body').stop().animate({
                  // scroll to the trigger element or (this)'s href (href="#someScrollStop")
                  scrollTop: $( $(this).attr('href') ).offset().top  // scroll to elem that has id=menu's href
                }, scollPageSpeed, scollPageEasing );
                return false;
              });
              $(window).on({
                // if window is resized, redefine which rows are initially visible (reset everything based on new window size)
                'resize.Scrolling' : function( event ) { 
                  getWinSize();  // get the window sizes again
                  setViewportRows();  // redefine which rows are initially visible (:inviewport)
                  $rows.find('a.ss-circle').removeClass('ss-circle-deco');  // remove pointers for every row
                  $rowsViewport.each( function() {  // show inviewport rows and respective pointers
                    $(this).find('div.ss-left')  //reset all thier styles
                         .css({ left : '0%' })
                         .end()
                         .find('div.ss-right')
                         .css({ right : '0%' })
                         .end()
                         .find('a.ss-circle')
                         .addClass('ss-circle-deco');
                  });
                },
                'scroll.Scrolling' : function( event ) {
                  // set $toTop button to fade in or fade out
                  if ($(this).scrollTop() > 100) {
                    $toTop.fadeIn();
                  }
                  else {
                    $toTop.fadeOut();
                  }
                  // when scrolling page, change position of each row
                  if( anim ) return false;
                  anim = true;
                  setTimeout( function() {  // set a timeout to avoid placeRows function getting called on every scroll trigger
                  placeRows();  // basically don't place a new row every single time it's barely scrolled, just after every 10ms?
                  anim = false;
                }, 10 );
                }
              });
            },
            // sets the position of the rows (left and right row elements).
            // Both of these elements will start with -50% for the left/right (not visible)
            // and this value should be 0% (final position) when the element is on the
            // center of the window.
            placeRows = function() {
              var winscroll = $win.scrollTop(),  // how much we scrolled so far (how far from top of $win we are)
                // setting winCenter == the y value for the center of the screen for every row that is not inviewport
                winCenter = winSize.height / 2 + winscroll;
              $rowsOutViewport.each( function(i) {
                var $row  = $(this), // $row == the current row being run through the each loop
                  $rowL = $row.find('div.ss-left'),  // the left side element
                  $rowR = $row.find('div.ss-right'), // the right side element
                  rowT  = $row.offset().top;  // top value

                  // for every row, check if it's top value it greater than the (current browser window's height + how far from the top of the entire doc we've scrolled)
                if( rowT > winSize.height + winscroll ) {
                  // BELOW IF STATEMENT is only relevent if using 3d transform css property
                  if( perspective ) {  //
                    $rowL.css({
                      // hide the row if it is under the viewport (basically rotate them into upright (vertical) position offscreen)
                      '-webkit-transform' : 'translate3d(-75%, 0, 0) rotateY(-90deg) translate3d(-75%, 0, 0)',
                      'opacity' : 0
                    });
                    $rowR.css({
                      '-webkit-transform' : 'translate3d(75%, 0, 0) rotateY(90deg) translate3d(75%, 0, 0)',
                      'opacity'     : 0
                    });
                  }
                  else {
                    $rowL.css({ left    : '-50%' });
                    $rowR.css({ right     : '-50%' });
                  }
                }
                // if not, the row should become visible (0% of left/right) as it gets closer to the center of the screen.
                else {
                  var rowH  = $row.height(),  // row's height
                    // the value on each scrolling step will be proportional to the distance from the center of the screen to its height
                    // basically using the height of each row to determine how quickly it scrolls toward the middle
                    factor  = ( ( ( rowT + rowH / 2 ) - winCenter ) / ( winSize.height / 2 + rowH / 2 ) ),
                    // value for the left / right of each side of the row.
                    val = Math.max( factor * 50, 0 );  // 0% is the limit (stops when it hits the center basically)
                  if( val <= 0 ) {  // when 0% is reached show the pointer for that row                    
                    if( !$row.data('pointer') ) {
                      $row.data( 'pointer', true );
                      $row.find('.ss-circle').addClass('ss-circle-deco');
                    }
                  }
                  else {  // the pointer should not be shown (because it the page is being scrolled up and rows are moving away from the center)
                    if( $row.data('pointer') ) {
                      $row.data( 'pointer', false );
                      $row.find('.ss-circle').removeClass('ss-circle-deco');
                    }
                  }

                  // again only relevant if using css transitions (basically does the exact same calculations)
                  if( perspective ) { // set calculated values
                    var t = Math.max( factor * 75, 0 ),
                      r = Math.max( factor * 90, 0 ),
                      o = Math.min( Math.abs( factor - 1 ), 1 );
                    $rowL.css({
                      '-webkit-transform' : 'translate3d(-' + t + '%, 0, 0) rotateY(-' + r + 'deg) translate3d(-' + t + '%, 0, 0)',
                      'opacity'     : o
                    });
                    $rowR.css({
                      '-webkit-transform' : 'translate3d(' + t + '%, 0, 0) rotateY(' + r + 'deg) translate3d(' + t + '%, 0, 0)',
                      'opacity'     : o
                    });
                  }
                  // else we are scrolling backward
                  else {
                    $rowL.css({ left  : - val + '%' });
                    $rowR.css({ right   : - val + '%' });
                  }
                } 
              });
            }; // return all of the values entire init function
          return { init : init };
        })();  // function run itself
        $sidescroll.init();
      });
