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


function returnVector(magnitude, radians) {
  return {
    x: magnitude * Math.cos(radians),
    y: magnitude * Math.sin(radians)
  };
}


function addVector(one, two) {
  return {
    x: (one.x + two.x),
    y: (one.y + two.y)
  };
}


function elementWiseMultiplyVector(vec, multiplier) {
  return {
    x: (vec.x * multiplier),
    y: (vec.y * multiplier)
  };
}


function drawShape(ctx, startX, startY, sideLength, sideCountNumerator, sideCountDenominator){

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


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* vendor functions */


export {
  colorPercentChange,
  rgbToHex,
  hexToRgb,
  toRadians,
  returnNumberInRange,
  isInArray,
  returnVector,
  drawShape,
  addVector,
  elementWiseMultiplyVector,
  sleep
};
