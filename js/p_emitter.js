var pEJS = function(params, tag_id) {
  var particle = new particleJS(params, tag_id);
  console.log(particle);
  particle.fn.createParticle();
  particle.fn.drawParticles();
};


/* ---------- pEmitterJS.js functions - start ------------ */

window.pEmitterJSDom = [];

window.pEmitterJS = function(tag_id, params) {

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

  /* pEmitterJS elements */
  var pEmitterJS_tag = document.getElementById(tag_id),
      pEmitterJS_canvas_class = 'particles-emitter-js-canvas-el',
      exist_canvas = pEmitterJS_tag.getElementsByClassName(pEmitterJS_canvas_class);

  /* remove canvas if exists into the pEmitterJS target tag */
  if(exist_canvas.length){
    while(exist_canvas.length > 0){
      pEmitterJS_tag.removeChild(exist_canvas[0]);
    }
  }

  /* create canvas element */
  var canvas_el = document.createElement('canvas');
  canvas_el.className = pEmitterJS_canvas_class;

  /* set size canvas */
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  /* launch particle.js */
  if(canvas != null){
    pEmitterJSDom.push(new pEJS(params, tag_id));
  }

};
