/**
 * @author Yi Liu
 */
var content_w = 10000;
var offset_v = 200;
var $content;
var $content_top;
var loop = true;
var paused = false;

$(document).ready(function(){
	$log = $("#log");
	$content = $(".content");
		
	$content_top = $(".content_top");
	//console.log("$content "+$content);
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
		$("#elem_"+i).css({"top" : 150+Math.random()*300, "left": 150+Math.random()*7000, "width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
		
	}
	//console.log("transEnd "+transEnd)
	//$content.bind( 'webkitTransitionEnd', transEnd, false );
	
	$("body").css("opacity", "1");	
}

window.onload = init;


function tilt(alpha, beta, gamma){
	if(!paused && alpha!=null){
		if(loop){
			var left =Math.round((360-alpha)/360*-content_w);
			
			if(alpha>=359.9 || alpha<=.9){
				$content.removeClass("content").addClass("content_no_easing");
				$content_top.removeClass("content_top").addClass("content_no_easing");
				setTimeout("resetTrans()", 1500);
				if(alpha>=359.9){
					$log.html("left end !!! "+left);
					left = -content_w;
				}else{
					$log.html("right end!!! "+left);
					left = 0;
				}
				$content.css({"left": left, "top": top});
				$content_top.css({"left": left, "top": top});
			}
		}else if(alpha<=358 && alpha>=2){
			left=Math.round((360-alpha)/360*-content_w);
			$log.html("alpha : "+alpha + "<br> beta : "+beta + "<br> gamma : "+gamma + "<p>left  : "+left +"<br>top : "+top);
		}

		if(gamma<0){
			top =  Math.round((gamma + 90)/90*-offset_v);
		}else{
			top =  Math.round((90 - gamma)/90*-offset_v);
		}

		$content.css({"left": left, "top": top});
		$content_top.css({"left": left, "top": top});
		
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
