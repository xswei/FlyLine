(function(global,factory){
	typeof exports === 'object' && typeof module !== 'undefined'?factory(exports):
	typeof define === 'function' && define.amd ? define(['exports'],factory):
	(factory((global.flyline = global.flyline || {})));
}(this,(function(exports){
	var flys = [],
		canvas = null,
		context = null,
		that = exports;
	render();
	function setCanvas(s){
		canvas = document.querySelector(s);
		if(canvas instanceof HTMLCanvasElement){
			context = canvas.getContext("2d");
		}else{
			throw new Error("Fail to set Canvas!");
		}
	}


	function addFlyL(o){
		var f = {
			type:"line",
			s:o.start,
			e:o.target,
			c:o.color || "#000",
			t:o.time || 1000,
			l:o.len || 1,
			t1:0,
			t2:0,
			size:o.size || 5,
		}
		f.step = ((1+f.l)*1000)/(60*f.t);
		flys.push(f);
	}
	function addFlyQ(o){
		var f = {
			type:"quad",
			s:o.start,
			e:o.target,
			c:o.color || "#000",
			t:o.time || 1000,
			l:o.len || 1,
			t1:0,
			t2:0,
			size:o.size || 5,
			i:o.i || 0.3
		};
		f.step = ((1+f.l)*1000)/(60*f.t);
		f.dis = getDis(f.s,f.e);
		f.r = getRotate(f);
		f.ctl = {
			x:f.dis/2,
			y:f.dis*f.i
		}
		flys.push(f);
	}


	function render(){
		if(context){
			context.clearRect(0,0,canvas.width,canvas.height);
		}
		drawFly();
		requestAnimationFrame(render);
	}
	function drawFly(){
		let newFlys = [];
		for(let i=0,len=flys.length;i<len;++i){
			if(flys[i].type === "line"){
				drawL(flys[i])
			}else if(flys[i].type === "quad"){
				drawQ(flys[i])
			}
			if(flys[i].t2<1){
				newFlys.push(flys[i]);
			}else{
				//destroy a fly
			}
		}
		flys = newFlys;
		that.flys = flys;
	}
	function drawL(f){
		var p1,p2;
		if(f.t1<1){
			f.t1 += f.step;
			f.t1 = Math.min(1,f.t1);
		}
		if(f.t1>=f.l){
			f.t2 += f.step;
			f.t2 = Math.min(1,f.t2);
		}
		p1 = getPointInLine(f.s,f.e,f.t1);
		p2 = getPointInLine(f.s,f.e,f.t2);
		var grd = context.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
		grd.addColorStop(0,f.c);
		grd.addColorStop(1,"rgba(255,255,255,0)")
		context.beginPath();
		context.strokeStyle = grd;
		context.lineWidth = f.size;
		context.lineCap = "round";
		context.moveTo(p1.x,p1.y);
		context.lineTo(p2.x,p2.y);
		context.stroke();
	}
	function drawQ(f){
		var p1,p2;
		if(f.t1<1){
			f.t1 += f.step;
			f.t1 = Math.min(1,f.t1);
		}
		if(f.t1>=f.l){
			f.t2 += f.step;
			f.t2 = Math.min(1,f.t2);
		}
		p1 = getPointQuadRaticBeizer({x:0,y:0},f.ctl,{x:f.dis,y:0},f.t1);
		p2 = getPointQuadRaticBeizer({x:0,y:0},f.ctl,{x:f.dis,y:0},f.t2);

		context.save();
		context.translate(f.s.x,f.s.y);
		context.rotate(f.r);
		var grd = context.createLinearGradient(p2.x, p2.y,p1.x, p1.y);
		grd.addColorStop(0,"rgba(255,255,255,0)");
		grd.addColorStop(1,f.c);
		grd.addColorStop(1,"rgba(255,255,255,0)");
		context.beginPath();
		
		context.strokeStyle = grd;
		context.lineWidth = f.size;
		context.moveTo(0,0);
		context.quadraticCurveTo(f.ctl.x,f.ctl.y,f.dis,0);
		context.stroke();
		/*context.beginPath();
		context.fillStyle = f.c;
		context.arc(p1.x,p1.y,f.size/2,0,Math.PI*2);
		context.fill()*/
		context.restore();
	}




	function getPointInLine(s,e,t){
		var x = e.x - (e.x-s.x)*t;
		var y = e.y - (e.y-s.y)*t;
		return {x:x,y:y};
	}

	function getPointQuadRaticBeizer(s,c,e,t){
		var x = Math.pow(1-t,2) * s.x + 2 * (1-t) * t * c.x + Math.pow(t,2) * e.x; 
    	var y = Math.pow(1-t,2) * s.y + 2 * (1-t) * t * c.y + Math.pow(t,2) * e.y; 
   		return {x:x,y:y};
	}
	function getMatrix(f){

	}
	function getDis(p1,p2){
		return  Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
	}
	function getRotate(f){
		var r,
			s = f.s,
			e = f.e,
			_dis = f.dis;
		if (e.x > s.x) {
			if (e.y > s.y) {
				r = Math.asin((e.y - s.y) / _dis)
			} else {
				r = Math.asin((s.y - e.y) / _dis)
				r = -r;
			}
		} else {
			if (e.y > s.y) {
				r = Math.asin((e.y - s.y) / _dis)
				r = Math.PI - r;
			} else {
				r = Math.asin((s.y - e.y) / _dis)
				r -= Math.PI;
			}
		}
		return r;
	}
	/*function getPointCubicBezier(s,c1,c2,e,t){
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
	}*/
	exports.version = '1.0.0';
	exports.addFlyL = addFlyL;
	exports.addFlyQ = addFlyQ;
	exports.setCanvas = setCanvas;
})));