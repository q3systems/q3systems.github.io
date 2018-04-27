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
				debug:false,
				alignLeft: mainSettings.buttonsPerLine == 1 ? buttonPadding + buttonPadding/2 : buttonsInLine + 1.8 + (buttonsInLine*0.8),
				alignTop: mainSettings.buttonsPerLine == 1 ? 1.8 : 8-buttonsInColumn
			}, options );
			
			
			//var widthCalcAux = mainSettings.buttonsPerLine == 1 ? buttonPadding + buttonPadding/2 : buttonsInLine + 1.8 + (buttonsInLine*0.8);
			//var heightCalcAux = mainSettings.buttonsPerLine == 1 ? 1.8 : 8-buttonsInColumn;
			
			var widthCalcAux = settings.alignLeft;
			var heightCalcAux = settings.alignTop;
			
			var buttonWidth = (parseInt(thisImersive.width()) / buttonsInLine) - buttonPadding - widthCalcAux;
			var buttonHeight = (parseInt(thisImersive.height()) / buttonsInColumn) - buttonPadding - heightCalcAux;


			
			if(settings.debug){

			}
			
			//container - Border
			var container = $("<div>");
			container.addClass("imersiveButton");
			container.css({
				"border":"2px solid #000",
				"position":"absolute",
				"display":"block"
			});
			container.attr("Imersive","normal");
			container.attr("id","imersiveButton_"+imersiveButtonsQty);

			//Gradient
			var gradientDiv = $("<div>");
			gradientDiv.addClass(settings.gradient.toLowerCase() + "Imersive");
			gradientDiv.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center"
			});
			
			//Content
			var contentDiv = $("<div>");
			contentDiv.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center",
				"cursor":"pointer"
			});
			
			var title = $("<p class='imersiveTitle' style='font-size:"+settings.titleSize+"px; color:#fff;'>"+settings.title+"</p>");

			
			//Action
			gradientDiv.click(function(){
				imersiveButtons.css("z-index","1");
				$(this).parent().css({
					"z-index":"5",
					"margin-top":"1px",
					"margin-left":"1px"
				});

				$(this).parent().animate({
					width:$(document).width()-6,
					height:$(document).height()-6,
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
			contentDiv.append(title);
			gradientDiv.append(contentDiv);
			container.append(gradientDiv);
			$(thisImersive).append(container);
			
		
			var sumLeft = 0;
			var sumTop = 0;
			
			//Resize
			$(".imersiveButton").each(function(i){	
				var modVal = i % mainSettings.buttonsPerLine;
				var title = $(this).find(".imersiveTitle").first();
				
				sumLeft = sumLeft + buttonWidth + buttonPadding;
				

				if(modVal == 0){
					sumLeft = buttonPadding;  //First column + 4 border
					if(i>0){
						sumTop  = sumTop + buttonHeight + buttonPadding;
					}else{
						sumTop = buttonPadding; //First line + 4 border
					}
				}
				
				
				title.css({
					"padding-top": (buttonHeight - title.height()) / 2
				});
				
				$(this).css({
					width:buttonWidth,
					height:buttonHeight,
					left: sumLeft,
					top: sumTop
				});
				
				$(this).attr({
					"OrigWidth": buttonWidth,
					"OrigHeight" : buttonHeight,
					"OrigLeft": sumLeft,
					"OrigTop": sumTop,
					"OrigTitlePaddingTop": (buttonHeight - title.height()) / 2
				});
				
			});
		};
 
		return this;
    };
 
}( jQuery ));