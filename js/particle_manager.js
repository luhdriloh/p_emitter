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
    color: {
      start: '#fff',
      middle: '#fff',
      end: '#fff'
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
    Object.deepExtend(particleManager, params);
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


  /* --------- particleManager functions - particles ----------- */
  particleManager.fn.particle = function() {
    // position
    this.position = {};
    Object.assign(this.position, particleManager.position);

    // direction
    var angle = returnNumberInRange(particleManager.direction.min, particleManager.direction.max);
    var speedMagnitude = returnNumberInRange(particleManager.speed.min, particleManager.speed.max);

    this.velocity = {};
    this.velocity.x = speedMagnitude * Math.cos(toRadians(angle));
    this.velocity.y = speedMagnitude * Math.sin(toRadians(angle));

    // radius
    this.radius = returnNumberInRange(particleManager.radius.min, particleManager.radius.max);

    // color
    this.color = particleManager.color.start;

    // lifetime
    this.birth = Date.now();
    this.lifetime = returnNumberInRange(particleManager.lifetime.min, particleManager.lifetime.max);
  };


  particleManager.fn.particle.prototype.outOfBounds = function(bounds) {
    var particle = this;

    if (particle.position.x - (particle.radius * 2) > bounds.w - 1 ||
        particle.position.x + (particle.radius * 2) < 0 ||
        particle.position.y - (particle.radius * 2) > bounds.h - 1 ||
        particle.position.y + (particle.radius * 2) < 0)
    {
      return true;
    }

    return false;
  };


  // check if the particle
  particleManager.fn.particle.prototype.isDead = function(bounds) {
    var particle = this;
    return Date.now() - particle.birth > particle.lifetime;
  }


  // just draw a circle for now
  particleManager.fn.particle.prototype.update = function() {
  };


  // just draw a circle for now
  particleManager.fn.particle.prototype.draw = function() {
    var p = this;

    particleManager.canvas.ctx.fillStyle = '#fff';
    particleManager.canvas.ctx.beginPath();

    // just draw a circle for now
    particleManager.canvas.ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2, false);
    particleManager.canvas.ctx.closePath();
    particleManager.canvas.ctx.fill();

    // TODO: make it so that images are able to be drawn
  };


  particleManager.fn.updateParticles = function() {
    var particle;

    for (var i = particleManager.particles.length - 1; i >= 0; i--) {
      particle = particleManager.particles[i];
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;

      // get a birth percent that you can do different things with
      // this will help in changing the color as the particle gets older

      // check the particle for any issues
      if (particle.outOfBounds(particleManager.canvas) || particle.isDead())
      {
        particleManager.particles_not_used_indexes.push(i);
        particleManager.particles = particleManager.fn.removeParticle(particle);
      }
    }
  };


  // create particles
  particleManager.fn.createParticles = function(particlesLeftToCreate) {
    // first check if we have unused indexes and use them
    var notUsedLength = particleManager.particles_not_used_indexes.length;
    if (notUsedLength > 0) {
      for (var i = notUsedLength; i >= 0; i--) {
        particleManager.particles_not_used_indexes.pop();
      }
    }


    for (var i = 0; i < particlesLeftToCreate; i++) {
      particleManager.particles.push(new particleManager.fn.particle());
    }
  };


  particleManager.fn.removeParticle = function(particle) {
    var index = particleManager.particles.indexOf(particle);
    var particlesCopy = particleManager.particles.slice();

    if (index >= 0) {
      particlesCopy.splice(index, 1);
      return particlesCopy;
    }
  };

  particleManager.fn.drawParticles = function() {
    var particle;
    particleManager.fn.updateParticles();

    for (var i = 0; i < particleManager.particles.length; i++) {
      particle = particleManager.particles[i];
      particle.draw();
    }
  };


  /* ---------- particleManager functions - modes events ------------ */


  /* ---------- particleManager - start ------------ */

  particleManager.fn.canvasInit();
  particleManager.fn.canvasSize();
  return particleManager;
};

/* ---------- particles.js functions - start ------------ */










/* ---------- global functions - vendors ------------ */

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


function toRadians (angle) {
  return angle * (Math.PI / 180);
}


function returnNumberInRange(min, max) {
  if (min == max) {
    return max;
  }

  return Math.random() * Math.abs(max - min) + min;
}


function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
