$(document).ready(function(){	
	//1. init list:
	var lock=null;
	//click on logo returns you to main page:
	var $logo=$('header h1');
	
	function onPrimaryMenuItemSelected(li){
		$logo.addClass('clickable');
		//do it once:
		if (lock) return; else lock=li;
		//fix height:
		$('#primary_menus').css({height:$('#primary_menus').height()});
		//copy images:
		var afterHide=copyImagesToFrameBuffer(li, function(){			
			$('#primary_menu').hide();
			$('#main_scroll').fadeIn();			
			main_nav_scroll.display('main_scroll',lock.className,200);
			lock=null;					
		});
		$('#primary_menu').fadeOut(afterHide);
	}
	//init menu:
	var primaryMenu=[];
	$('#primary_menu .buttons li').each(function(){
		primaryMenu[this.className]=this;
		$(this).click(function(e){
			if (e.ctrlKey||e.shiftKey) return true;
			document.location.hash='#~'+this.className;			
			onPrimaryMenuItemSelected(this);			
		});
	});
	
	
	//on logo click return:
	$logo.click(function(e){	
		if (e.ctrlKey||e.shiftKey) return true;
		if (main_nav_scroll.selectedID){			
			document.location.hash='';//remove hash			
			copyImagesToFrameBuffer(null, function(){
				main_nav_scroll.selectedID=null;
				main_nav_scroll.div.fadeOut();
				$('#primary_menu').parent().css('height',menuHandlerHeight);
				$('#primary_menu').fadeIn();
			})();
		}
	});
	//on menu in opened block click:
	$('#main_scroll .buttons a').click(function(e){
				
		if (e.ctrlKey||e.shiftKey) return true;
		var url=this.hash.substr(2);
		//check is click to same point:
		if (url==main_nav_scroll.selectedID) return;
		//lock:
		if (lock) return;
		else lock=this;
		//remove buffer:
		hideBuffer(function(){
			main_nav_scroll.show(url, function(){
				lock=null;				
				copyImagesToFrameBuffer(primaryMenu[url],function(){
					document.location.hash='#~'+url;
				})();
				
			});			
		})
		
	});
	var buffer=null;
	function copyImagesFromBuffer(){
		//buffer exists:				
		while (buffer.c.firstChild){		
			buffer.li.appendChild(buffer.c.firstChild);
		}
		buffer.li=null;
	}
	function copyImagesToFrameBuffer(li, callback){
		
		if (!buffer){	
			//init new buffer
			buffer=$('#primary_menu_buffer');
			//init buffer container (buffer- absolute, container- relative, it's markup compability):
			buffer.c=$('div',buffer)[0];
		}
		if (!buffer.li){
			//resize buffer and put over li
			var $li=$(li);			
			buffer.css($li.position());
			buffer.css({
				width:$li.width(), height:$li.height()
			});			
		}		
		if (!li){//just hide:						
			return function(){
				buffer.animate({left:-buffer.width()}, function(){
					copyImagesFromBuffer();
					buffer.hide();
					callback();
				});
			}			
		}	
		copyImagesFromBuffer();
		buffer.li=li;
		$('i', li).each(function(){
			buffer.c.appendChild(this);
		});
		buffer.show();
		return function(){
			hideBuffer(function(){showBuffer(callback)});			
		}
	}
	
	function hideBuffer(callback){
		buffer.animate({left:-buffer.width()}, callback);
	}
	
	function showBuffer(callback){		
		buffer.animate({left:-100},'slow', callback);
	}
	var menuHandlerHeight=0;
	var main_nav_scroll={
		$div: null,
		screen:[],
		init: function(id, height){
			this.div=$('#'+id);
					
			var height=0;
			var width=this.div.width();		
			var left=0;		
			$('.screen', this.div).each(function(){	
				height=Math.max(this.scrollHeight, height);			
				main_nav_scroll.screen[this.id]=$(this).css({
					width:width,
					display:'none'
				});
			});
			$('.frame', this.div).css({height: height});
			$('.screen', this.div).css({height:height});
			//remember old height:
			menuHandlerHeight=this.div.parent().height();			
			this.div.parent().css('height',this.div.height()+20);
		},
		selectedID:null,
		display:function(scroll, selectedID, height){
			
			var height=this.init(scroll, height);
			
			this.screen[selectedID].show().css({left:0});
			this.selectedID=selectedID;
		},
		show: function(id, callback){
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
					if (callback) callback();
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
	//don forgot about hash:
	if (document.location.hash && document.location.hash.substr(1,1)=='~'){
		if (primaryMenu[document.location.hash.substr(2)]){
			onPrimaryMenuItemSelected(primaryMenu[document.location.hash.substr(2)]);
		}
	}
});