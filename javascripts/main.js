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
var log_details = false;

var gesturePan = true; //default gesture Pan
var inited = false;

$("#index_page").live('pageinit', function() {
	$body = $("body");
	$log = $("#log");
    $logCopy = $("#log_copy");
	$content = $(".content");
	$vid = $("#vid");
	$startArrow = $("#start_arrow")
		
	$content_top = $(".content_top");
	
	$gyro = $("#gyro");
	
	$gesture_flip = $("#gesture_flip");
	
	$logCopy.parent().click(
		function(){
			log_details=!log_details;
			if(log_details) $logCopy.css("opacity", 0);
			});
	
	$startArrow.click(init);
	
	for(var i=0; i<6; i++){
		var div = "<div class='my_top_elem' id='my_elem_"+i+"'></div>"
		$content_top.append(div);
		var elem = $("#my_elem_"+i).css({"top" : 150+Math.random()*300, "left": 1000+Math.random()*7000, "width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
		
		elem.click(function(){
			$(this).css({"width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
			if(paused){
				resumeTrans();
			}else{
				pauseTrans();
			}
		})
		
		//console.log("elem = "+elem);
	}
	
	
	$vid.bind("touchend", onVideoClick);
	
	console.log($gesture_flip);
	
	$gesture_flip.change(function(){
		onGestureChange();
	})
	
	$log.bind( 'webkitTransitionEnd', onLogTransEnd);
	
	console.log("pageinit");	
});


$('#index_page').live('pageshow', function() {
    console.log('show index_page');
	$("#block").delay(800).animate({"opacity" : 0}, 600, function(){
		$("#block").remove();
	});	
});


function onGestureChange(){
	gesturePan = !gesturePan;
	//console.log("gesturePan = "+gesturePan);
	if(!gesturePan){
		$startArrow.remove();
		$log.css("opacity", 0);
		$vid.unbind("touchend", onVideoClick).bind("click", onVideoClick);
		$body.css({"overflow": true, "position" : "absolute"});
		
		if(inited){
			$content.css("-webkit-transform", "translate3d(0px,0px,0)");
			$content_top.css("-webkit-transform", "translate3d(0px,0px,0)");
		}
	}else{
		$body.css({"overflow": false, "position" : "fixed"});
		$log.css("opacity", 1);
		$vid.unbind("click", onVideoClick).bind("touchend", onVideoClick);
		registerDeviceMotion();
	}
}

function onLogTransEnd( event ){
	if(log_details){
		$logCopy.css("opacity", 1);
		$gyro.css("opacity", 1);
	}else{
		
	}
}

/*
$(document).ready(function(){
	$logCopy = $("#log");
	$content = $(".content");
	$vid = $("#vid");
	$startArrow = $("#start_arrow")
		
	$content_top = $(".content_top");
	
	$logCopy.click(function(){monitor=!monitor; if(!monitor){this.html("")}});
	
	$startArrow.click(init);
});

$(document).load(function(){
	
	for(var i=0; i<6; i++){
		var div = "<div class='my_top_elem' id='my_elem_"+i+"'></div>"
		$content_top.append(div);
		var elem = $("#my_elem_"+i).css({"top" : 150+Math.random()*300, "left": 1000+Math.random()*7000, "width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
		
		elem.click(function(){
			$(this).css({"width" : 60+Math.random()*600, "height" : 25+Math.random()*100, "background-color" : "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+", .8)"});
			if(paused){
				resumeTrans();
			}else{
				pauseTrans();
			}
		})
		
		console.log("elem = "+elem);
	}
	
	
	$vid.bind("touchend", onVideoClick);
	$vid.bind("click", onVideoClick);
	
	$("body").css("opacity", "1");	
});
*/
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
	//$logCopy.html("reset trans");
	if($content.hasClass("content_no_easing")){
		$content.removeClass("content_no_easing").addClass("content");
		$content_top.removeClass("content_no_easing").addClass("content_top");
	}
}

function pauseTrans(){
	paused = true;
}

function resumeTrans(){
	paused = false;
}

function init(){
	console.log("init");
	
	$startArrow.remove();
	
	
	$log.css("opacity", 1);
	
	registerDeviceMotion();
	
	inited = true;
}

var curr_left;

function registerDeviceMotion(){
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

function tilt(alpha, beta, gamma){
	if(!gesturePan) return;
	
	$("#a_x").css("-webkit-transform", "rotateY("+(alpha+80)+"deg)");
	// $("#a_x").css("-webkit-transform", "rotateZ("+gamma+"deg)");
	//$("#a_x").css("-webkit-transform", "rotateX("+beta+"deg)");
	
	// $("#a_y").css("-webkit-transform", "rotateZ("+gamma+"deg)");
	// $("#a_y").css("-webkit-transform", "rotateY("+alpha+"deg)");
	$("#a_y").css("-webkit-transform", "rotateX("+beta+"deg)");
	
	$("#a_z").css("-webkit-transform", "rotateX("+(gamma+10)+"deg)");
	//$("#a_z").css("-webkit-transform", "rotateY("+alpha+"deg)");
	// $("#a_z").css("-webkit-transform", "rotateX("+beta+"deg)");
	
	if(!paused && alpha!=null){
		
		if(gamma<0){
			top =  Math.round((gamma + 90)/90*-offset_v);
		}else{
			top =  Math.round((90 - gamma)/90*-offset_v);
		}
		
		if(loop){
			//var left =(360-alpha)/360*-content_w;
			
			if(alpha>=345 || alpha<=15){
				$content.removeClass("content").addClass("content_no_easing");
				$content_top.removeClass("content_top").addClass("content_no_easing");
// 				
				// $content.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				// $content_top.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				
				// if(alpha<=0.001){
					// var left = -content_w;
					// //$logCopy.html("left end !!! "+left);
				// }else if(alpha>=395.999) {
					// left = 0;
					// //$logCopy.html("right end!!! "+left);
				// }
				
				// $content.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				// $content_top.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
				//setTimeout("resetTrans()", 2000);
			}else{
				resetTrans()
				//left =Math.round((360-alpha)/360*-content_w);
			}
			left =Math.round((360-alpha)/360*-content_w);
		}else if(alpha<=360 && alpha>=0){
			//TODO
		}
		
		$content.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
		$content_top.css("-webkit-transform", "translate3d("+left+"px,"+top+"px,0)");
		
		//Get transform matrix;
		var matrix = $content_top.css("-webkit-transform").substr(19);
		matrix = matrix.substr(0, matrix.length-1);
		var a = matrix.split(",");
		
	
		if(log_details){
			$logCopy.html("<font color='#FF0000'>ALPHA</font> : "+alpha + "<br><font color='#00FF00'>BETA</font> : "+beta + "<br><font color='#0000CC'>GAMMA</font> : "+gamma + "<p>X  : "+left +"<br>Y : "+top);
			$("#log").css({"width":402, "height":135});
		}else{
			$logCopy.html("X  : "+left +"<br>Y : "+top);
			$("#log").css({"width":100, "height":55});
			$gyro.css("opacity", 0);
		}
	}
}

