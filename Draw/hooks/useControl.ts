
export const useControlHook = (state: any, setState: any, CanvasRef: any) => {

    // 保存画布信息
    const saveCanvas = () => {
        const data = CanvasRef.current.canvas.toJSON()
        localStorage.setItem("canvas_0001", JSON.stringify(data))
    }

    // 本地上传图片
    const localUploadPic = () => {
        window.showOpenFilePicker({
            types: [{
                description: 'Images',
                accept: {
                    'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
                }
            }]
        }).then(async (res: any) => {
            // 生成本地URL
            const fileData = await res[0].getFile();
            const buffer = await fileData.arrayBuffer();
            let src = URL.createObjectURL(new Blob([buffer]));
            CanvasRef.current.insertPic(src)
        }).catch((e: any) => { })
    }

    const localUploadPdf = () => {
        window.showOpenFilePicker({
            types: [{
                description: 'Pdf',
                accept: {
                    //     '*.pdf': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
                }
            }]
        }).then(async (res: any) => {
        }).catch((e: any) => { })
    }


    return { saveCanvas, localUploadPic, localUploadPdf }
}