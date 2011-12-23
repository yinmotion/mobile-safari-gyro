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
	$startArrow = $("#start_arrow")
		
	$content_top = $(".content_top");
	
	$log.click(function(){monitor=!monitor; if(!monitor){this.html("")}});
	
	$startArrow.click(init);
});

// function transEnd(){
	// console.log("transEnd ")
	// if($content.css("left")>=-1 ){
		// $content.css("left", -content_w+2);
	// }
	// if($content.css("left")<=-content_w+1){
		// $content.css("left", -2);
	// }
	// $content.removeClass("content").addClass("content_no_easing");
	// setTimeout("resetTrans()", 1500);
// 	
// };

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

function resetTrans(){
	//$log.html("reset trans");
	$content.removeClass("content_no_easing").addClass("content");
	$content_top.removeClass("content_no_easing").addClass("content_top");
}

function pauseTrans(){
	paused = true;
}

function resumeTrans(){
	paused = false;
}

function init(){
	//console.log("init");
	
	$startArrow.remove();
	
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
	
	
}

window.onload = function(){
	for(var i=0; i<6; i++){
		var div = "<div class='top_elem' id='elem_"+i+"'></div>"
		$content_top.append(div);
		var elem = $("#elem_"+i).css({"top" : 150+Math.random()*300, "left": 1000+Math.random()*7000, "width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
		
		elem.click(function(){
			$(this).css({"width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
			if(paused){
				resumeTrans();
			}else{
				pauseTrans();
			}
		})
	}
	
	
	$vid.bind("touchend", onVideoClick);
	$vid.bind("click", onVideoClick);
	
	$("body").css("opacity", "1");	
};

var curr_left;

function tilt(alpha, beta, gamma){

	
	$("#a_x").css("-webkit-transform", "rotateY("+alpha+"deg)");
	$("#a_y").css("-webkit-transform", "rotateX("+beta+"deg)");
	$("#a_z").css("-webkit-transform", "rotateZ("+gamma+"deg)");
	
	if(!paused && alpha!=null){
		
		if(gamma<0){
			top =  Math.round((gamma + 90)/90*-offset_v);
		}else{
			top =  Math.round((90 - gamma)/90*-offset_v);
		}
		
		if(loop){
			//var left =(360-alpha)/360*-content_w;
			
			if(alpha>=359.5 || alpha<=0.5){
				$content.removeClass("content").addClass("content_no_easing");
				$content_top.removeClass("content_top").addClass("content_no_easing");
// 				
				// $content.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				// $content_top.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				
				if(alpha<=0.001){
					var left = -content_w;
					//$log.html("left end !!! "+left);
				}else if(alpha>=395.999) {
					left = 0;
					//$log.html("right end!!! "+left);
				}
				
				$content.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				$content_top.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				setTimeout("resetTrans()", 2000);
			}else{
				//left =Math.round((360-alpha)/360*-content_w);
			}
			left =(360-alpha)/360*-content_w;
		}else if(alpha<=360 && alpha>=0){
			//TODO
		}
		
		$content.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
		$content_top.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
		
		var matrix = $content_top.css("-webkit-transform").substr(19);
		matrix = matrix.substr(0, matrix.length-1);
		var a = matrix.split(",")
		$log.html(a[0]);
		if(monitor){
			$log.html("alpha : "+alpha + "<br> beta : "+beta + "<br> gamma : "+gamma + "<p>left  : "+left +"<br>top : "+top);
		}
	}
}

