function nav_primary_full(config){
	this.div=$('#primary_full');
	this.frame=$('.frame',this.div);
	this.config=config;
}

nav_primary_full.prototype.display= function(id){
	
	var height=0;
	this.screens=$('.screen', this.frame);
	this.screens.each(function(){			
		height=Math.max(height, this.clientHeight);
		console.log(height);
	});
	var nav=this;
	//this.div.css({width:this.div.parent().width()});
	this.screens.each(function(){
		this.style.width=nav.div.width()+'px';
		
		if (id==this.id){
			this.style.display='block';			
		}
	});	
	
	var bottom_menu=$('#primary_full_buttons');
	$('li a',bottom_menu).click(function(){
		nav.select(this.hash.substr(1));
	});
	
	this.div.show();
	this.div.animate({height:height}, function(){
		bottom_menu.show();
	});	
	
	this.selected=id;
}

nav_primary_full.prototype.select= function(id){
	var dir=this.getDirection(id);
	$showMe=$('#'+id);
	$hideMe=$('#'+this.selected).css({left:'0px'});
	$showMe.css({left:'1000px',display:'block'})
//	$showMe.show().animate({left:0}, function(){
//		$hideMe.hide();
//	});
//	$hideMe.animate({left:-1*moveLeft});
	this.selected=id;
}

nav_primary_full.prototype.getDirection=function(id){
	for (var i=0; i<this.screens.length; i++){
		if (this.screens[i].id==id) return -1;
		if (this.screens[i].id==this.selected) return 1;
	}
}

var nav= new nav_primary_full({left:-50}); 
nav.display('tv');