var main_nav_scroll={
	$div: null,
	screen:[],
	init: function(id, height){
		this.div=$('#'+id);
				
		var height=0;
		var width=this.div.width();		
		var left=0;
		//calculate max height:
		$('.screen', this.div).each(function(){
			
		});
		$('.screen', this.div).each(function(){	
			height=Math.max(this.scrollHeight, height);			
			main_nav_scroll.screen[this.id]=$(this).css({
				width:width,
				display:'none'
			});
		});
		$('.frame', this.div).css({height: height});
		$('.screen', this.div).css({height:height});	
	},
	selectedID:null,
	display:function(scroll, selectedID, height){
		this.init(scroll, height);
		this.screen[selectedID].show().css({left:0});
		this.selectedID=selectedID;
	},
	show: function(id){
		//ge elements:
		$showMe=this.screen[id];		
		$hideMe=this.screen[this.selectedID];
		//get direction:
		var dir=this.getDirectionTo(id);
		if (!dir) return;
		var width=$showMe.width();
		var $between;
		var between_width=0;
		if (dir.distance>1){
			$between=$('.between', this.div)
			.css({height:this.div.height(), display:'block'})
			.addClass(dir.betweenClass);					
			between_width=$between.width();
			width+=between_width;
		}
		$showMe.css({
			left:dir.direction*width, display:'block'
		});		
		//lock:
		animate(function(part){					
			var left=Math.ceil(-1*dir.direction*part*width);			
			$hideMe.css({
				left:left
			});
			$showMe.css({
				left:dir.direction*width+left
			});
			if ($between){
				
				$between.css({
					left:Math.max(0, dir.direction)*width+left-between_width
				});								
			}
			if (part==1){//done
				$hideMe.hide();
				main_nav_scroll.selectedID=id;
			}
			//if (part>0.5) return true;
		},800);
		
	},
	getDirectionTo: function(id){
		if (id==this.selectedID) return null;
		var i=0;
		var betweenClass='';
		for (key in this.screen){
			if (key==id){
				showIndex=i++;				
			}
			else if (key==this.selectedID){
				hideIndex=i++;
			}
			else {
				i++;
				continue;
			}
			//вычисляем класс связки:
			if (betweenClass) betweenClass+='_';
			betweenClass+=key;
		}		
		var ret=[]
			ret.betweenClass=betweenClass;
			ret.hideIndex=hideIndex;
			ret.showIndex=hideIndex;
			ret.delta=hideIndex-showIndex;		
			ret.distance=Math.abs(ret.delta);
			ret.direction=ret.delta/ret.distance;
		return ret;
	}
}

function animate(callback, time){
	var step=0;
	var sleep=80;
	var steps=Math.ceil(time/sleep);	
	var f= function(){
		var part=step/steps;
		if (callback(part)||part==1){
			clearInterval(interval);
		}
		step+=1;
	}
	if (!f()){
		var interval=setInterval(f, sleep);
	}
}

$(document).ready(function(){
	main_nav_scroll.display('main_scroll','public',200);
	$('#main_scroll .buttons a').click(function(){
		main_nav_scroll.show(this.hash.substr(2));
	});
});