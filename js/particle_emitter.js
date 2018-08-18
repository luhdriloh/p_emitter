// this is the default configuration
var config =
{
  "emitter": {
    "enabled": true,
    "spawn_position": {
      "x": 200,
      "y": 200
    },
    "delay": {
      "start_delay": 0,
      "delta_between_emission": 0
    },
    "general": {
      "number_of_particles": 3,
      "burst": 0,
      "layer": 0,
    },
    "fn": {
      "vendors": {}
    }
  },
  "particle_manager": {
    "movement": {

    },
    "physics": {
      "gravity_direction_min": 270,
      "gravity_direction_max": 270,
      "gravity_magnitude": 0,
      "force": 0
    },
    position: {
      x: 400,
      y: 400
    },
    "radius": {
      "min": 3,
      "max": 20,
      "delta": 0
    },
    "speed": {
      "min": 1,
      "max": 5,
      "delta": 0
    },
    "direction": {
      "min": 0,
      "max": 359,
      "delta": 0
    },
    "color": {
      "start": "#fff",
      "middle": "#fff",
      "end": "#fff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000"
      },
      "polygon": {
        "number_sides": 5
      },
      "image": {
        "src": "",
        "width": 100,
        "height": 100
      }
    },
    "lifetime": {
      "min": 60,
      "max": 60
    },
  }
};

/* Particle Emitter */
var particleEmitter = function(params, tag_id) {
  // set the default configuration
  var canvas_el = document.querySelector('#' + tag_id + ' > .particles-emitter-js-canvas-el');
  this.particleEmitter = config;
  this.particleEmitter.emitter.canvas =
  {
    el: canvas_el,
    w: canvas_el.offsetWidth,
    h: canvas_el.offsetHeight
  };

  var particleEmitter = this.particleEmitter;

  /* set the params settings */
  if(params) {
    Object.deepExtend(particleEmitter, params);
  }

  /* ---------- particle emitter functions - canvas ------------ */

  particleEmitter.emitter.fn.canvasInit = function() {
    particleEmitter.emitter.canvas.ctx = particleEmitter.emitter.canvas.el.getContext('2d');
  };


  particleEmitter.emitter.fn.canvasSize = function() {
    particleEmitter.emitter.canvas.el.width = particleEmitter.emitter.canvas.w;
    particleEmitter.emitter.canvas.el.height = particleEmitter.emitter.canvas.h;
  };


  particleEmitter.emitter.fn.canvasPaint = function() {
    particleEmitter.emitter.canvas.ctx.fillRect(0, 0, particleEmitter.emitter.canvas.w, particleEmitter.emitter.canvas.h);
  };


  particleEmitter.emitter.fn.canvasClear = function() {
    particleEmitter.emitter.canvas.ctx.clearRect(0, 0, particleEmitter.emitter.canvas.w, particleEmitter.emitter.canvas.h);
  };


  /* ---------- particle emitter functions - life time ------------ */

  particleEmitter.emitter.fn.init = function() {
    // cancel all animation frames
    // reset all animation frames
  };


  particleEmitter.emitter.fn.updateConfig = function(params) {

  };

  particleEmitter.emitter.fn.draw = function() {

  };


  /* ---------- particle emitter functions - particleEmitter ------------ */

  particleEmitter.emitter.fn.start = function() {
    var particle = new particleManager(particleEmitter.particle_manager, tag_id);
    particle.fn.createParticles(particleEmitter.emitter.general.number_of_particles);
    for (var i = 0; i < 20; i++) {
      particle.fn.drawParticles();
    }
    // TODO: call init then call requestAnimFrame to start the animation
  };


  particleEmitter.emitter.fn.start();
};


/* global functions - vendors */

Object.deepExtend = function(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
})();


window.cancelRequestAnimFrame = ( function() {
  return window.cancelAnimationFrame         ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame    ||
    window.oCancelRequestAnimationFrame      ||
    window.msCancelRequestAnimationFrame     ||
    clearTimeout;
} )();


/* ---------- particleEmitterJS.js functions - start ------------ */

window.pEmitterJSDom = [];

window.particleEmitterJS = function(params, tag_id) {

  //console.log(params);

  /* no string id? so it's object params, and set the id with default id */
  if(typeof(tag_id) != 'string'){
    params = tag_id;
    tag_id = 'particle-emitter-js';
  }

  /* no id? set the id to default id */
  if(!tag_id){
    tag_id = 'particle-emitter-js';
  }

  /* particleEmitterJS elements */
  var pEmitterJS_tag = document.getElementById(tag_id),
      pEmitterJS_canvas_class = 'particles-emitter-js-canvas-el',
      exist_canvas = pEmitterJS_tag.getElementsByClassName(pEmitterJS_canvas_class);

  /* remove canvas if exists into the particleEmitterJS target tag */
  if(exist_canvas.length){
    while(exist_canvas.length > 0){
      pEmitterJS_tag.removeChild(exist_canvas[0]);
    }
  }

  /* create canvas element */
  var canvas_el = document.createElement('canvas');
  canvas_el.className = pEmitterJS_canvas_class;

  /* set size canvas */
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  /* launch particle.js */
  if(canvas != null){
    new particleEmitter(params, tag_id);
  }
};
