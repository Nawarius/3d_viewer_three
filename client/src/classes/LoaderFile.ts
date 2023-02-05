
class LoaderFile {
    getDataUrl (e: any) {
        const files = e.target.files, f = files[0]
        if (!files.length) return null

        const input: any = document.getElementById('load_glb_input')
        if (input) input.value = null

        return URL.createObjectURL(f)
    }
}

export default LoaderFile