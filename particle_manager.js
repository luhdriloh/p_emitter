/*jshint esversion: 6 */

import * as Utils from './utils.js';
import Particle from './particle.js';

var particleManager = function(params, tag_id) {
  // get the canvas context for this particle emmiter
  var canvas_el = document.querySelector('#' + tag_id + ' > .particles-emitter-js-canvas-el');

  // create an array of the indexes of the particles that are not in use

  this.particleManager = {
    particles: [],
    particles_not_used_indexes: [],
    canvas: {
      el: canvas_el,
      w: canvas_el.offsetWidth,
      h: canvas_el.offsetHeight
    },
    position: {
      x: 400,
      y: 400
    },
    radius: {
      min: 10,
      max: 100,
      delta: 0
    },
    speed: {
      min: 1,
      max: 1,
      delta: 0
    },
    direction: {
      min: 0,
      max: 359,
      delta: 0
    },
    physics: {
      gravity_magnitude: 0,
      gravity_angle: 0
    },
    color: {
      start: { r: 255, g: 255, b: 255},
      middle: null,
      end: { r: 255, g: 255, b: 255}
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000'
      },
      polygon: {
        number_sides: 5
      },
      image: {
        img_obj: null,
        src: '',
        width: 100,
        height: 100
      }
    },
    lifetime: {
      min: 60,
      max: 60
    },
    draw: {

    },
    fn: {
      vendors: {}
    }
  };

  var particleManager = this.particleManager;

  /* set the params settings */
  if(params) {
    Object.assign(particleManager, params);
  }

  /* ---------- particleManager functions - canvas ------------ */

  particleManager.fn.canvasInit = function() {
    particleManager.canvas.ctx = particleManager.canvas.el.getContext('2d');
  };


  particleManager.fn.canvasSize = function() {
    particleManager.canvas.el.width = particleManager.canvas.w;
    particleManager.canvas.el.height = particleManager.canvas.h;
  };


  particleManager.fn.canvasPaint = function() {
    particleManager.canvas.ctx.fillRect(0, 0, particleManager.canvas.w, particleManager.canvas.h);
  };


  particleManager.fn.canvasClear = function() {
    particleManager.canvas.ctx.clearRect(0, 0, particleManager.canvas.w, particleManager.canvas.h);
  };


  /* --------- particleManager functions - particle management ----------- */

  particleManager.fn.updateParticles = function(delta) {
    var particle;

    for (var i = particleManager.particles.length - 1; i >= 0; i--) {
      particle = particleManager.particles[i];

      // if particle is not in use, continue to the next particle
      if (!particle.inUse) {
        continue;
      }

      // check the particle for any issues
      particle.update(delta);

      if (particle.outOfBounds(particleManager.canvas) || particle.isDead() || particle.currentRadius <= 0)
      {
        particle.inUse = false;
        particleManager.particles_not_used_indexes.push(i);
      }
    }
  };


  // get particle from pool
  particleManager.fn.createParticles = function(particlesLeftToCreate) {
    // first check if we have unused indexes and use them
    var notUsedLength = particleManager.particles_not_used_indexes.length;
    if (notUsedLength > 0) {
      while (particlesLeftToCreate > 0 && particleManager.particles_not_used_indexes.length > 0) {
        var particleToSet = particleManager.particles[particleManager.particles_not_used_indexes.pop()];

        // initialize the particle and remove it from the unused list
        particleToSet.init();
        particlesLeftToCreate--;
      }
    }

    for (var i = 0; i < particlesLeftToCreate; i++) {
      particleManager.particles.push(new Particle(particleManager));
    }
  };


  particleManager.fn.drawParticles = function() {
    var particle;

    for (var i = 0; i < particleManager.particles.length; i++) {
      particle = particleManager.particles[i];

      if (!particle.inUse) {
        continue;
      }

      particle.draw(particleManager.canvas.ctx);
    }
  };

  /* ---------- particleManager - start ------------ */

  particleManager.fn.canvasInit();
  particleManager.fn.canvasSize();
  return particleManager;
};

export default particleManager;
