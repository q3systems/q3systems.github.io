(function ( $ ) {
 
    $.fn.imersive = function(mainOptions) {
	
		var mainSettings = $.extend({
			buttonsPerLine:4,
			buttonsDistance:20,
			maximizeTo:'body'
		}, mainOptions );
	
		
		var thisImersive = this;
		var fullLeft = 0;
		var fullTop = 0;
		
		if(thisImersive.get( 0 ).nodeName.toLowerCase() == 'body'){
			if($(thisImersive).height() == 0) $(thisImersive).height($(document).height())
			if($(thisImersive).width() == 0) $(thisImersive).width($(document).width())
		}else{
			fullTop = 0 - ($(document).height() - thisImersive.height());
			fullLeft = 0 - ($(document).width() - thisImersive.width());
		}

		var imersiveContainer = $("<div>");
		var imersiveContainerButtons = $("<div>");

		imersiveContainer.css({
			"position":"absolute",
			"width":thisImersive.width(),
			"height":thisImersive.height()
		});
		
		imersiveContainerButtons.css({
			"position":"relative",
			"width":thisImersive.width(),
			"height":thisImersive.height()
		});
		
		imersiveContainer.append(imersiveContainerButtons);
		thisImersive.append(imersiveContainer);
		
		
		this.createButton = function(options){
		
			var settings = $.extend({
				gradient: "",
				title:"",
				titleSize:20,
				borderSize:1,
				borderColor:"#ccc",
				debug:false
			}, options );
			
			var imersiveButtons = $(".imersiveButton");
			var imersiveButtonsQty = imersiveButtons.length + 1;
			
			var buttonsInLine = imersiveButtonsQty >  mainSettings.buttonsPerLine ? mainSettings.buttonsPerLine : imersiveButtonsQty ;
			var buttonsInColumn = Math.ceil(imersiveButtonsQty / buttonsInLine);
			var buttonPadding = mainSettings.buttonsDistance/2;
			var buttonWidth = (parseInt(imersiveContainerButtons.width()) / buttonsInLine);
			var buttonHeight = (parseInt(imersiveContainerButtons.height()) / buttonsInColumn);
			
			//Container - Border
			var buttonContainer = $("<div>");
			buttonContainer.attr("Imersive","normal");
			buttonContainer.attr("id","imersiveButton_"+imersiveButtonsQty);
			buttonContainer.css({
				"position":"relative",
				"display":"block",
				"float":"left"
			});
			
			//Button - Gradient [BG]
			var button = $("<div>");
			button.addClass("imersiveButton");
			button.addClass(settings.gradient.toLowerCase() + "Imersive");
			button.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center",
				"border":settings.borderSize+"px solid "+settings.borderColor,
				"cursor":"pointer"
			});
			
			//Content
			var content = $("<div>");
			content.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center"
			});
			
			//Title - Minimized
			var title = $("<p class='imersiveTitle' style='font-size:"+settings.titleSize+"px; color:#fff;'>"+settings.title+"</p>");
			
			//Appends
			content.append(title);
			button.append(content);
			buttonContainer.append(button);
			imersiveContainerButtons.append(buttonContainer);
					
			//Resize
			$(".imersiveButton").each(function(i){
				//V align Title
				var title = $(this).find(".imersiveTitle").first();
				title.css({
					"padding-top": ((buttonHeight.toFixed(2) - (buttonPadding*2)  - (settings.borderSize*2)) - title.height()) / 2
				});
				
				//Resize Container
				$(this).parent().css({
					"width":buttonWidth.toFixed(2),
					"height":buttonHeight.toFixed(2)
				});
				
				//Resize Button
				$(this).css({
					"width":buttonWidth.toFixed(2) - (buttonPadding*2)  - (settings.borderSize*2), //4 = 2 vezes borda
					"height":buttonHeight.toFixed(2) - (buttonPadding*2)  - (settings.borderSize*2),
					"margin":buttonPadding
				});
				
			});
			


		};
 
		return this;
    };
 
}( jQuery ));