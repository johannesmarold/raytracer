import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as utils from './lib/utils';
import * as dat from 'dat.gui';
import { CanvasWidget } from './canvasWidget';

/*******************************************************************************
 * Helps to build gui, scene, camera and controls
 ******************************************************************************/

export class Settings extends utils.Callbackable{
  maxDepth: number = 2;
  subsamples: number = 1;
  width: number = 256;
  height: number = 256;
  correctSpheres: boolean = false;
  phong: boolean = false;
  alllights: boolean = false;
  shadows: boolean = false;
  mirrors: boolean = false;
  render: () => void = function(){};
  saveImg: () => void = function(){};
 }

export function createGUI(params: Settings): dat.GUI {
  var gui: dat.GUI = new dat.GUI();

  gui.add(params, "width").name("Width")
  gui.add(params, "height").name("Height")
  gui.add(params, "correctSpheres").name("Correct Spheres")
  gui.add(params, "phong").name("Phong")
  gui.add(params, "alllights").name("All Lights")
  gui.add(params, "shadows").name("Shadows")
  gui.add(params, "mirrors").name("Mirrors")
  gui.add(params, 'maxDepth', 0, 10, 1).name('Max Recursions')
  gui.add(params, "subsamples", 1, 4, 1).name("Subsamples")
  gui.add(params, "render").name("Render")
  gui.add(params, "saveImg").name("Save")
  return gui;
}

export function setupGeometry(scene: THREE.Scene){

  var phongMaterialRed = new THREE.MeshPhongMaterial( {
      color: 0xff0000,
      specular: 0xaaaaaa,
      shininess: 150,
      reflectivity: 0,
  } ) as THREE.MeshPhongMaterial & { mirror: boolean };
  phongMaterialRed.mirror = false;

  var phongMaterialGreen = new THREE.MeshPhongMaterial( {
      color: 0xFFFF00,
      specular: 0xaaaaaa,
      shininess: 150,
      reflectivity: 0,
  } ) as THREE.MeshPhongMaterial & { mirror: boolean };
  phongMaterialGreen.mirror = false;

  var phongMaterialBlue = new THREE.MeshPhongMaterial( {
      color: 0x0000ff,
      specular: 0xaaaaaa,
      shininess: 150,
      reflectivity: 0,
  } ) as THREE.MeshPhongMaterial & { mirror: boolean };
  phongMaterialBlue.mirror = false;

  var phongMaterialTop = new THREE.MeshPhongMaterial( {
      color: 0xffffff,
      specular: 0x111111,
      shininess: 100,
      reflectivity: 0,
  } ) as THREE.MeshPhongMaterial & { mirror: boolean };
  phongMaterialTop.mirror = false;

  var phongMaterialGround = new THREE.MeshPhongMaterial( {
      color: 0x666666,
      specular: 0x111111,
      shininess: 100,
      reflectivity: 0,
  } ) as THREE.MeshPhongMaterial & { mirror: boolean };
  phongMaterialGround.mirror = false;

  var mirrorMaterial = new THREE.MeshPhongMaterial( {
      color: 0xffaa00,
      specular: 0xffffff,
      shininess: 10000,
      reflectivity: 0.8,
  }) as THREE.MeshPhongMaterial & { mirror: boolean };
  mirrorMaterial.mirror = true;

  //var cylinderGeometry = new THREE.CylinderGeometry( 50/300, 50/300, 100/300, 8 );
  var sphereGeometry = new THREE.SphereGeometry( 50/300, 8, 4 );
  var sphereGeometrySmall = new THREE.SphereGeometry( 25/300, 8, 4 );
  var planeGeometry = new THREE.PlaneGeometry( 602/300, 602/300 );
  var boxGeometry = new THREE.BoxGeometry( 100/300, 100/300, 100/300 );
  var sphere = new THREE.Mesh( sphereGeometry, phongMaterialRed );
  sphere.position.set( - 50/300, - 250/300 + 5/300, - 50/300 );
  scene.add(sphere);
  var sphere2 = new THREE.Mesh( sphereGeometry, mirrorMaterial );
  sphere2.position.set( 175/300, - 250/300 + 5/300, - 150/300 );
  scene.add(sphere2);

  var sphere3 = new THREE.Mesh( sphereGeometrySmall, phongMaterialBlue );
  sphere3.position.set( 75/300, - 250/300 + 5/300, - 75/300 );
  sphere3.rotation.y = 0.5;
  scene.add( sphere3 );

  var box = new THREE.Mesh( boxGeometry, mirrorMaterial );
  box.position.set( - 175/300, - 250/300 + 2.5/300, - 150/300 );
  box.rotation.y = 0.25;
  scene.add(box);

  // bottom
  var planebottom = new THREE.Mesh( planeGeometry, phongMaterialGround );
  planebottom.position.set( 0, - 300/300, - 150/300 );
  planebottom.rotation.x = -1.57;
  planebottom.scale.setY(0.6);
  scene.add( planebottom );

  // top
  var planetop = new THREE.Mesh( planeGeometry, phongMaterialTop );
  planetop.position.set( 0, 300/300 , - 150/300 );
  planetop.rotation.x = 1.57;
  planetop.scale.setY(0.6);
  scene.add( planetop );

  // back
  var planeback = new THREE.Mesh( planeGeometry, mirrorMaterial );
  planeback.position.set( 0, 0, - 300/300 );
  scene.add( planeback );

  // left
  var planeleft = new THREE.Mesh( planeGeometry, mirrorMaterial );
  planeleft.rotation.z = 1.57;
  planeleft.rotation.y = 1.57;
  planeleft.position.set( - 300/300, 0, - 150/300 );
  planeleft.scale.setY(0.6);
  scene.add( planeleft );

  // right
  var planeright = new THREE.Mesh( planeGeometry, phongMaterialBlue );
  planeright.rotation.z = 1.57;
  planeright.rotation.y = -1.57;
  planeright.position.set( 300/300, 0, - 150/300 );
  planeright.scale.setY(0.6);
  scene.add( planeright );

  scene.updateMatrixWorld();
  return scene;
};

export function setupLight(scene: THREE.Scene){
  var intensity = 0.7;
  var lights = [];
  var light1 = new THREE.PointLight( 0xffffff, intensity * 2 );
  light1.position.set( 0, 0, 300/300 );
  scene.add(light1);
  lights.push(light1);
  light1.updateMatrixWorld();

  var light2 = new THREE.PointLight( 0xffa500, intensity );
  light2.position.set( - 200/300, - 100/300, 100/300 );
  scene.add(light2);
  lights.push(light2);
  light2.updateMatrixWorld();

  var light3 = new THREE.PointLight( 0x55aaff, intensity );
  light3.position.set( 200/300, 100/300, 100/300 );
  scene.add(light3);
  lights.push(light3);
  light3.updateMatrixWorld();
  return lights;
};

export function setupCamera(camera: THREE.PerspectiveCamera){
  camera.fov = 60;
  camera.far = 1000;
  camera.near = 0.001;
  camera.position.z = 540/300;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return camera
}

export function setupControls(controls: OrbitControls){
 controls.rotateSpeed = 1.0;
 controls.zoomSpeed = 1.2;
 controls.enableZoom = true;
 controls.keys = {LEFT: "KeyA", UP:"KeyW", RIGHT: "KeyD", BOTTOM:"KeyS"};
 controls.listenToKeyEvents(document.body);
 controls.minDistance = 0.00001;
 controls.maxDistance = 9;
 controls.minZoom = 0;
 return controls;
};

export function raytracer(camera: THREE.PerspectiveCamera, scene: THREE.Scene, settings: Settings, canvas: CanvasWidget){
  let ray = new THREE.Raycaster(camera.position, new THREE.Vector3(), camera.near, camera.far);

  for (let x = 0; x < settings.width; x++) {
    for (let y = 0; y < settings.height; y++) {

      // subsampling
      if (settings.subsamples > 1){
        let color = new THREE.Color(0,0,0);
        for (let i = 0; i < settings.subsamples; i++){
          for (let j = 0; j < settings.subsamples; j++){
            let recursionDepth = settings.maxDepth;
            ray.setFromCamera(new THREE.Vector2(((x + i/settings.subsamples)/settings.width)*2-1, -((y + j/settings.subsamples)/settings.height)*2 + 1), camera);
            let subcolor = singleRaytrace(scene, settings, ray);
            color.add(subcolor);
            settings.maxDepth = recursionDepth;
          }
        }
        color.multiplyScalar(1/(settings.subsamples ** 2));
        canvas.setPixel(x, y, color);
      }
      // no subsampling
      else {
        let recursionDepth = settings.maxDepth;
        ray.setFromCamera(new THREE.Vector2((x/settings.width)*2-1, -(y/settings.height)*2 + 1), camera);
        let color = singleRaytrace(scene, settings, ray);
        canvas.setPixel(x, y, color);
        settings.maxDepth = recursionDepth;
      }
    }    
  }
}

function singleRaytrace(scene: THREE.Scene, settings: Settings, ray: THREE.Raycaster){
  let color;
  let intersects = calcIntersects(scene, ray, settings);
  if (intersects.length == 0){
    color = new THREE.Color(0,0,0);
    return color;
    //canvas.setPixel(x, y, new THREE.Color(0,0,0));
  }
  else {
    if (settings.phong){ //&& (intersects[0].object as THREE.Mesh).geometry instanceof THREE.SphereGeometry){
      color = calcPhong(ray, intersects[0], scene, settings);
      // check for mirror
      if (settings.mirrors && ((intersects[0].object as THREE.Mesh).material as THREE.MeshPhongMaterial & {mirror: boolean}).mirror){
        let reflectivity = ((intersects[0].object as THREE.Mesh).material as THREE.MeshPhongMaterial).reflectivity;
        if (settings.maxDepth > 0) {
        settings.maxDepth--;
        let normal = retrieveNormal(intersects[0]);
        let reflectedVector = calcReflectionVector(ray.ray.direction, normal).multiplyScalar(-1);
        let reflectRay = new THREE.Raycaster(intersects[0].point, reflectedVector);
        let mirror = singleRaytrace(scene, settings, reflectRay);
        let interpolatedColor = (color.clone().multiplyScalar(1 - reflectivity)).add(mirror.clone().multiplyScalar(reflectivity));
        color = interpolatedColor.clone();
        return color;
        }
        // recursion anker
        else {
          let mirror = new THREE.Color(0,0,0);
          let interpolatedColor = (color.clone().multiplyScalar(1 - reflectivity)).add(mirror.clone().multiplyScalar(reflectivity));
          color = interpolatedColor.clone();
          return color;        
        }
      }
      // no mirror case
      else{
        return color;
      }
    }
    // no phong case
    else {
      let material = (intersects[0].object as THREE.Mesh).material as THREE.MeshPhongMaterial;
      color = material.color;
      return color;
    }
  }
}


function calcIntersects(scene: THREE.Scene, ray: THREE.Raycaster, settings: Settings){
  let arr = new Array<THREE.Intersection>();
  let sphereIntersect;
  for (let child of scene.children){
    if (settings.correctSpheres && child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry){
      sphereIntersect = calcSphereGeometry(child, ray);
      if(sphereIntersect != undefined){
        arr.push(sphereIntersect);
      }
    }
    else if(child instanceof THREE.Mesh){
      ray.intersectObject(child, false, arr);
    }
  }
  return arr;
}

function calcSphereGeometry(mesh: THREE.Mesh, ray: THREE.Raycaster){
  let geometry = mesh.geometry as THREE.SphereGeometry;
  let c = mesh.position.clone();
  let r = geometry.parameters.radius;
  let o = ray.ray.origin.clone();
  let d = ray.ray.direction.clone().normalize();

  let d_oc = c.clone().sub(o);
  let t_c = d_oc.dot(d);
  let t_in = (r ** 2) - d_oc.lengthSq() + (t_c ** 2);
  if (t_in < 0) return;

  let t_0 = t_c - Math.sqrt(t_in);
  let t_1 = t_c + Math.sqrt(t_in);

  
  if (t_0 > t_1) {
    let temp = t_0;
    t_0 = t_1;
    t_1 = temp;
  }

  if (t_0 < 0) {
    t_0 = t_1;
    if (t_0 < 0) {
      return;
    }
  }
  let t_point = (d.clone().multiplyScalar(t_0)).add(o);
  let distance = (ray.ray.origin.clone().sub(t_point)).length();
  let normal = (t_point.clone().sub(c)).normalize();

  return {
    point: t_point,
    distance: distance,
    normal: normal,
    object: mesh,
  }

}

function calcPhong(ray: THREE.Raycaster, intersect: THREE.Intersection, scene: THREE.Scene, settings: Settings){
  let color = new THREE.Color(0, 0, 0);

  // iterate over light sources
  for(let child of scene.children){
    if(child instanceof THREE.Light){
      // check for shadows
      if (!(settings.shadows && calcShadows(intersect, scene, child.clone(), settings))){
        
      
      // light parameters
        let diffuseReflectance = ((intersect.object.clone() as THREE.Mesh).material as THREE.MeshPhongMaterial).color.clone();
        let specReflectance = ((intersect.object.clone() as THREE.Mesh).material as THREE.MeshPhongMaterial).specular.clone();
        let shininess = ((intersect.object.clone() as THREE.Mesh).material as THREE.MeshPhongMaterial).shininess;
        let lightIntensity = child.clone().color.multiplyScalar(child.intensity).multiplyScalar(4);
        //let intersectPoint = intersect.point.clone().applyMatrix4(intersect.object.matrixWorld);
        //let lightVector = intersectPoint.sub(lights[0].position);
        let lightVector = child.position.clone().sub(intersect.point);
        let attenuation = 1 / lightVector.lengthSq();
        lightVector = lightVector.normalize();

        let normal = retrieveNormal(intersect);

        // diffuse component
        let diffuse = Math.max(lightVector.dot(normal), 0);

        // specular component
        let reflLightDir = calcReflectionVector(lightVector, normal);
        let viewDir = ray.ray.origin.clone().sub(intersect.point).normalize();
        let spec = Math.max(reflLightDir.dot(viewDir), 0);
        spec = Math.min(1, Math.pow(spec, shininess/4));
      
        // calculate color
        let diffcolor = (diffuseReflectance.multiply(lightIntensity).multiplyScalar(diffuse * attenuation));
        let specColor = (specReflectance.multiply(lightIntensity).multiplyScalar(spec * attenuation).multiplyScalar(shininess/50));
        let phong = (new THREE.Color()).addColors(diffcolor, specColor);

        color.add(phong);
      }
      // check for all lights on
      if (settings.alllights == false){
        break;
      }
    }
  }

  return color.clone();
}

function calcShadows(point: THREE.Intersection, scene: THREE.Scene, light: THREE.Light, settings: Settings){
  let ray = new THREE.Raycaster(point.point, light.position.clone().sub(point.point).normalize());
  ray.ray.origin.add(ray.ray.direction.clone().multiplyScalar(10 ** -8));
  let intersects = calcIntersects(scene, ray, settings);
  if (intersects.length > 0){
    //return new THREE.Color("rgb(255, 255, 255)");
    return true;
  }
  //return new THREE.Color("rgb(0, 0, 0)");
  return false;
}

function calcReflectionVector(ray: THREE.Vector3, normal: THREE.Vector3){
  let reflVector = ((normal.clone().multiplyScalar(normal.clone().dot(ray))).multiplyScalar(2).sub(ray)).normalize();
  return reflVector;
}

function retrieveNormal(intersect: THREE.Intersection){
  let normal;
  if (intersect.face == null) {
    normal = intersect.normal as THREE.Vector3;
  }
  else {
    normal = (intersect.face as THREE.Face).normal;
    // mat3(inverse(transpose(modelMatrix))) * vNormal;
    let matrixWorld = intersect.object.matrixWorld.clone();
    normal = normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(matrixWorld)).normalize();
  }
  return normal;
}

/*
function calcSphereGeometry2(mesh: THREE.Mesh, ray: THREE.Raycaster){
  let geometry = mesh.geometry as THREE.SphereGeometry;
  let c = mesh.position.clone();
  let r = geometry.parameters.radius;
  let o = ray.camera.position.clone();
  let d = ray.ray.direction.clone().normalize();

  let L = c.sub(o);
  let tca = L.dot(d); //t_c
  // if (tca < 0) return false;
  let d2 = L.lengthSq() - tca ** 2;
  if (d2 > r ** 2) return;
  let thc = Math.sqrt(r**2 - d2);
  let t0 = tca - thc;
  let t1 = tca + thc;

  if (t0 > t1) {
      let temp = t0;
      t0 = t1;
      t1 = temp;
  }

  if (t0 < 0) {
      t0 = t1; // if t0 is negative, let's use t1 instead
      if (t0 < 0) return; // both t0 and t1 are negative
  }

  let t = t0;

  let t_point = (d.clone().multiplyScalar(t)).add(o);

  let inters = {
  distance : t_point.clone().sub(o).length(),
  point : t_point.clone(),
  object : mesh,
  t_0: t,
  //normal: c.sub(t_point).normalize(),
  normal: t_point.clone().sub(c).normalize(),
  }
  return inters;
}
*/