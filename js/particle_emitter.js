/* Particle Emitter */
var particleEmitter = function(params, tag_id) {
  // set the default configuration
  var canvas_el = document.querySelector('#' + tag_id + ' > .particles-emitter-js-canvas-el');

  this.particleEmitter = {
    "emitter": {
      "canvas": {
        "el": canvas_el,
        "w": canvas_el.offsetWidth,
        "h": canvas_el.offsetHeight,
        "last_draw_time": 0,
        "background_color": "#000"
      },
      "enabled": true,
      "spawn_position": {
        "x": 200,
        "y": 200
      },
      "delay": {
        "start_delay": 100,
        "emission_delta": Number.MAX_SAFE_INTEGER,
        "delta_between_emission": 100
      },
      "general": {
        "number_of_particles": 10,
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
        "gravity_magnitude": 500,
        "gravity_angle": 90
      },
      "position": {
        "x": canvas_el.offsetWidth / 2,
        "y": canvas_el.offsetHeight / 2
      },
      "radius": {
        "min": 10,
        "max": 30,
        "delta": -10
      },
      // pixels a second
      "speed": {
        "min": 70,
        "max": 120,
        "delta": -100
      },
      "direction": {
        "min": 0,
        "max": 360,
        "delta": 0
      },
      "color": {
        "start": "#fff",
        "middle": "f00",
        "end": "#000"
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
        "min": 500,
        "max": 1400
      },
    }
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
    particleEmitter.emitter.canvas.ctx.fillStyle = particleEmitter.emitter.canvas.background_color;
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


  // for updating the emitter configuration
  particleEmitter.emitter.fn.updateConfig = function(params) {

  };


  particleEmitter.emitter.fn.draw = function() {
    var now = Date.now();
    var timeBetweenDraws = now - particleEmitter.emitter.canvas.last_draw_time;
    particleEmitter.emitter.canvas.last_draw_time = now;

    // have a sleep timer for the emission delay or the start delay
    particleEmitter.emitter.fn.canvasPaint();

    // only create particles after the emission delay
    particleEmitter.emitter.particleManager.fn.updateParticles(timeBetweenDraws);

    particleEmitter.emitter.delay.emission_delta += timeBetweenDraws;
    if (particleEmitter.emitter.delay.emission_delta >= particleEmitter.emitter.delay.delta_between_emission) {
      particleEmitter.emitter.particleManager.fn.createParticles(particleEmitter.emitter.general.number_of_particles);
      particleEmitter.emitter.delay.emission_delta = 0;
    }

    particleEmitter.emitter.particleManager.fn.drawParticles();

    requestAnimFrame(particleEmitter.emitter.fn.draw);
  };


  /* ---------- particle emitter functions - utility ------------ */
  particleEmitter.emitter.fn.convertColorsToRgb = function() {
    var colors = particleEmitter.particle_manager.color;

    for (var color of Object.keys(colors)) {
      if (colors[color] == null) {
        continue;
      }

      colors[color] = hexToRgb(colors[color]);
    }
  }


  /* ---------- particle emitter functions - particleEmitter ------------ */

  particleEmitter.emitter.fn.start = async function() {
    particleEmitter.emitter.fn.convertColorsToRgb();
    particleEmitter.emitter.particleManager = new particleManager(particleEmitter.particle_manager, tag_id);

    await sleep(particleEmitter.emitter.delay.start_delay);
    particleEmitter.emitter.canvas.last_draw_time = Date.now();
    particleEmitter.emitter.fn.draw();

    // sleep for the emission
    // TODO: call init then call requestAnimFrame to start the animation
  };

  particleEmitter.emitter.fn.canvasInit();
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


function setBackgroundCanvas(canvas_el) {
  canvas_el.width = canvas_el.offsetWidth;
  canvas_el.height = canvas_el.offsetHeight;

  var ctx = canvas_el.getContext('2d');
  var rowColorBlack = true;
  var currentColorBlack = true;

  console.log(canvas_el.offsetHeight);

  for (var row = 0; row <= canvas_el.offsetHeight; row += 10) {
    currentColorBlack = rowColorBlack;
    var background;

    for (var col = 0; col <= canvas_el.offsetWidth; col += 10) {
      background = currentColorBlack ? "#333733" : "#999d99";
      ctx.fillStyle = background;
      ctx.fillRect(col, row, 10, 10);

      currentColorBlack = !currentColorBlack;
    }

    rowColorBlack = !rowColorBlack;
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hexToRgb(hex){
  // By Tim Down - http://stackoverflow.com/a/5624139/3493650
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
     return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}


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

  var canvas_background_el = document.createElement('canvas');
  canvas_background_el.className = "background-canvas";

  /* set size canvas */
  canvas_background_el.style.width = "500px";
  canvas_background_el.style.height = "500px";
  canvas_background_el.style.position = "absolute";


  // append background canvas
  var background_canvas = document.getElementById(tag_id).appendChild(canvas_background_el);

  setBackgroundCanvas(canvas_background_el);

  /* create particle canvas element */
  var canvas_el = document.createElement('canvas');
  canvas_el.className = pEmitterJS_canvas_class;

  /* set size canvas */
  canvas_el.style.width = "500px";
  canvas_el.style.height = "500px";
  canvas_el.style.position = "absolute";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  /* launch particle.js */
  if(canvas != null){
    new particleEmitter(params, tag_id);
  }
};
