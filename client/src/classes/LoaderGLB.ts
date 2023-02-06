import { Scene, BufferGeometry, BufferAttribute, Mesh, MeshBasicMaterial, Vector3, MeshLambertMaterial, MeshStandardMaterial } from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

class LoaderGLB {
    public scene: Scene
    private loader: GLTFLoader
    private dracoLoader: DRACOLoader 

    constructor (scene: Scene) {
        this.scene = scene
        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
    }

    public init () {
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')
        this.loader.setDRACOLoader(this.dracoLoader)
    }

    public async importGLB (url: string) {
        await new Promise(res => {
            this.loader.load(url, gltf => {
                res(this.scene.add(gltf.scene))
            })
        })
    }

    public async importBIN () {
        const indicesData = await fetch('custom/index.bin').then(async (r) => await r.arrayBuffer())
        const positionsData = await fetch('custom/position.bin').then(async (r) => await r.arrayBuffer())
        const colorsData = await fetch('custom/color.bin').then(async (r) => await r.arrayBuffer())

        const geometry = new BufferGeometry()

        const indices = new BufferAttribute(new Uint32Array(indicesData), 1)
        const positions = new BufferAttribute(new Float32Array(positionsData), 3)
        const colors = new BufferAttribute(Float32Array.from(new Uint8Array(colorsData), v => v / 255), 4)

        geometry.setIndex(indices)
        geometry.setAttribute('position', positions)
        geometry.setAttribute('color', colors)

        geometry.computeVertexNormals()

        const material = new MeshStandardMaterial({ vertexColors: true })

        const mesh = new Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true

        this.scene.add(mesh)

        return mesh
    }
}

export default LoaderGLB