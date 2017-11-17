"use strict";

jQuery(window).load(function($) {	
	
	/***************************
	    - Hide page loader -
	***************************/
	jQuery("#page-loader .page-loader-inner").delay(1000).fadeOut(500, function() {
		jQuery("#page-loader").fadeOut(500);
	});
	
	/*****************************
	    - Horizontal section -
	*****************************/
	function horizontalAdapt() {
		if(jQuery('.horizontalsection').length) { 
			var leftpos = jQuery('.horizontalsection').position().left+1;
			var fullwidth = jQuery(window).width()+2;
			
			jQuery('.horizontalsection').find('.horizontalinner').css({'left':'-'+leftpos+'px', 'width': fullwidth+'px'});
		}
	}
	
	horizontalAdapt();
	
	jQuery(window).on("resize", function() {
		horizontalAdapt(); 
	});	
	
	flexInit('body');
	
	/******************
		- Isotope -
	******************/	
	if(jQuery().isotope) {		
		//Call isotope
		jQuery('.masonry').each(function() {
			var $container = jQuery(this);
			
			$container.imagesLoaded( function() {
				$container.isotope({
					itemSelector:'.masonry-item',
					transformsEnabled:true //Important for videos
				});	
			});
		});		
		
		//Isotope: filter
		jQuery('.filter li a').on("click", function() {	
			var parentul = jQuery(this).parents('ul.filter').data('related-grid');
			jQuery(this).parents('ul.filter').find('li a').removeClass('active');
			jQuery(this).addClass('active');
			
			var selector = jQuery(this).attr('data-option-value');
			jQuery('#'+parentul).isotope({filter:selector}, function() {});
			
			return(false);
		});
		
		//Isotope: load more
		var load_more = jQuery('#load-more a'),
			origtext = load_more.text(),
			maxnumpage = jQuery('#load-more a').data('maxnumpage'),
			type = jQuery('#load-more a').data('type'),
			tax = jQuery('#load-more a').data('tax'),
			related = jQuery('#load-more a').data('related'),
			page = 1;

		load_more.on("click", function() {
			page++;
			jQuery('#load-more').find('.loader-icon').fadeIn(300);
			
			jQuery.ajax({
				type:'POST', 
				url:srvars.ajaxurl, 
				data:{ 
					action:'fb_load_more', 
					page:page, 
					type:type, 
					tax:tax 
				}, 
				success:function(response) {
					$content = jQuery(response);
					$content.hide();
									
					jQuery($content).imagesLoaded(function() {
						jQuery('.'+related).append( $content );
						jQuery('#load-more').find('.loader-icon').delay(800).fadeOut(300, function() {
							$content.show();
							reorganizeIsotope();
							
							jQuery('.'+related).isotope('appended', $content, function() {
								if(page>=maxnumpage) jQuery('#load-more').slideUp(500);
							});									  
						});
					});	
				}
			});
			
			return false;
		});
		
		//Isotope: reorganize
		function reorganizeIsotope() {
			jQuery('.masonry').each(function() {
				var $container = jQuery(this);
							
				var maxitemwidth = $container.data('maxitemwidth');
				if (!maxitemwidth) {maxitemwidth = 370;}
				
				var containerwidth = $container.width();
				var containerwidth = (containerwidth / 110) * 100;
				var itemrightmargin = parseInt($container.children('div').css('marginRight'));
				var rows = Math.ceil(containerwidth/maxitemwidth);
				var marginperrow = (rows-1)*itemrightmargin;
				var newitemmargin = marginperrow / rows;
				var itemwidth = Math.floor((containerwidth/rows)-newitemmargin+1);
				
				$container.css({'width':'110%'});
				$container.children('div').css({'width':itemwidth+'px'});
				
				if ($container.children('div').hasClass('isotope-item')) {$container.isotope('reLayout');}
			});
		}
		
		reorganizeIsotope();
			
		jQuery(window).on("resize", function() {
			reorganizeIsotope();
		});		
	} 
	
	/******************************
		- Dropdown Navigation -
	******************************/	
	var timer = [];
   	var timerout= [];
	
	jQuery("nav#main-nav li").each(function(index) {  
        if (jQuery(this).find("ul").length>0) {  
            var element = jQuery(this);
            
			//Show subnav on hover   
            jQuery(this).mouseenter(function() {
				if(timer[index]) {
                	clearTimeout(timer[index]);
                	timer[index] = null;
                }
                
				timer[index] = setTimeout(function() {
                	jQuery(element).children('ul').fadeIn(200); 
                }, 150)
            }); 
			 
            //Hide submenus on exit  
            jQuery(this).mouseleave(function() {  
				if(timer[index]) {
                	clearTimeout(timer[index]);
                	timer[index] = null;
              	}
				
              	timer[index] = setTimeout(function() {
                	jQuery(element).children('ul').fadeOut(200); 
              	}, 150) 
            });  
        }  
    });
	
	jQuery('nav#main-nav').on("click", "li", function() {
		if (jQuery(window).width()<1025) {
			if (jQuery(this).find("ul").length>0) {
				if (jQuery(this).find("ul").css('display')!=='block') {
					jQuery(this).children("ul").fadeIn(200);
					return false;	
				}
			}
		}
	});
	
	/********************************
		- Responsive Navigation -
	********************************/	
	jQuery('<a class="open-responsive-nav" href=""><span></span></a>').appendTo(".header-inner .menu");
	jQuery("body #page-content").prepend('<div id="menu-responsive" class="scrollbar"><div id="menu-responsive-inner"><a href="" class="close-responsive-nav"><span></span></a><nav id="responsive-nav"><ul></ul></nav></div></div>');
	jQuery("nav#responsive-nav > ul").html(jQuery("nav#main-nav > ul").html());
	
	jQuery('header').on("click", ".open-responsive-nav", function() { 
		var topPos = jQuery('header').height();
		var fullheight = jQuery(window).height()-topPos;
		
		jQuery("#menu-responsive").css({'height':fullheight+'px', 'top':topPos+'px'});
		
		if (jQuery('#menu-responsive').css('right')==0 || jQuery('#menu-responsive').css('right')=='0px') {
			hideResponsiveNav();
		} else {
			jQuery('#menu-responsive').animate({'right':'0'}, 800, 'easeInOutQuart');
			jQuery('html, body').animate({scrollTop:0}, 1000, 'easeInOutQuart');
		}
		
		return false;
	});
	
	jQuery('#page-content').on("click", "#menu-responsive", function() { 
		hideResponsiveNav();
	});
	
	function hideResponsiveNav() {
		var right = jQuery('#menu-responsive').width()+10;
		jQuery('#menu-responsive').animate({'right':'-'+right+'px'}, 800, 'easeInOutQuart');
	}
	
	/***************
		- Tabs -
	***************/
	jQuery(".tabs").each(function(i) {
		jQuery(this).find('.tab-content').removeClass('active');
		var rel = jQuery(this).find('.active').attr('href');
		jQuery(this).find('.'+rel).addClass('active');
	});
	
	jQuery("body").on("click", ".tab-nav a", function() {		
		var parentdiv = jQuery(this).parent('li').parent('ul').parent('div');
		var rel = jQuery(this).attr('href');
		
		jQuery(parentdiv).find(".tab-nav a").removeClass("active");
		jQuery(this).addClass("active");
		
		jQuery(parentdiv).find(".tab-container .tab-content").hide().removeClass('active');
		jQuery(parentdiv).find(".tab-container ."+rel).fadeIn(500).addClass('active');
		
		return(false);		
	});
	
	/*****************************
		- Toggle & Accordion -
	*****************************/		
	jQuery(".toggle-item").each(function(i) {
		jQuery(this).find('.toggle-active').siblings('.toggle-inner').slideDown(300);							
	});
	
	jQuery("body").on("click", ".toggle-title", function() {						
		var parentdiv = jQuery(this).parent('div').parent('div');
		var active = jQuery(this).parent('div').find('.toggle-inner').css('display');
		
		if (jQuery(parentdiv).attr('class')=='accordion') {
			if (active!=='none') { 
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				jQuery(this).toggleClass('toggle-active');
			} else {
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				jQuery(parentdiv).find('.toggle-item .toggle-title').removeClass('toggle-active');
				
				jQuery(this).toggleClass('toggle-active');
				jQuery(this).siblings('.toggle-inner').slideDown(300);
			}
		} else {
			jQuery(this).toggleClass('toggle-active');
			jQuery(this).siblings('.toggle-inner').slideToggle(300);
		}
		
		return(false);
	});
	
	/**********************
		- Back to top -
	**********************/
	jQuery('#backtotop').on("click", function() {
		jQuery('html, body').animate({scrollTop:0}, 1000, 'easeInOutQuart');
		return false;						   
	});
	
	/******************************
		- Overlay info center -
	******************************/
	jQuery('body').on("mouseenter", ".imgoverlay", function() {
		var infoHeight = parseInt(jQuery(this).find('.overlayinfo').height()/2);	
		jQuery(this).find('.overlayinfo').css({'marginTop':'-'+infoHeight+'px'});
	});
	
	/*********************
		- Fit videos -
	*********************/
	if(jQuery().fitVids) { 
		jQuery("body").fitVids();
	}
	
	/*******************
		- Parallax -
	*******************/
	if(jQuery().parallax) { 
		jQuery('.parallax-section').parallax();
	}		
	
	/*****************************
		- Responsive jPlayer -
	******************************/
	if(jQuery().jPlayer && jQuery('.jp-interface').length) {
		jQuery('.jp-interface').each(function() { 
			var playerwidth = jQuery(this).width();	
			var newwidth = playerwidth-175;
			jQuery(this).find('.jp-progress-container').css({width:newwidth+'px'});
		});
	}
	
	/*******************
		- Video BG -
	*******************/
	if(jQuery().bgVideo) { 
		setTimeout(function() {
			jQuery('.videobg-section').bgVideo();
		}, 1000);
	}
	
	/***********************
		- Owl carousel -
	***********************/
	if(jQuery().owlCarousel) { 
		jQuery(".portfolio-carousel").owlCarousel({
    		navigation:false,
			items:4,
			itemsCustom:false,
			itemsDesktop:[1199,4],
			itemsDesktopSmall:[980,3],
			itemsTablet:[768,2],
			itemsTabletSmall:false,
			itemsMobile:[479,1],
		});
		
		jQuery("#blog-carousel").owlCarousel({
    		navigation:false,
			items:3,
			itemsCustom:false,
			itemsDesktop:[1199,3],
			itemsDesktopSmall:[980,2],
			itemsTablet:[768,2],
			itemsTabletSmall:false,
			itemsMobile:[479,1],
		});
	}
	
	
	/*******************
		- Fancybox -
	*******************/
	if(jQuery().fancybox) {
		jQuery('.openfancybox').fancybox({openEffect:'fade',closeEffect:'fade'});
	}
	
	/********************
		- Scrollbar -
	********************/
	if(jQuery().perfectScrollbar) { 
		jQuery('.scrollbar').perfectScrollbar({suppressScrollX: true});
	}	
	
	smoothShow();
		
});


jQuery(window).on("scroll", function() {
	smoothShow();
});

//Smooth show function for elements that take action when visible (Counter, animations, skills)
function smoothShow() {
	/******************
		- Counter -
	******************/
	jQuery('.counter-value').each(function() {
		if (jQuery(window).width()>700) {
			var visible = jQuery(this).visible(false);
			
			if (jQuery(this).hasClass("anim")) {} 
			else if (visible) {
				jQuery(this).addClass("anim");
				
				var from = parseInt(jQuery(this).attr('data-from'));
				var to = parseInt(jQuery(this).attr('data-to'));
				var speed = parseInt(jQuery(this).attr('data-speed'));
				
				jQuery(this).count(from, to, speed);
			}
		} else {
			var to = parseInt(jQuery(this).attr('data-to'));
			jQuery(this).html(to);
		}
	});
	
	/*****************************
		- General animations -
	*****************************/
	jQuery('.fb-animation').each(function() {
		if (jQuery(window).width()>700) {
			var visible = jQuery(this).visible(true);
			var delay = jQuery(this).attr("data-delay");
			
			if (!delay) {delay = 0;}
			
			if (jQuery(this).hasClass("animated")) {} 
			else if (visible) {
				jQuery(this).delay(delay).queue(function() {
					jQuery(this).addClass('animated');
				});
			}
		} else {
			jQuery(this).addClass('animated');
		}
	});
	
	/**************************
		- Skill animation -
	**************************/
	jQuery('.skill').each(function() {
		var visible = jQuery(this).visible(true);
		var percent = jQuery(this).find('.skill-bar .skill-active ').attr('data-perc');
		
		if (jQuery(this).hasClass( "anim" )) {} 
		else if (visible) {
			var randomval = Math.floor(Math.random()*(300-50+1))+50;
			
			jQuery(this).addClass("anim");
			
			jQuery(this).find('.skill-bar .skill-active ').animate({'width':percent+'%'}, 2000, 'easeInOutQuart', function() {
				jQuery(this).find('.tooltip').delay(randomval).animate({'top':'-28px', 'opacity':1}, 500);	
			}).css('overflow', 'visible');
		}
	});	
}

//Flex slider init function because it also has to be reinitialised after a portfolio item is loaded
function flexInit(el) { 
	/**********************
		- Flex slider -
	**********************/
	if(jQuery().flexslider) { 
		jQuery(el+" .flexslider").flexslider({
			animation:"slide",
			slideshowSpeed:7000,
			animationDuration:1000,
			slideshow:false,
			directionNav:false,
			controlNav:true,
			smoothHeight:true,
			touch:true,
			video:true,
			randomize:false
		}); 
	}	
}







var htmlDiv = document.getElementById("rs-plugin-settings-inline-css"); var htmlDivCss=".tp-caption.auril-title-big-white,.auril-title-big-white{font-family:\"Open Sans\",Helvetica,Arial;font-weight:normal;font-size:100px;line-height:120px;color:#ffffff}.tp-caption.auril-title-mini-white,.auril-title-mini-white{font-family:\"Open Sans\",Helvetica,Arial;font-weight:400;font-size:18px;line-height:26px;color:#ffffff}.tp-caption.auril-text-white,.auril-text-white{color:#ffffff}";
if(htmlDiv) {
	htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
}
else{
	var htmlDiv = document.createElement("div");
	htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
	document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
}

/******************************************
-	PREPARE PLACEHOLDER FOR SLIDER	-
******************************************/

var setREVStartSize=function(){
try{var e=new Object,i=jQuery(window).width(),t=9999,r=0,n=0,l=0,f=0,s=0,h=0;
e.c = jQuery('#rev_slider_1_1');
e.gridwidth = [1100];
e.gridheight = [500];
	
e.sliderLayout = "fullscreen";
e.fullScreenAlignForce='off';
e.fullScreenOffsetContainer= '#pseudo-header';
e.fullScreenOffset='';
if(e.responsiveLevels&&(jQuery.each(e.responsiveLevels,function(e,f){f>i&&(t=r=f,l=e),i>f&&f>r&&(r=f,n=e)}),t>r&&(l=n)),f=e.gridheight[l]||e.gridheight[0]||e.gridheight,s=e.gridwidth[l]||e.gridwidth[0]||e.gridwidth,h=i/s,h=h>1?1:h,f=Math.round(h*f),"fullscreen"==e.sliderLayout){var u=(e.c.width(),jQuery(window).height());if(void 0!=e.fullScreenOffsetContainer){var c=e.fullScreenOffsetContainer.split(",");if (c) jQuery.each(c,function(e,i){u=jQuery(i).length>0?u-jQuery(i).outerHeight(!0):u}),e.fullScreenOffset.split("%").length>1&&void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0?u-=jQuery(window).height()*parseInt(e.fullScreenOffset,0)/100:void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0&&(u-=parseInt(e.fullScreenOffset,0))}f=u}else void 0!=e.minHeight&&f<e.minHeight&&(f=e.minHeight);e.c.closest(".rev_slider_wrapper").css({height:f})
}catch(d){console.log("Failure at Presize of Slider:"+d)}
};


setREVStartSize();
function revslider_showDoubleJqueryError(sliderID) {
var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>"
jQuery(sliderID).show().html(errorMessage);
}
var tpj=jQuery;
tpj.noConflict();
var revapi1;
tpj(document).ready(function() {
if(tpj("#rev_slider_1_1").revolution == undefined){
revslider_showDoubleJqueryError("#rev_slider_1_1");
}else{
revapi1 = tpj("#rev_slider_1_1").show().revolution({
sliderType:"standard",
jsFileLocation:"",
sliderLayout:"fullscreen",
dottedOverlay:"none",
delay:10000,
navigation: {
	keyboardNavigation:"off",
	keyboard_direction: "horizontal",
	mouseScrollNavigation:"off",
	onHoverStop:"off",
	touch:{
		touchenabled:"on",
		swipe_threshold: 75,
		swipe_min_touches: 50,
		swipe_direction: "horizontal",
		drag_block_vertical: false
	}
	,
	arrows: {
		style:"custom",
		enable:true,
		hide_onmobile:false,
		hide_onleave:true,
		hide_delay:200,
		hide_delay_mobile:1200,
		tmp:'',
		left: {
			h_align:"left",
			v_align:"center",
			h_offset:20,
			v_offset:0
		},
		right: {
			h_align:"right",
			v_align:"center",
			h_offset:20,
			v_offset:0
		}
	}
	,
	bullets: {
		enable:true,
		hide_onmobile:false,
		style:"custom",
		hide_onleave:true,
		hide_delay:200,
		hide_delay_mobile:1200,
		direction:"horizontal",
		h_align:"center",
		v_align:"bottom",
		h_offset:0,
		v_offset:20,
		space:10,
		tmp:''
	}
},
gridwidth:1100,
gridheight:500,
lazyType:"none",
shadow:0,
spinner:"spinner0",
stopLoop:"off",
stopAfterLoops:-1,
stopAtSlide:-1,
shuffle:"off",
autoHeight:"off",
fullScreenAlignForce:"off",
fullScreenOffsetContainer: "#pseudo-header",
fullScreenOffset: "",
disableProgressBar:"on",
hideThumbsOnMobile:"off",
hideSliderAtLimit:0,
hideCaptionAtLimit:0,
hideAllCaptionAtLilmit:0,
debugMode:false,
fallbacks: {
	simplifyAll:"off",
	nextSlideOnWindowFocus:"off",
	disableFocusListener:false,
}
});
}
});	

var htmlDivCss = unescape(".custom.tparrows%20%7B%0A%09cursor%3Apointer%3B%0A%09background%3A%23000%3B%0A%09background%3Argba%280%2C0%2C0%2C0.5%29%3B%0A%09width%3A40px%3B%0A%09height%3A40px%3B%0A%09position%3Aabsolute%3B%0A%09display%3Ablock%3B%0A%09z-index%3A100%3B%0A%7D%0A.custom.tparrows%3Ahover%20%7B%0A%09background%3A%23000%3B%0A%7D%0A.custom.tparrows%3Abefore%20%7B%0A%09font-family%3A%20%22revicons%22%3B%0A%09font-size%3A15px%3B%0A%09color%3A%23fff%3B%0A%09display%3Ablock%3B%0A%09line-height%3A%2040px%3B%0A%09text-align%3A%20center%3B%0A%7D%0A.custom.tparrows.tp-leftarrow%3Abefore%20%7B%0A%09content%3A%20%22%5Ce824%22%3B%0A%7D%0A.custom.tparrows.tp-rightarrow%3Abefore%20%7B%0A%09content%3A%20%22%5Ce825%22%3B%0A%7D%0A%0A%0A.custom.tp-bullets%20%7B%0A%7D%0A.custom.tp-bullets%3Abefore%20%7B%0A%09content%3A%22%20%22%3B%0A%09position%3Aabsolute%3B%0A%09width%3A100%25%3B%0A%09height%3A100%25%3B%0A%09background%3Atransparent%3B%0A%09padding%3A10px%3B%0A%09margin-left%3A-10px%3Bmargin-top%3A-10px%3B%0A%09box-sizing%3Acontent-box%3B%0A%7D%0A.custom%20.tp-bullet%20%7B%0A%09width%3A12px%3B%0A%09height%3A12px%3B%0A%09position%3Aabsolute%3B%0A%09background%3A%23aaa%3B%0A%20%20%20%20background%3Argba%28125%2C125%2C125%2C0.5%29%3B%0A%09cursor%3A%20pointer%3B%0A%09box-sizing%3Acontent-box%3B%0A%7D%0A.custom%20.tp-bullet%3Ahover%2C%0A.custom%20.tp-bullet.selected%20%7B%0A%09background%3Argb%28125%2C125%2C125%29%3B%0A%7D%0A.custom%20.tp-bullet-image%20%7B%0A%7D%0A.custom%20.tp-bullet-title%20%7B%0A%7D%0A%0A");
var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
if(htmlDiv) {
	htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
}
else{
	var htmlDiv = document.createElement('div');
	htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
	document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
}
