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
		var startMaximizedButton = null;
		
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
		var imersiveOverlay = $("<div>");
		
		imersiveOverlay.css({
			"position":"absolute",
			"width": thisImersive.width(),
			"height": thisImersive.height(),
			"top": 0,
			"left": 0,
			"z-index":10,
			"background":"#eee",
			"text-align":"center"
		});
		
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
		
		//Appends
		imersiveOverlay.append("<span class='helperAlign'></span><img src='images/loading.gif' style='vertical-align: middle; height:"+ (thisImersive.height()-30) + "px' />");
		imersiveContainer.append(imersiveContainerStatusBar);
		imersiveContainer.append(imersiveContainerButtons);
		thisImersive.append(imersiveOverlay);
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
		
		


		
		//NEW BUTTON
		this.createButton = function(options){
			var settings = $.extend({
				gradient: "",
				title:"",
				titleSize:20,
				changeStatusBar:true,
				changeStatusBarColor:true,
				closeWidth:100,
				maximizedTitleTopPadding:20,
				onMaximize:function(freeArea, button){},
				last:false,
				startMaximized:false
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
			
			
			//BIND CLOSE
			button.bind('close', function(){
				$("#imersiveCancel").fadeOut();
				$("#imersiveMaximized").fadeOut();

				
				button.parent().animate({
					width:button.parent().attr("origWidth"),
					height:button.parent().attr("origHeight"),
					left: button.parent().attr("origLeft"),
					top: button.parent().attr("origTop")
				},{
					duration: mainSettings.animationDuration,
					queue: false,
					complete:function(){
						$(".imersiveButton").css("z-index","1");
						$(button).attr("state","button");
						$(button).css("cursor","pointer");
						title.css("padding-top",button.parent().attr("titlePaddingTop") + "px");
						alreadyMaximizedButton = false;
						$("#imersiveCancel").remove();
						$("#imersiveMaximized").remove();
					}
				});
			});
			
			//BIND CANCEL
			button.bind('cancel', function(){
				var statusInfo = $(".imersiveStatusBarInfo").first();
				button.trigger('changeStatusBar',[statusInfo.attr("oldInfo") , statusInfo.parent().parent().attr("oldClass")]);
			});
			
			//BIND STATUSBAR TEXT CHANGE
			button.bind('changeStatusBar',function(event, text, clazz){
				var statusInfo = $(".imersiveStatusBarInfo").first();
				
				if(clazz != null){
					statusInfo.parent().parent().attr("oldClass",statusInfo.parent().parent().attr("class"));
					statusInfo.parent().parent().removeAttr("class");
					statusInfo.parent().parent().addClass(clazz);
				}
				if(text != null){
					statusInfo.attr("oldInfo",statusInfo.html());
					statusInfo.empty();
					statusInfo.append(text);
				}
				resizeStatusBar();
			});
			
			//Action
			button.click(function(){
				if(!alreadyMaximizedButton){
					alreadyMaximizedButton = true;
					var thisButton = $(this);
					var maxContent = $("<div>").hide();
					
					if($(thisButton).attr("state") != "maximized"){
						$(".imersiveButton").css("z-index","1");
						thisButton.parent().css({
							"z-index":"5"
						});
						title.css("padding-top",settings.maximizedTitleTopPadding + "px");
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
								var statusInfo = $(".imersiveStatusBarInfo").first();
								if(settings.changeStatusBar){
									thisButton.trigger('changeStatusBar',[settings.title , settings.gradient.toLowerCase() + "Imersive"]);
								}
								
								
								
								//ADD CONTENT MAXIMIZED
								maxContent.attr("id","imersiveMaximized");
								maxContent.css({
									"height":$(document).height() - title.height() - settings.maximizedTitleTopPadding * 2,
									"width":$(document).width() - settings.closeWidth,
									"left":settings.closeWidth + "px",
									"top":(title.height() + settings.maximizedTitleTopPadding * 2) + "px",
									"position":"absolute",
									"cursor":"default",
									"float":"left"
								});
								thisButton.prepend(maxContent);
								maxContent.fadeIn('fast');
								//END ADD CONTENT MAXIMIZED
									
								//ADD CANCEL LATERAL BAR
								var cancel = $("<div>").hide();
								cancel.attr("id","imersiveCancel");
								cancel.css({
									"height":$(document).height(),
									"width":settings.closeWidth,
									"left":"0px",
									"top":"0px",
									"background":"red",
									"position":"absolute",
									"cursor":"pointer",
									"float":"left"
								});
								
								cancel.click(function(e){
									thisButton.trigger('cancel');
									thisButton.trigger('close');
									e.stopPropagation();
								});
								
								thisButton.prepend(cancel);
								cancel.fadeIn('fast');
								//END ADD CANCEL LATERAL BAR
								
							}
						});
						
						$(thisButton).attr("state","maximized");
						settings.onMaximize(maxContent, thisButton);
					}
				}
				
			});
			
			
			//Appends
			content.append(title);
			button.append(content);
			containerButton.append(button);
			$(imersiveContainerButtons).append(containerButton);
			
			
			//Last statements
			if(settings.startMaximized){
				startMaximizedButton = button;
			}
		
			buttonsResize();
			if(settings.last){
				setTimeout(function(){
					if(startMaximizedButton != null){
						startMaximizedButton.click();
					}
					imersiveOverlay.fadeOut('slow',function(){
						$(this).remove();
					})
				},1000);
			}
		};
		
		
		
		
		
		//RESIZE STATUS BAR
		var resizeStatusBar = function(){
			var title = $(".imersiveStatusBarInfo").first();
			var statusBar = $(".imersiveStatusBar").first();
			
			title.css({
				"padding-top": (statusBar.height() - mainSettings.buttonsDistance - title.height())/2,
			});
		}
		
		
		
		
		
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