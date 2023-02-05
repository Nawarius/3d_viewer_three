
class LoaderGLB {
    public scene;
    
    constructor (scene: any) {
        this.scene = scene
    }

    private importGLB (e: any) {
        console.log(e)
    }
}

export default LoaderGLB