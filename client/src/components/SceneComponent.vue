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

let getLoadersContext = () => ({})

export default {
  setup () {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = true

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5
    controls.update()

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })

    const LoaderGlbInst = new LoaderGLB(scene)
    getLoadersContext = () => ({ LoaderGlbInst })

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
    uploadGLB (e) {
      const { LoaderGlbInst } = getLoadersContext()
      LoaderGlbInst.importGLB(e)
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
