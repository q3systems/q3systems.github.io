(function ( $ ) {
 
    $.fn.imersive = function(mainOptions) {
	
		var mainSettings = $.extend({
			buttonsPerLine:6,
			buttonsDistance:20,
			maximizeTo:'body'
		}, mainOptions );
	
	
		var thisImersive = this;
		var fullLeft = 0;
		var fullTop = 0;
		
		if(thisImersive.get( 0 ).nodeName.toLowerCase() == 'body'){
			if($(thisImersive).height() == 0){
				$(thisImersive).height($(document).height())
			}
			
			if($(thisImersive).width() == 0){
				$(thisImersive).width($(document).width())
			}
		}else{
			fullTop = 0 - ($(document).height() - thisImersive.height());
			fullLeft = 0 - ($(document).width() - thisImersive.width());
		}
		
		
		this.createButton = function(options){
		
			var imersiveButtons = $(".imersiveButton");
			var imersiveButtonsQty = imersiveButtons.length + 1;
			
			var buttonsInLine = imersiveButtonsQty >  mainSettings.buttonsPerLine ? mainSettings.buttonsPerLine : imersiveButtonsQty ;
			var buttonsInColumn = Math.ceil(imersiveButtonsQty / buttonsInLine);
			var buttonPadding = mainSettings.buttonsDistance/2;
			
			
			var settings = $.extend({
				gradient: "",
				title:"",
				titleSize:20,
				debug:false
			}, options );
			
			var buttonWidth = (parseInt(thisImersive.width()) / buttonsInLine) - buttonPadding - (buttonPadding/buttonsInLine);
			var buttonHeight = (parseInt(thisImersive.height()) / buttonsInColumn) - buttonPadding - (buttonPadding/buttonsInColumn);


			
			if(settings.debug){

			}
			
			//container - Border
			var containerButton = $("<div>");
			containerButton.addClass("imersiveButton");
			containerButton.css({
				"border":"0px solid #000",
				"position":"absolute",
				"display":"block"
			});
			containerButton.attr("Imersive","normal");
			containerButton.attr("id","imersiveButton_"+imersiveButtonsQty);

			//Button - Gradient
			var button = $("<div>");
			button.addClass(settings.gradient.toLowerCase() + "Imersive");
			button.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center"
			});
			
			//Content
			var content = $("<div>");
			content.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center",
				"cursor":"pointer"
			});
			
			//Title -- Button format
			var title = $("<p class='imersiveTitle' style='font-size:"+settings.titleSize+"px; color:#fff;'>"+settings.title+"</p>");

			//Action
			button.click(function(){
				imersiveButtons.css("z-index","1");
				$(this).parent().css({
					"z-index":"5"
				});

				$(this).parent().animate({
					width:$(document).width(),
					height:$(document).height(),
					left: (fullLeft) + "px",
					top: (fullTop) + "px"
				},{
					//duration: 350,
					queue: false
				});
				
				$(this).off("click");
				$(this).parent().attr("Imersive","maximized");
			});
			
			
			
			//Appends
			content.append(title);
			button.append(content);
			containerButton.append(button);
			$(thisImersive).append(containerButton);
			
		
			//Resize
			var leftCtrl = 0;
			var topCtrl = 0;
			
			$(".imersiveButton").each(function(i){	
				var lineBreak = i % mainSettings.buttonsPerLine == 0 ? true : false;
				var title = $(this).find(".imersiveTitle").first();
				
				leftCtrl++;
				
				if(lineBreak){
					leftCtrl = 0;
					if(i>0){
						topCtrl ++;
					}
				}
				
				//Resize all buttons
				$(this).css({
					width:buttonWidth,
					height:buttonHeight,
					left: (leftCtrl * buttonWidth) + (buttonPadding*(leftCtrl+1)),
					top: (topCtrl * buttonHeight) + (buttonPadding*(topCtrl+1))
				});
				
				//Resize title
				title.css({
					"padding-top": (buttonHeight - title.height())/2,
				});
				
			});
		};
 
		return this;
    };
 
}( jQuery ));