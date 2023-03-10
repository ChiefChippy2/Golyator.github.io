import * as THREE from "../node_modules/three/build/three.module.js";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

//global declaration
let scene;
let camera;
let renderer;
const canvas = document.getElementById("webgl");
scene = new THREE.Scene();
const fov = 50;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 2000;

//camera
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 8;
camera.position.x = 0;
camera.position.z = 25;
scene.add(camera);

//default renderer
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.setClearColor(0x000000, 0.0);

//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.1,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 1.4; //intensity of glow
bloomPass.radius = 0.1;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//sun object
const color = new THREE.Color("#FDB813");
const geometry = new THREE.IcosahedronGeometry(10, 50);
const material = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("texture/sun.jpg"),
  side: THREE.BackSide,
  transparent: true,
});

const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 0, 0);
sphere.layers.set(1);
scene.add(sphere);


//planet
const planetColor = new THREE.Color("#FDB813");
const planetGeometry = new THREE.IcosahedronGeometry(3, 50);
const planetMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("texture/earth2.jpg"),
  side: THREE.BackSide,
  transparent: true,
});

const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.set(0, 0, 0);
planet.layers.set(1);
scene.add(planet);

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(220, 164, 164);

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("texture/galaxy1.png"),
  side: THREE.BackSide,
  transparent: true,
});

// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.layers.set(1);
scene.add(starMesh);


//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientlight);



//resize listner
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);



//animation loop
const animate = () => {
  requestAnimationFrame(animate);
  starMesh.rotation.x += 0.0003;
  starMesh.rotation.y += 0.0003;
  sphere.rotation.y += 0.001;
  sphere.rotation.x += 0.001;
  planet.rotation.y += 0.008;
  planet.rotation.x += 0.002;
  planet.position.x = Math.cos(Date.now()/10000)*100;
  planet.position.y = Math.sin(Date.now()/10000)*100;
  camera.layers.set(1);
  bloomComposer.render();
};

function onDocumentMouseWheel( event ) {
  const zoomMax = 280;
  const zoomMin = 15;
  console.log(camera.position.z)
  camera.position.z = Math.min(Math.max(zoomMin,  camera.position.z - event.wheelDeltaY * 0.05), zoomMax);
}
document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
animate();
