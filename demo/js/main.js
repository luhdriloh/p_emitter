/* jshint esversion: 6 */

import ParticleEmitter from './particle_emitter.js';

/* ---------- particleEmitterJS.js functions - start ------------ */

function setBackgroundCanvas(canvas_el) {
  canvas_el.width = canvas_el.offsetWidth;
  canvas_el.height = canvas_el.offsetHeight;

  var ctx = canvas_el.getContext('2d');
  var rowColorBlack = true;
  var currentColorBlack = true;

  for (var row = 0; row <= canvas_el.offsetHeight; row += 10) {
    currentColorBlack = rowColorBlack;
    var background;

    for (var col = 0; col <= canvas_el.offsetWidth; col += 10) {
      background = currentColorBlack ? "#eee" : "#bbbbbc";
      ctx.fillStyle = background;
      ctx.fillRect(col, row, 10, 10);

      currentColorBlack = !currentColorBlack;
    }

    rowColorBlack = !rowColorBlack;
  }
}



// this needs to be part of the demo
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
  canvas_background_el.style.width = "100%";
  canvas_background_el.style.height = "100%";
  canvas_background_el.style.position = "absolute";


  // append background canvas
  var background_canvas = document.getElementById(tag_id).appendChild(canvas_background_el);

  setBackgroundCanvas(canvas_background_el);

  /* create particle canvas element */
  var canvas_el = document.createElement('canvas');
  canvas_el.className = pEmitterJS_canvas_class;

  /* set size canvas */
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";
  canvas_el.style.position = "absolute";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  /* launch particle.js */
  if(canvas != null){
    var emitter1 = new ParticleEmitter(params, tag_id);
  }
};


particleEmitterJS(null, 'particles-js');
