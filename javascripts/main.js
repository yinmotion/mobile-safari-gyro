/**
 * @author Yi Liu
 */
var content_w = 10000;
var offset_v = 200;
var $content;
var $content_top;
var loop = true;
var paused = false;
var vid;
var monitor = false;

$(document).ready(function(){
	$log = $("#log");
	$content = $(".content");
	$vid = $("#vid");
		
	$content_top = $(".content_top");
	
	$log.click(function(){monitor=!monitor; if(!monitor){this.html("")}});
});

function transEnd(){
	console.log("transEnd ")
	if($content.css("left")>=-1 ){
		$content.css("left", -content_w+2);
	}
	if($content.css("left")<=-content_w+1){
		$content.css("left", -2);
	}
	$content.removeClass("content").addClass("content_no_easing");
	setTimeout("resetTrans()", 1500);
	
};

function onVideoClick(){
	if($(this).css("opacity")==0){
		$(this).css("opacity", 1);
	}
	
	if(this.paused){
		this.play();
	}else{
		this.pause();
	}
}

function init(){
	
	if (window.DeviceOrientationEvent) {
	    window.addEventListener("deviceorientation", function () {
	    	
	        tilt(event.alpha, event.beta, event.gamma);
	    }, true);
	} else if (window.DeviceMotionEvent) {
	    window.addEventListener('devicemotion', function () {
	        tilt(event.acceleration.x * 2, event.acceleration.y * 2);
	    }, true);
	} else {
	    window.addEventListener("MozOrientation", function () {
	        tilt(orientation.x * 50, orientation.y * 50);
	    }, true);
	}
	
	for(var i=0; i<6; i++){
		var div = "<div class='top_elem' id='elem_"+i+"'></div>"
		$content_top.append(div);
		var elem = $("#elem_"+i).css({"top" : 150+Math.random()*300, "left": 150+Math.random()*7000, "width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
		
		elem.click(function(){
			$(this).css({"width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
			if(paused){
				resumeTrans();
			}else{
				pauseTrans();
			}
		})
	}
	
	$("body").css("opacity", "1");	
	
	$vid.bind("touchend", onVideoClick);
	$vid.bind("click", onVideoClick);
	
}

window.onload = init;


function tilt(alpha, beta, gamma){
	if(!paused && alpha!=null){
		if(loop){
			var left =Math.round((360-alpha)/360*-content_w);
			
			//$log.html("log "+(alpha>=359));
			if(alpha>=359.9 || alpha<=0.9){
				$content.removeClass("content").addClass("content_no_easing");
				$content_top.removeClass("content_top").addClass("content_no_easing");
				
				$content.css({"left": $content.css("left"), "top": $content.css("top")});
				$content_top.css({"left": $content_top.css("left"), "top": $content_top.css("top")});
				
				if(alpha>=359.9){
					$log.html("left end !!! "+left);
					left = -content_w;
				}else{
					$log.html("right end!!! "+left);
					left = 0;
				}
				
				$content.css({"left": left, "top": top});
				$content_top.css({"left": left, "top": top});
				
				//resetTrans();
				setTimeout("resetTrans()", 500);
			}
		}else if(alpha<=358 && alpha>=2){
			left=Math.round((360-alpha)/360*-content_w);
		}

		if(gamma<0){
			top =  Math.round((gamma + 90)/90*-offset_v);
		}else{
			top =  Math.round((90 - gamma)/90*-offset_v);
		}

		$content.css({"left": left, "top": top});
		$content_top.css({"left": left, "top": top});
		
		if(monitor){
			$log.html("alpha : "+alpha + "<br> beta : "+beta + "<br> gamma : "+gamma + "<p>left  : "+left +"<br>top : "+top);
		}
	}
}

function resetTrans(){
	$log.html("reset trans");
	$content.removeClass("content_no_easing").addClass("content");
	$content_top.removeClass("content_no_easing").addClass("content_top");
}

function pauseTrans(){
	paused = true;
}

function resumeTrans(){
	paused = false;
}
