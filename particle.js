import * as Utils from './utils.js';

var particle = function(params) {

  // initialize the particle
  this.init = function() {
    this.inUse = true;

    // position
    this.position = {};
    Object.assign(this.position, params.position);

    // direction
    var speedRadian = Utils.toRadians(Utils.returnNumberInRange(params.direction.min, params.direction.max) * -1);
    var speedMagnitude = Utils.returnNumberInRange(params.speed.min, params.speed.max);

    this.velocity = Utils.returnVector(speedMagnitude, speedRadian);
    this.delta = Utils.returnVector(params.speed.delta, speedRadian);

    var gravityAngle = Utils.toRadians(params.physics.gravity_angle * -1);
    this.gravity = Utils.returnVector(params.physics.gravity_magnitude, gravityAngle);

    // radius
    this.radius = Utils.returnNumberInRange(params.radius.min, params.radius.max);
    this.radiusDelta = params.radius.delta;
    this.currentRadius = this.radius;

    // color
    this.colors = {};
    Object.assign(this.colors, params.color);

    this.currentColor = Utils.rgbToHex(this.colors.start);

    // lifetime
    this.birth = Date.now();
    this.lifetime = Utils.returnNumberInRange(params.lifetime.min, params.lifetime.max);
    this.lifetimePercentDone = 0;

    // set shape or image
    this.shape = params.shape.type;
    this.sides = params.shape.polygon.number_sides;
    this.imageRatio = params.shape.image.width / params.shape.image.height;
    this.image = params.shape.image.img_obj;
  };

  // update the particle
  // delta: the time delta between the last draw
  // return: none
  this.update = function(delta) {
    var percentSecond = delta / 1000;

    // determine new position
    this.position = Utils.addVector(this.position, Utils.elementWiseMultiplyVector(this.velocity, percentSecond));

    // determine new velocity
    var totalAcceleration = Utils.elementWiseMultiplyVector(Utils.addVector(this.gravity, this.delta), percentSecond);
    this.velocity = Utils.addVector(this.velocity, totalAcceleration);

    // determine lifetime
    this.lifetimePercentDone = (Date.now() - this.birth) / this.lifetime;

    var currentColor = this.lifetimePercentDone < 0.5 || this.colors.middle == null ?
      this.colors.start : this.colors.middle;

    var targetColor = this.lifetimePercentDone > 0.5 || this.colors.middle == null ?
      this.colors.end : this.colors.middle;

    var newRgbColor = Utils.colorPercentChange(currentColor, targetColor, this.lifetimePercentDone);
    this.currentColor = Utils.rgbToHex(newRgbColor);

    // determine new radius
    this.currentRadius += percentSecond * this.radiusDelta;
  };

  // is particle out of bounds
  // return: boolean indicating if out of bounds
  this.outOfBounds = function(bounds) {
    if (this.position.x - (this.radius * 2) > bounds.w - 1 ||
        this.position.x + (this.radius * 2) < 0 ||
        this.position.y - (this.radius * 2) > bounds.h - 1 ||
        this.position.y + (this.radius * 2) < 0)
    {
      return true;
    }

    return false;
  };

  // is the particle expired
  this.isDead = function() {
    return this.lifetimePercentDone >= 1;
  }

  // draw the particle on the given canvas context
  this.draw = function(ctx) {
    ctx.fillStyle = this.currentColor;
    ctx.beginPath();

    switch(this.shape) {
      case 'circle':
        ctx.arc(this.position.x, this.position.y, this.currentRadius, 0, Math.PI * 2, false);
        break;

      case 'triangle':
        Utils.drawShape(ctx, this.position.x - this.currentRadius, this.position.y + this.currentRadius / 1.66, this.currentRadius * 2, 3, 2);
        break;

      case 'box':
        ctx.rect(this.position.x - this.currentRadius, this.position.y - this.currentRadius, this.currentRadius * 2, this.currentRadius * 2);
        break;

      case 'polygon':
        Utils.drawShape(
          ctx,
          this.position.x - this.currentRadius / (this.sides / 3.5), // startX
          this.position.y - this.currentRadius / (2.66 / 3.5), // startY
          this.currentRadius * 2.66 / (this.sides / 3), // sideLength
          this.sides, // sideCountNumerator
          1 // sideCountDenominator
        );
        break;

      case 'star':
        Utils.drawShape(
          ctx,
          this.position.x - this.currentRadius * 2 / (this.sides / 4), // startX
          this.position.y - this.currentRadius / (2.66 / 3.5), // startY
          this.currentRadius * 2 * 2.66 / (this.sides / 3), // sideLength
          this.sides, // sideCountNumerator
          2 // sideCountDenominator
        );
        break;

      case 'image':
        ctx.drawImage(
          this.image,
          this.position.x - this.currentRadius,
          this.position.y - this.currentRadius,
          this.currentRadius * 2,
          this.currentRadius * 2 / this.imageRatio);
        break;
    }


    ctx.closePath();
    ctx.fill();
  };

  this.init();
};

export default particle;
