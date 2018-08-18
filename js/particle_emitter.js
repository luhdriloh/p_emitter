var config =
{
  "emitter": {
    "active": true,
    "spawn_position": {
      "x": 200,
      "y": 200
    },
    "delay": {
      "start_delay": 0,
      "delta_between_emission": 0
    },
    "general": {
      "number_of_particles": 10,
      "burst": 0,
      "layer": 0,
    }
  },
  "particle_manager": {
    "movement": {

    },
    "physics": {
      "gravity_direction_min": 270,
      "gravity_direction_max": 270,
      "gravity_magnitude": 0,
      "force": 0
    }
  },
  "particles": {
    "radius": {
      "min": 50,
      "max": 100,
      "delta": 0
    },
    "speed": {
      "min": 1,
      "max": 1,
      "delta": 0
    },
    "direction": {
      "min": 0,
      "max": 359,
      "delta": 0
    },
    "color": {
      "start": "#fff",
      "middle": "#fff",
      "end": "#fff"
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
        "src": "",
        "width": 100,
        "height": 100
      }
    },
    "lifetime": {
      "min": 60,
      "max": 60
    },
  }
};

var pEmitterJS = function(params, tag_id) {
  // create a particle manager here

  var particle = new particleManager(params, tag_id);
  console.log(particle);
  particle.fn.createParticles(1);
  doShit(particle);
};

async function doShit(particle) {
  for (var i = 0; i < 1000; i++) {
    particle.fn.drawParticles();
    await sleep(10);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ---------- particleEmitterJS.js functions - start ------------ */

window.pEmitterJSDom = [];

window.particleEmitterJS = function(tag_id, params) {

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
    pEmitterJSDom.push(new pEmitterJS(params, tag_id));
  }

};
