import './style.css'
import {
  Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry,
  MeshBasicMaterial, Mesh, Quaternion,
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import gsap from 'gsap'

const app = document.getElementById('app')
let appDims = app.getBoundingClientRect()
let nextFrame = null
let resetTl = new gsap.timeline()

const camera = new PerspectiveCamera(75, appDims.width/appDims.height, 0.1, 1000)
camera.position.z = 5

const iniQ = new Quaternion().copy(camera.quaternion)

const scene = new Scene()

const renderer = new WebGLRenderer()
renderer.setSize(appDims.width, appDims.height)
renderer.render(scene, camera)

const geo = new BoxGeometry(1, 1, 1)
const mat = new MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new Mesh(geo, mat)
scene.add(mesh)

const controls = new TrackballControls(camera, app)
controls.noZoom = true
controls.noPan = true

app.appendChild(renderer.domElement)
app.addEventListener('touchstart', handleTouchStart)
app.addEventListener('touchend', handleTouchEnd)
app.addEventListener('mousedown', handleTouchStart)
app.addEventListener('mouseup', handleTouchEnd)

animate()

function animate() {
  nextFrame = requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()
}

function handleTouchStart(e) {
  resetTl.kill()
  // cancelAnimationFrame(nextFrame)
  // nextFrame = requestAnimationFrame(animate)
}

function handleTouchEnd(e) {
  reset()
}

function reset() {
  const quat = new Quaternion().copy(camera.quaternion)

  resetTl = new gsap.timeline({ onComplete: onResetComplete })
  resetTl.to(controls.object.up, { duration: 1, ...controls.up0 }, 0)
  resetTl.to(controls.object.position, { duration: 1, ...controls.position0 }, 0)
  resetTl.to(controls.target, { duration: 1, ...controls.target0 }, 0)
  resetTl.to({}, {
    duration: 1,
    onUpdate: function() {
      camera.quaternion.slerpQuaternions(quat, iniQ, this.progress());
    },
  }, 0)
}

function onResetComplete() {
  console.log('finished reset')
  // cancelAnimationFrame(nextFrame)
}