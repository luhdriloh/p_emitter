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
    this.init();
  };


  particleManager.fn.particle.prototype.init = function() {
    this.inUse = true;

    // position
    this.position = {};
    Object.assign(this.position, particleManager.position);

    // direction
    var speedAngle = returnNumberInRange(particleManager.direction.min, particleManager.direction.max) * -1;
    var speedMagnitude = returnNumberInRange(particleManager.speed.min, particleManager.speed.max);

    this.velocity = {};
    this.velocity.x = speedMagnitude * Math.cos(toRadians(speedAngle));
    this.velocity.y = speedMagnitude * Math.sin(toRadians(speedAngle));

    this.delta = {};
    this.delta.x = particleManager.speed.delta * Math.cos(toRadians(speedAngle));
    this.delta.y = particleManager.speed.delta * Math.sin(toRadians(speedAngle));


    var gravityAngle = particleManager.physics.gravity_angle * -1;
    this.gravity = {};
    this.gravity.x = Math.floor(particleManager.physics.gravity_magnitude * Math.cos(toRadians(gravityAngle)));
    this.gravity.y = Math.floor(particleManager.physics.gravity_magnitude * Math.sin(toRadians(gravityAngle)));

    // radius
    this.radius = returnNumberInRange(particleManager.radius.min, particleManager.radius.max);
    this.currentRadius = this.radius;

    // color
    this.colors = {};
    Object.assign(this.colors, particleManager.color);
    this.currentColor = rgbToHex(this.colors.start);

    // lifetime
    this.birth = Date.now();
    this.lifetime = returnNumberInRange(particleManager.lifetime.min, particleManager.lifetime.max);
    this.lifetimeDone = 0;

    // set shape or image
    this.shape = particleManager.shape.type;
    this.imageRatio = particleManager.shape.image.width / particleManager.shape.image.height;
    this.image = particleManager.shape.image.img_obj;
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


  // check if the particle is dead
  particleManager.fn.particle.prototype.isDead = function() {
    var particle = this;
    return particle.lifetimeDone >= 1;
  };



  particleManager.fn.particle.prototype.update = function(delta) {
    var particle = this;
    var percentSecond = delta / 1000;

    // determine new position
    particle.position.x += particle.velocity.x * percentSecond;
    particle.position.y += particle.velocity.y * percentSecond;

    // determine new velocity
    particle.velocity.x += (particle.gravity.x + particle.delta.x) * percentSecond;
    particle.velocity.y += (particle.gravity.y + particle.delta.y) * percentSecond;

    // determine lifetime
    particle.lifetimeDone = (Date.now() - particle.birth) / particle.lifetime;

    var current = particle.lifetimeDone < 0.5 || particle.colors.middle == null ?
      particle.colors.start : particle.colors.middle;

    var target = particle.lifetimeDone > 0.5 || particle.colors.middle == null ?
      particle.colors.end : particle.colors.middle;

    var newRgbColor = colorPercentChange(current, target, particle.lifetimeDone);
    particle.currentColor = rgbToHex(newRgbColor);

    // determine new radius
    particle.currentRadius += percentSecond * particleManager.radius.delta;
  };


  // just draw a circle for now
  particleManager.fn.particle.prototype.draw = function(ctx) {
    var particle = this;
    var x = particle.position.x;
    var y = particle.position.y;
    var radius = particle.currentRadius;
    var nb_sides = particleManager.shape.polygon.number_sides;

    ctx.fillStyle = particle.currentColor;
    ctx.beginPath();

    console.log('drawing: ' + particle.shape);
    switch(particle.shape) {
      case 'circle':
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        break;

      case 'triangle':
        particleManager.fn.vendors.drawShape(ctx, x - radius, y + radius / 1.66, radius * 2, 3, 2);
        break;

      case 'box':
        ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
        break;

      case 'polygon':
        particleManager.fn.vendors.drawShape(
          ctx,
          x - radius / (nb_sides / 3.5), // startX
          y - radius / (2.66 / 3.5), // startY
          radius*2.66 / (nb_sides / 3), // sideLength
          nb_sides, // sideCountNumerator
          1 // sideCountDenominator
        );
        break;

      case 'star':
        particleManager.fn.vendors.drawShape(
          ctx,
          x - radius * 2 / (nb_sides / 4), // startX
          y - radius / (2.66 / 3.5), // startY
          radius * 2 * 2.66 / (nb_sides / 3), // sideLength
          nb_sides, // sideCountNumerator
          2 // sideCountDenominator
        );
        break;

      case 'image':
        ctx.drawImage(particle.image,
          x - radius,
          y - radius,
          radius * 2,
          radius * 2 / particle.imageRatio);
        break;
    }


    ctx.closePath();
    ctx.fill();
  };


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
      particleManager.particles.push(new particleManager.fn.particle());
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




  /* ---------- particleManager functions - vendors ------------ */

  particleManager.fn.vendors.drawShape = function(ctx, startX, startY, sideLength, sideCountNumerator, sideCountDenominator){

    // By Programming Thomas - https://programmingthomas.wordpress.com/2013/04/03/n-sided-shapes/
    var sideCount = sideCountNumerator * sideCountDenominator;
    var decimalSides = sideCountNumerator / sideCountDenominator;
    var interiorAngleDegrees = (180 * (decimalSides - 2)) / decimalSides;
    var interiorAngle = Math.PI - Math.PI * interiorAngleDegrees / 180; // convert to radians
    ctx.save();
    ctx.beginPath();
    ctx.translate(startX, startY);
    ctx.moveTo(0,0);
    for (var i = 0; i < sideCount; i++) {
      ctx.lineTo(sideLength,0);
      ctx.translate(sideLength,0);
      ctx.rotate(interiorAngle);
    }
    //ctx.stroke();
    ctx.fill();
    ctx.restore();
  };


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


function colorPercentChange(current, target, percent) {
  var newRgb = {
    r: Math.floor(current.r + (target.r - current.r) * percent),
    g: Math.floor(current.g + (target.g - current.g) * percent),
    b: Math.floor(current.b + (target.b - current.b) * percent),
  };

  return newRgb;
}


function rgbToHex(color) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
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


function toRadians (angle) {
  return (angle * Math.PI) / 180;
}


function returnNumberInRange(min, max) {
  if (min == max) {
    return max;
  }

  return (Math.random() * Math.abs(max - min)) + min;
}


function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
