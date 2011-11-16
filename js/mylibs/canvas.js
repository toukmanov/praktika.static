$(function(){
//	console.log('hello');
	var test=document.getElementById('test');
	test.width = document.body.clientWidth;
	var ctx= test.getContext('2d');	   
	ctx.lineWidth=4;
    sinus(ctx, 480, 60);
       
    var my_gradient = ctx.createLinearGradient(0, 0, test.width, 0);
    var grad=['#ffde2b','#f39a2b','#e94f25','#b91029','#951269','#503a92'];
    var step=1/(grad.length-1);
    for (var i=0; i<grad.length; i++){
    	my_gradient.addColorStop(i*step, grad[i]);
    }
    
    ctx.strokeStyle = my_gradient;
    var x=0; 
    var lineWidth=10;
    sinus(ctx, 480, 60);    		    	
	ctx.lineWidth=4;
	ctx.stroke();
        
//	console.log('ok');
});

function sinus(ctx, width, height, offset){
	offset=offset||{x:0.5, y:0.5};	
	var left=Math.ceil(ctx.canvas.clientWidth/2);	
	var top=Math.ceil(ctx.canvas.clientHeight*offset.y);	
    left-=Math.round(offset.x*width);   
    left=left-width*Math.ceil(left/width);
    ctx.moveTo(left,top);
    sig=1;
    
    while (left<ctx.canvas.clientWidth){    	
    	if (sig==1) sig=-1; else sig=1;    
    	ctx.quadraticCurveTo(left+width/2, top+sig*height, left+width, top);
    	left+=width;
    }
}