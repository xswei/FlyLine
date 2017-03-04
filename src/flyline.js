(function(global,factory){
	typeof exports === 'object' && typeof module !== 'undefined'?factory(exports):
	typeof define === 'function' && define.amd ? define(['exports'],factory):
	(factory((global.flyline = global.flyline || {})));
}(this,(function(exports){
	var flys = [],
		canvas = null,
		context = null,
		that = exports;


	var stats = new Stats();

	document.querySelector("#stats").appendChild(stats.domElement);
	
	function addFlyQ(o){
		var f = {
			s:{},
			e:{},
			tt:0,
			t:o.t?o.t:1000,
			color:'#'+Math.floor(Math.random()*16777215).toString(16)
		};
		try{
			f.s.x = o.start.x;
			f.s.y = o.start.y;
			f.e.x = o.end.x;
			f.e.y = o.end.y;
		}catch(e){
			console.log("aaa")
			throw new Error("Fail to add Fly,please check parameter format!");
			return ;
		}
		f.c = (o.c && o.c.x && o.c.y)?{x:o.c.x,y:o.c.y}:{x:f.s.x,y:f.s.y};
		f.step = 0.005*Math.random();
		flys.push(f);
		if(flys.length==1){
			render();
		}
	}





	function addFlyC(){

	}
	function setCanvas(s){
		if(typeof s === "string"){
			canvas = document.querySelector(s);
			context = canvas.getContext('2d');
			context.fillStyle = 'rgba(0, 0, 0, 0.05)';
			context.fillRect(0, 0, canvas.width, canvas.height);
		}else if(s instanceof HTMLCanvasElement){
			canvas = s;
			context = canvas.getContext('2d');
			context.fillStyle = 'rgba(0, 0, 0, 0.05)';
			context.fillRect(0, 0, canvas.width, canvas.height);
		}else{
			throw new Error("Fail to set Canvas!");
		}
	}

	function render(){
		context.fillStyle = 'rgba(0, 0, 0, 0.05)';
		context.fillRect(0, 0, canvas.width, canvas.height);
		drawFly();
		stats.update();
		requestAnimationFrame(render);
	}
	function drawFly(){
		if(!(canvas&&context)){
			return ;
		}
		var newA = [];
		for(var i=0;i<flys.length;++i){
			flys[i].tt += flys[i].step;
			if(flys[i].tt<1){
				newA.push(flys[i]);
			}
		}
		/*flys = flys.filter(function(d){
			d.tt += d.step;
			return d.tt<1;
		})*/
		flys = newA;
		flys.forEach(function(d){
			var np = getPointQuadRaticBeizer(d.s,d.c,d.e,d.tt);
			context.beginPath();
			context.fillStyle = d.color;
			context.arc(np.x,np.y,3,0,Math.PI*2,false);
			context.fill();
		})
	}





	function getPointQuadRaticBeizer(s,c,e,t){
		var x = Math.pow(1-t,2) * s.x + 2 * (1-t) * t * c.x + Math.pow(t,2) * e.x; 
    	var y = Math.pow(1-t,2) * s.y + 2 * (1-t) * t * c.y + Math.pow(t,2) * e.y; 
   		return {x:x,y:y};
	}
	function getPointCubicBezier(s,c1,c2,e,t){
		var x=CubicN(t,s.x,c1.x,c2.x,e.x);
    	var y=CubicN(t,s.y,c1.y,c2.y,e.y);
    	return({x:x,y:y});
	}
	function CubicN(pct, a,b,c,d) {
	    var t2 = pct * pct;
	    var t3 = t2 * pct;
	    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct
	    + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct
	    + (c * 3 - c * 3 * pct) * t2
	    + d * t3;
	}





	exports.version = '1.0.0';
	exports.addFlyQ = addFlyQ;
	exports.setCanvas = setCanvas;
})));