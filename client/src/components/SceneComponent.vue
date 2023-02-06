<template>
  <div ref="container" id = 'scene_div'>
    <button class = 'load_glb' @click="clickGlbInput">Upload GLB</button>
    <input type = 'file' id = 'load_glb_input' @change="uploadGLB" />
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import LoaderGLB from '../classes/LoaderGLB'
import LoaderFile from '../classes/LoaderFile'

let getLoadersContext = () => ({})

export default {
  setup () {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = true

    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
    hemiLight.position.y = 3000
    scene.add(hemiLight)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.y = 3000
    light.position.x = 100
    light.rotation.x =-Math.PI / 2
    light.castShadow = true
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 5000
    scene.add(light)

    const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
    const planeMaterial = new THREE.MeshStandardMaterial()
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -2
    scene.add(plane)

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshStandardMaterial()
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.rotation.x = Math.PI / 4
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube)

    camera.position.z = 5
    controls.update()

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })

    const LoaderGlbInst = new LoaderGLB(scene)
    LoaderGlbInst.init()

    const LoaderFileInst = new LoaderFile()

    getLoadersContext = () => ({ LoaderGlbInst, LoaderFileInst })

    return {
      renderer,
      scene,
      camera,
      controls
    }
  },
  mounted () {
    this.$refs.container.appendChild(this.renderer.domElement)
    this.animate()
  },
  methods: {
    animate () {
        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera)
        this.controls.update()
    },
    async uploadGLB (e) {
      const { LoaderGlbInst, LoaderFileInst } = getLoadersContext()
      const dataUrl = LoaderFileInst.getDataUrl(e)
      const mesh = await LoaderGlbInst.importBIN(dataUrl)

      const geometry = mesh.geometry
      geometry.computeBoundingBox()
      const center = new THREE.Vector3()
      geometry.boundingBox.getCenter(center)

      console.log(center)
      this.controls.target = center
      
    },
    clickGlbInput () {
      const input = document.getElementById('load_glb_input')
      if (input) input.click()
    }
  }
}
</script>

<style>
.load_glb {
  position: absolute;
  left: 1%;
  top: 1%;
}
#load_glb_input {
  display: none;
}
#scene_div {
  position: fixed;
}
</style>
