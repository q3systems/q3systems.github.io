(function ( $ ) {
 
    $.fn.imersive = function(mainOptions) {
		var mainSettings = $.extend({
			buttonsPerLine:3,
			buttonsDistance:5,
			animationDuration:350
		}, mainOptions );
	
		var alreadyMaximizedButton = false;
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
		
		var imersiveContainer = $("<div>");
		var imersiveContainerButtons = $("<div>");
		var imersiveContainerStatusBar  = $("<div>");
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
		
		imersiveContainerStatusBar.css({
			"position":"relative",
			"width":thisImersive.width() - (mainSettings.buttonsDistance*2)
		});
		
		imersiveContainer.append(imersiveContainerStatusBar);
		imersiveContainer.append(imersiveContainerButtons);
		thisImersive.append(imersiveContainer);
		
		//STATUS BAR
		this.createStatusBar = function(options){
			if($(".imersiveStatusBar").length == 0){
				var settings = $.extend({
					height:40,
					bgColor: "gray",
					titleSize: 20,
					title:""
				}, options );
				
				
				imersiveContainerStatusBar.height(settings.height +  (mainSettings.buttonsDistance));
				imersiveContainerButtons.height(imersiveContainerButtons.height() - settings.height - (mainSettings.buttonsDistance));
				buttonsResize();
				
				var containerStatusBar = $("<div>");
				containerStatusBar.addClass("imersiveStatusBar");
				containerStatusBar.css({
					"border":"0px solid #000",
					"position":"absolute",
					"display":"block",
					"width":imersiveContainerStatusBar.width(),
					"height":settings.height,
					"top":mainSettings.buttonsDistance,
					"left":mainSettings.buttonsDistance
				});
				
				//Button - Gradient
				var statusBar = $("<div>");
				statusBar.addClass(settings.bgColor.toLowerCase());
				statusBar.css({
					"width":"100%",
					"height":"100%"
				});
				
				//Content
				var content = $("<div>");
				content.css({
					"width":"100%",
					"height":"100%"
				});
				
				//Title
				var title = $("<p class='imersiveStatusBarInfo' style='text-align:center; font-size:"+settings.titleSize+"px; color:#000;'>"+settings.title+"</p>");
				
				//Appends
				content.append(title);
				statusBar.append(content);
				containerStatusBar.append(statusBar);
				imersiveContainerStatusBar.append(containerStatusBar);
				
				resizeStatusBar();
				
				$(".imersiveStatusBarInfo").first().css({
					"padding-top": (imersiveContainerStatusBar.height() - $(this).css("height"))/2,
				});
			}
		}
		
		var resizeStatusBar = function(){
			var title = $(".imersiveStatusBarInfo").first();
			var statusBar = $(".imersiveStatusBar").first();
			
			title.css({
				"padding-top": (statusBar.height() - mainSettings.buttonsDistance - title.height())/2,
			});
		}
		
		//NEW BUTTON
		this.createButton = function(options){
			var settings = $.extend({
				gradient: "",
				title:"",
				titleSize:20,
				changeStatusBar:"title",
				changeStatusBarColor:true,
				closeWidth:30
			}, options );
			
			
			var imersiveButtons = $(".imersiveButton");
			var imersiveButtonID = imersiveButtons.length + 1;
			
			//container - Border
			var containerButton = $("<div>");
			containerButton.addClass("imersiveButton");
			containerButton.css({
				"border":"0px solid #000",
				"position":"absolute",
				"display":"block"
			});
			containerButton.attr("Imersive","normal");
			containerButton.attr("id","imersiveButton_"+imersiveButtonID);

			//Button - Gradient
			var button = $("<div>");
			button.addClass(settings.gradient.toLowerCase() + "Imersive");
			button.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center",
				"cursor":"pointer"
			});
			
			//Content
			var content = $("<div>");
			content.css({
				"width":"100%",
				"height":"100%",
				"text-align":"center"
			});
			
			//Title -- Button format
			var title = $("<p class='imersiveButtonTitle' style='font-size:"+settings.titleSize+"px; color:#fff;'>"+settings.title+"</p>");

			//Action
			button.click(function(){
				if(!alreadyMaximizedButton){
					alreadyMaximizedButton = true;
					var thisButton = $(this);
					if($(thisButton).attr("state") != "maximized"){
						$(".imersiveButton").css("z-index","1");
						thisButton.parent().css({
							"z-index":"5"
						});
						title.css("padding-top","5px");
						thisButton.css("cursor","default");

						thisButton.parent().animate({
							width:$(document).width(),
							height:$(document).height(),
							left: (fullLeft) + "px",
							top: (fullTop-imersiveContainerStatusBar.height()) + "px"
						},{
							duration: mainSettings.animationDuration,
							queue: false,
							complete: function(){
								if(settings.changeStatusBar !== false && $(".imersiveStatusBar").length > 0){
									var statusInfo = $(".imersiveStatusBarInfo").first();
									statusInfo.empty();
									if(settings.changeStatusBar == "title"){
										statusInfo.append(settings.title);
									}
									if(settings.changeStatusBarColor){
										statusInfo.parent().parent().removeAttr("class");
										statusInfo.parent().parent().addClass(settings.gradient.toLowerCase() + "Imersive");
									}
									resizeStatusBar();
									
									//ADD CLOSE LATERAL BAR
									var close = $("<div>").hide();
									close.css({
										"height":$(document).height(),
										"width":settings.closeWidth,
										"left":"0px",
										"top":"0px",
										"background":"red",
										"position":"absolute",
										"cursor":"pointer"
									});
									
									close.click(function(e){
										var thisClose = $(this);
										thisClose.fadeOut();
										thisButton.parent().animate({
											width:thisButton.parent().attr("origWidth"),
											height:thisButton.parent().attr("origHeight"),
											left: thisButton.parent().attr("origLeft"),
											top: thisButton.parent().attr("origTop")
										},{
											duration: mainSettings.animationDuration,
											queue: false,
											complete:function(){
												$(".imersiveButton").css("z-index","1");
												$(thisButton).attr("state","button");
												$(thisButton).css("cursor","pointer");
												title.css("padding-top",thisButton.parent().attr("titlePaddingTop") + "px");
												alreadyMaximizedButton = false;
												thisClose.remove();
											}
										});
										
										
										e.stopPropagation();
									});
									
									thisButton.prepend(close);
									close.fadeIn('fast');
									
								}
							}
						});
						
						$(thisButton).attr("state","maximized");
					}
				}
			});
			
			
			//Appends
			content.append(title);
			button.append(content);
			containerButton.append(button);
			$(imersiveContainerButtons).append(containerButton);
			
		
			buttonsResize();
			
			
		};
		
		//RESIZE ALL BUTTONS
		var buttonsResize = function(){
			var leftCtrl = 0;
			var topCtrl = 0;
			
			var imersiveButtons = $(".imersiveButton");
			var imersiveButtonsQty = imersiveButtons.length;
			
			var buttonsInLine = imersiveButtonsQty >  mainSettings.buttonsPerLine ? mainSettings.buttonsPerLine : imersiveButtonsQty ;
			var buttonsInColumn = Math.ceil(imersiveButtonsQty / buttonsInLine);
			var buttonPadding = mainSettings.buttonsDistance;
			
			var buttonWidth = (parseInt(imersiveContainerButtons.width()) / buttonsInLine) - buttonPadding - (buttonPadding/buttonsInLine);
			var buttonHeight = (parseInt(imersiveContainerButtons.height()) / buttonsInColumn) - buttonPadding - (buttonPadding/buttonsInColumn);

			$(".imersiveButton").each(function(i){
				var lineBreak = i % mainSettings.buttonsPerLine == 0 ? true : false;
				var title = $(this).find(".imersiveButtonTitle").first();
				
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
					"padding-top": (buttonHeight - title.height())/2
				});
				
				$(this).attr({
					"origWidth":buttonWidth,
					"origHeight":buttonHeight,
					"origLeft":(leftCtrl * buttonWidth) + (buttonPadding*(leftCtrl+1)),
					"origTop":(topCtrl * buttonHeight) + (buttonPadding*(topCtrl+1)),
					"titlePaddingTop":(buttonHeight - title.height())/2
				});
				
			});
		}
 
		return this;
    };
 
}( jQuery ));