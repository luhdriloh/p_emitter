var particleJS = function(params, tag_id, on_death) {

  // get the canvas context for this particle emmiter
  var canvas_el = document.querySelector('#' + tag_id + ' > .particles-emitter-js-canvas-el');

  this.particleJS = {
    particles: [],
    canvas: {
      el: canvas_el,
      w: canvas_el.offsetWidth,
      h: canvas_el.offsetHeight
    },
    spawn_position: {
      x: 200,
      y: 200
    },
    radius: {
      min: 50,
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
    fn: {
      vendors: {}
    }
  };

  var particleJS = this.particleJS;

  /* set the params settings */
  if(params) {
    Object.deepExtend(particleJS, params);
  }


  /* ---------- particleJS functions - canvas ------------ */

  particleJS.fn.canvasInit = function() {
    particleJS.canvas.ctx = particleJS.canvas.el.getContext('2d');
  };


  particleJS.fn.canvasSize = function() {
    particleJS.canvas.el.width = particleJS.canvas.w;
    particleJS.canvas.el.height = particleJS.canvas.h;
  };


  particleJS.fn.canvasPaint = function() {
    particleJS.canvas.ctx.fillRect(0, 0, particleJS.canvas.w, particleJS.canvas.h);
  };


  particleJS.fn.canvasClear = function() {
    particleJS.canvas.ctx.clearRect(0, 0, particleJS.canvas.w, particleJS.canvas.h);
  };



  /* --------- particleJS functions - particles ----------- */
  particleJS.fn.particle = function() {
    // position
    this.position = particleJS.spawn_position;

    // direction
    this.direction = returnNumberInRange(particleJS.direction.min, particleJS.direction.max);

    // speed
    this.speed = returnNumberInRange(particleJS.speed.min, particleJS.speed.max);

    // radius
    this.radius = returnNumberInRange(particleJS.radius.min, particleJS.radius.max);

    // lifetime
    this.lifetime = returnNumberInRange(particleJS.lifetime.min, particleJS.lifetime.max);

    // color
    this.color = particleJS.color.start;

    // image

  };

  // just draw a circle for now
  particleJS.fn.particle.prototype.draw = function() {
    var particle = this;
    var radius = particle.radius;

    particleJS.canvas.ctx.fillStyle = '#fff';
    particleJS.canvas.ctx.beginPath();

    // just draw a circle for now
    particleJS.canvas.ctx.arc(particle.position.x, particle.position.y, radius, 0, Math.PI * 2, false);
    particleJS.canvas.ctx.closePath();
    particleJS.canvas.ctx.fill();
  };

  // create particles
  particleJS.fn.createParticle = function() {
    particleJS.particles.push(new particleJS.fn.particle());
  };

  particleJS.fn.drawParticles = function() {
    var particle;
    for (var i = 0; i < particleJS.particles.length; i++) {
      particle = particleJS.particles[i];
      particle.draw();
    }
  };


  /* ---------- particleJS functions - particles interaction ------------ */


  /* ---------- particleJS functions - modes events ------------ */


  /* ---------- particleJS functions - vendors ------------ */


  /* ---------- particleJS - start ------------ */
  particleJS.fn.canvasInit();
  particleJS.fn.canvasSize();
  particleJS.fn.canvasPaint();

  return particleJS;
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


function returnNumberInRange(min, max) {
  return Math.random() * Math.abs(max - min) + min;
}


function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
