// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// local from us provided utilities
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';

// custom imports
import { CanvasWidget } from './canvasWidget';
import * as helper from './helper';

// create Settings and create GUI settings
let settings = new helper.Settings();
let gui = helper.createGUI(settings);

let camera = new THREE.PerspectiveCamera();
// create scene
let scene = new THREE.Scene();
// create canvas
let canvasDiv = createWindow("raytracer");
let canvas = new CanvasWidget(canvasDiv, settings.width, settings.height);

function callback(changed: utils.KeyValuePair<helper.Settings>) {
    //console.log("changed", changed);
    switch (changed.key) {
        case "width":
            canvas.changeDimensions(changed.value, settings.height);
            break;
        case "height":
            canvas.changeDimensions(settings.width, changed.value);
            break;
        case "saveImg":
            canvas.savePNG();
            break;
        case "render":
            helper.raytracer(camera, scene, settings, canvas);
            break;
    }
}

function main(){
    // create the main application
    let root = Application("Raytracing");
    root.setLayout([["raytracer", "scene"]]);
    root.setLayoutColumns(["50%", "50%"]);
    root.setLayoutRows(["100%"]);

    // ---------------------------------------------------------------------------
    // adds the callback that gets called on settings change
    settings.addCallback(callback);

    // ---------------------------------------------------------------------------
    let rendererDiv = createWindow("scene"); //createWindow("raytracer") globally defined
    root.appendChild(rendererDiv);
    root.appendChild(canvasDiv);
    
    // ---------------------------------------------------------------------------
    // create content of left window
    gui.__controllers[9].onChange(() => helper.raytracer(camera, scene, settings, canvas));
    gui.__controllers[10].onChange(() => canvas.savePNG());

    // ---------------------------------------------------------------------------
    // create content of right window
    // create renderer
    let renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });

    // create geometry
    helper.setupGeometry(scene);

    // create light
    helper.setupLight(scene);

    // create camera
    helper.setupCamera(camera);

    // create controls
    let controls = new OrbitControls(camera, rendererDiv);
    helper.setupControls(controls);

    let wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();
}

// call main entrypoint
main();
