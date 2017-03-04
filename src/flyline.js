(function(global,factory){
	typeof exports === 'object' && typeof module !== 'undefined'?factory(exports):
	typeof define === 'function' && define.amd ? define(['exports'],factory):
	(factory((global.flyline = global.flyline || {})));
}(this,(function(exports){

	var that = exports;
	
	function Fly(o){
		this.s = o.s;
		this.e = o.e;
		this.t = o.t?o.t:1000;
		that.flys.push(this);
		return that;
	}

	function setCanvas(s){
		var canvas;
		if(typeof s === "string"){
			canvas = document.querySelector(s);
		}else{
			canvas = s;
		}
		if(s instanceof HTMLCanvasElement){
			this.domElement = s;
			this.
		}else{
			throw new Error("Fail to init Canvas Element!");
		}
	}



	function getPointInQuadRaticBeizer(s,c,e,t){
		var x = Math.pow(1-t,2) * s.x + 2 * (1-t) * t * c.x + Math.pow(t,2) * e.x; 
    	var y = Math.pow(1-t,2) * s.y + 2 * (1-t) * t * c.y + Math.pow(t,2) * e.y; 
   		return {x:x,y:y};
	}
	





	exports.version = '1.0.0';
	exports.flys = [];
	exports.Fly = Fly;
	exports.setCanvas = setCanvas;

})));