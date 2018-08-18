var particleManager = function(params, tag_id, on_death) {
  console.log(params);
  // get the canvas context for this particle emmiter
  var canvas_el = document.querySelector('#' + tag_id + ' > .particles-emitter-js-canvas-el');

  this.particleManager = {
    particles: [],
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
    console.log(angle);

    this.velocity = {};
    this.velocity.x = speedMagnitude * Math.cos(toRadians(angle));
    this.velocity.y = speedMagnitude * Math.sin(toRadians(angle));

    // radius
    this.radius = returnNumberInRange(particleManager.radius.min, particleManager.radius.max);

    // lifetime
    this.lifetime = returnNumberInRange(particleManager.lifetime.min, particleManager.lifetime.max);

    // color
    this.color = particleManager.color.start;

    // image
  };

  // just draw a circle for now
  particleManager.fn.particle.prototype.draw = function() {
    var p = this;
    var radius = p.radius;

    particleManager.canvas.ctx.fillStyle = '#fff';
    particleManager.canvas.ctx.beginPath();

    // just draw a circle for now
    particleManager.canvas.ctx.arc(p.position.x, p.position.y, radius, 0, Math.PI * 2, false);
    particleManager.canvas.ctx.closePath();
    particleManager.canvas.ctx.fill();

    // TODO: make it so that images are able to be drawn
  };

  particleManager.fn.updateParticles = function() {
    var particle;

    for (var i = 0; i < particleManager.particles.length; i++) {
      console.log("Update");
      particle = particleManager.particles[i];
      console.log(particle.velocity);
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
    }
  };


  // create particles
  particleManager.fn.createParticles = function(number_particles) {
    for (var i = 0; i < number_particles; i++) {
      particleManager.particles.push(new particleManager.fn.particle());
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
  particleManager.fn.canvasPaint();

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
