/* jshint esversion: 6 */

import * as Utils from './utils.js';
import ParticleManager from './particle_manager.js';

var particleEmitter = function(params, tag_id) {
  // set the default configuration
  var canvas_el = document.querySelector('#' + tag_id + ' > .particles-emitter-js-canvas-el');

  // pull the config out from somewhere else
  this.particleEmitter =
  {
    "canvas": {
      "el": canvas_el,
      "w": canvas_el.offsetWidth,
      "h": canvas_el.offsetHeight,
      "last_draw_time": 0,
      "background_color": null
    },
    "enabled": true,
    "spawn_position": {
      "x": 200,
      "y": 200
    },
    "delay": {
      "start_delay": 100,
      "emission_delta": Number.MAX_SAFE_INTEGER,
      "delta_between_emission": 0
    },
    "general": {
      "number_of_particles": 1,
      "burst": 0,
      "layer": 0,
    },
    "fn": {
      "vendors": {}
    },
    "particles" :
    {
        "movement": {

        },
        "physics": {
          "gravity_magnitude": 0,
          "gravity_angle": 90
        },
        "position": {
          "x": canvas_el.offsetWidth / 2,
          "y": canvas_el.offsetHeight / 2
        },
        "radius": {
          "min": 10,
          "max": 40,
          "delta": 0
        },
        // pixels a second
        "speed": {
          "min": 20,
          "max": 100,
          "delta": 0
        },
        "direction": {
          "min": 0,
          "max": 360,
          "delta": 0
        },
        "color": {
          "start": "#000",
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
            "img_obj": null,
            "src": "particles/smoke.png",
            "width": 0,
            "height": 0
          }
        },
        "lifetime": {
          "min": 800,
          "max": 1700
        }
      }
  };

  var particleEmitter = this.particleEmitter;

  /* set the configuration settings for the emitter and the particle manager */
  if(params) {
    Object.assign(particleEmitter, params);
  }

  /* ---------- particle emitter functions - canvas ------------ */

  particleEmitter.fn.canvasInit = function() {
    particleEmitter.canvas.ctx = particleEmitter.canvas.el.getContext('2d');
  };


  particleEmitter.fn.canvasSize = function() {
    particleEmitter.canvas.el.width = particleEmitter.canvas.w;
    particleEmitter.canvas.el.height = particleEmitter.canvas.h;
  };


  particleEmitter.fn.canvasPaint = function() {
    particleEmitter.canvas.ctx.fillStyle = particleEmitter.canvas.background_color;
    particleEmitter.canvas.ctx.fillRect(0, 0, particleEmitter.canvas.w, particleEmitter.canvas.h);
  };


  particleEmitter.fn.canvasClear = function() {
    particleEmitter.canvas.ctx.clearRect(0, 0, particleEmitter.canvas.w, particleEmitter.canvas.h);
  };


  /* ---------- particle emitter functions - life time ------------ */

  particleEmitter.fn.init = function() {
    // cancel all animation frames
    // reset all animation frames
  };


  // for updating the emitter configuration
  particleEmitter.fn.updateConfig = function(params) {

  };


  particleEmitter.fn.draw = function() {
    if (particleEmitter.enabled == false) {
      return;
    }

    var now = Date.now();
    var timeBetweenDraws = now - particleEmitter.canvas.last_draw_time;
    particleEmitter.canvas.last_draw_time = now;

    // have a sleep timer for the emission delay or the start delay
    if (particleEmitter.canvas.background == null) {
      particleEmitter.fn.canvasClear();
    }
    else {
      particleEmitter.fn.canvasPaint();
    }

    // only create particles after the emission delay
    particleEmitter.particleManager.fn.updateParticles(timeBetweenDraws);

    particleEmitter.delay.emission_delta += timeBetweenDraws;
    if (particleEmitter.delay.emission_delta >= particleEmitter.delay.delta_between_emission) {
      particleEmitter.particleManager.fn.createParticles(particleEmitter.general.number_of_particles);
      particleEmitter.delay.emission_delta = 0;
    }

    particleEmitter.particleManager.fn.drawParticles();

    requestAnimFrame(particleEmitter.fn.draw);
  };


  /* ---------- particle emitter functions - vendors ------------ */


  particleEmitter.fn.vendors.loadImage = function() {
    var shape = particleEmitter.particles.shape;
    var particlesConfig = particleEmitter.particles;

    // if there is an image wait for it then call start
    if (shape.type == 'image' &&  shape.image.src != '') {
      var img = new Image();
      img.onload = function() {
        // set the width and the height of the image
        particlesConfig.shape.image.width = this.width;
        particlesConfig.shape.image.height = this.height;

        // set the image object
        particlesConfig.shape.image.img_obj = img;
        particleEmitter.fn.start();
      };

      img.src = particlesConfig.shape.image.src;
    }
    else {
      particleEmitter.fn.start();
    }
  };

  // this should be done in the particle manager
  particleEmitter.fn.convertColorsToRgb = function() {
    var colors = particleEmitter.particles.color;

    for (var color of Object.keys(colors)) {
      if (colors[color] == null) {
        continue;
      }

      colors[color] = Utils.hexToRgb(colors[color]);
    }
  };


  /* ---------- particle emitter functions - particleEmitter ------------ */

  particleEmitter.fn.turnOff = function() {
    particleEmitter.enabled = false;
  };


  particleEmitter.fn.turnOn = function() {
    particleEmitter.enabled = true;
    particle.fn.draw();
  };


  particleEmitter.fn.start = async function() {
    particleEmitter.fn.convertColorsToRgb();
    particleEmitter.particleManager = new ParticleManager(particleEmitter.particles, tag_id);

    await Utils.sleep(particleEmitter.delay.start_delay);
    particleEmitter.canvas.last_draw_time = Date.now();
    particleEmitter.fn.draw();
  };

  particleEmitter.fn.canvasInit();
  particleEmitter.fn.vendors.loadImage();

  return particleEmitter;
};



/* global functions - vendors */

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


export default particleEmitter;
