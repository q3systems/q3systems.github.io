$(document).ready(function() {
	$('#submit').click(function(){

		$.post("assets/php/send.php", $(".contact-form").serialize(),  function(response) {   
			$('#success').html(response);
		});
		
		return false;
	});

	var time = 7; // time in seconds

 	var $progressBar,
      $bar, 
      $elem, 
      isPause, 
      tick,
      percentTime;
 
    //Init the carousel
    $("#main-slider").find('.owl-carousel').owlCarousel({
      slideSpeed : 500,
      paginationSpeed : 500,
      singleItem : true,
      navigation : true,
		navigationText: [
		"<i class='fa fa-angle-left'></i>",
		"<i class='fa fa-angle-right'></i>"
		],
      afterInit : progressBar,
      afterMove : moved,
      startDragging : pauseOnDragging,
      //autoHeight : true,
      transitionStyle : "fadeUp"
    });
 
    //Init progressBar where elem is $("#owl-demo")
    function progressBar(elem){
    	console.log(elem);
      $elem = elem;
      //build progress bar elements
      buildProgressBar();
      //start counting
      start();
    }
 
    //create div#progressBar and div#bar then append to $(".owl-carousel")
    function buildProgressBar(){
      $progressBar = $("<div>",{
        id:"progressBar"
      });
      $bar = $("<div>",{
        id:"bar"
      });
      $progressBar.append($bar).appendTo($elem);
    }
 
    function start() {
      //reset timer
      percentTime = 0;
      isPause = false;
      //run interval every 0.01 second
      tick = setInterval(interval, 10);
    };
 
    function interval() {
      if(isPause === false){
        percentTime += 1 / time;
        $bar.css({
           width: percentTime+"%"
         });
        //if percentTime is equal or greater than 100
        if(percentTime >= 100){
          //slide to next item 
          $elem.trigger('owl.next')
        }
      }
    }
 
    //pause while dragging 
    function pauseOnDragging(){
      isPause = true;
    }
 
    //moved callback
    function moved(){
      //clear interval
      clearTimeout(tick);
      //start again
      start();
    }

    $('.progress-bar').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		if (visible) {
			$(this).css('width', $(this).data('width') + '%');
			$(this).unbind('inview');
		}
	});

	//Animated Number
	$.fn.animateNumbers = function(stop, commas, duration, ease) {
		return this.each(function() {
			var $this = $(this);
			var start = parseInt($this.text().replace(/,/g, ""));
			commas = (commas === undefined) ? true : commas;
			$({value: start}).animate({value: stop}, {
				duration: duration == undefined ? 1000 : duration,
				easing: ease == undefined ? "swing" : ease,
				step: function() {
					$this.text(Math.floor(this.value));
					if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
				},
				complete: function() {
					if (parseInt($this.text()) !== stop) {
						$this.text(stop);
						if (commas) { $this.text($this.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")); }
					}
				}
			});
		});
	};

	$('.animated-number').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
		var $this = $(this);
		if (visible) {
			$this.animateNumbers($this.data('digit'), false, $this.data('duration')); 
			$this.unbind('inview');
		}
	});
});
