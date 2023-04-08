import './style.css'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
import { Color3 } from "@babylonjs/core/Maths/math.color.js"
import { Engine } from '@babylonjs/core/Engines/engine.js'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
import { Mesh } from "@babylonjs/core/Meshes/mesh"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js"
import { Scene } from '@babylonjs/core/scene.js'
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js"
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js'
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience.js'

import * as cannon from "cannon";
window.CANNON = cannon;


// Required for EnvironmentHelper
import "@babylonjs/core/Materials/Textures/Loaders"
import '@babylonjs/loaders/glTF'
import '@babylonjs/core/Materials/Node/Blocks'
import '@babylonjs/core/Animations/animatable'
import { AbstractMesh, CannonJSPlugin, PhysicsImpostor, Ray, WebXRAbstractMotionController, WebXRInputSource } from '@babylonjs/core'

var ballImpluseFactor = 20;
var ballSize = 0.5;
function throwBall() {
  const sphereD = ballSize;
  const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 16, diameter: sphereD }, scene)
  sphere.position.x = 0
  sphere.position.y = 2;
  sphere.position.z = 0

  const rMat = new StandardMaterial("matR", scene)
  rMat.diffuseColor = new Color3(1.0, 0, 0)
  sphere.material = rMat;

  sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

  sphere.physicsImpostor.applyImpulse(new Vector3(ballImpluseFactor, 0, 0), sphere.getAbsolutePosition());

  setTimeout(() => { throwBall() }, 1000 * 5);
}

// Create a canvas element for rendering
const app = document.querySelector<HTMLDivElement>('#app')
const canvas = document.createElement('canvas')
app?.appendChild(canvas)

// Create engine and a scene
const babylonEngine = new Engine(canvas, true)
const scene = new Scene(babylonEngine)

// Add a basic light
new HemisphericLight('light1', new Vector3(0, 10, 0), scene)

// Create a default environment (skybox, ground mesh, etc)
const envHelper = new EnvironmentHelper({
  skyboxSize: 30,
  groundColor: new Color3(0.5, 0.5, 0.5),
}, scene)

// Add physics to the scene
var gravityVector = new Vector3(0, -9.81, 0);
var physicsPlugin = new CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);

// Create a large flat floor mesh and add it to the scene
var groundSize = 3000;
var ground = MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
var material = new StandardMaterial("material", scene);
material.diffuseColor = new Color3(0, 1, 0); // Green color
ground.material = material;

// Add physics to the ground
ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

// Add a camera for the non-VR view in browser
const camera = new ArcRotateCamera("Camera", -(Math.PI / 4) * 3, Math.PI / 4, 10, new Vector3(0, 0, 0), scene);
camera.attachControl(true)


throwBall();

// Create a long and skinny box
const bigStick = MeshBuilder.CreateBox("longBox", { height: 0.05, width: 0.05, depth: 0.5 }, scene);
bigStick.physicsImpostor = new PhysicsImpostor(bigStick, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

console.log(bigStick);



// Setup default WebXR experience
// Use the enviroment floor to enable teleportation
//setupBatHandler()


// Run render loop
babylonEngine.runRenderLoop(() => {
  scene.render()
})



// somewhere in your code

const controllerRay = new Ray(new Vector3(), new Vector3());

WebXRDefaultExperience.CreateAsync(scene, {
  floorMeshes: [envHelper?.ground as Mesh],
  optionalFeatures: true,
}).then((defaultExperience) => {  //
     defaultExperience.input.onControllerAddedObservable.add((controller : WebXRInputSource) => {
         // hands are controllers to; do not want to go do this code; when it is a hand
         const isHand = controller.inputSource.hand;
         if (isHand) return;

         controller.onMotionControllerInitObservable.add((motionController : WebXRAbstractMotionController) =>{
          const frameObserver = defaultExperience.baseExperience.sessionManager.onXRFrameObservable.add(() => {
            controller.getWorldPointerRayToRef(controllerRay, true);
            bigStick.position.x = controllerRay.origin.x;
            bigStick.position.y = controllerRay.origin.y;
            bigStick.position.z = controllerRay.origin.z;
          });
         });
     });
});



/*
void Promise.all([
  import('@babylonjs/core/Legacy/legacy'),
  import('@babylonjs/core/Debug/debugLayer'),
  import('@babylonjs/inspector'),
]).then(() =>
    scene.debugLayer.show({
      handleResize: true,
      embedMode: true,
      overlay: true,
    }),
)
*/


