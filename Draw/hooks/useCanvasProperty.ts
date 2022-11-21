
const propertyArr = [
    'fill',
    'height',
    'width',
    'left',
    'top',
    'stroke',
    'strokeWidth',
    'fontFamily',
    "fontWeight"
]

export default class useCanvasPropertyHook {
    private canvas: any

    // 方法：给页面返回选中元素属性
    private getActiveProperty: any

    constructor({ canvas, getActiveProperty }: any) {
        this.canvas = canvas
        this.getActiveProperty = getActiveProperty
    }

    public getObjProperty() {
        const obj = this.canvas.getActiveObject()
        if (!obj) {
            const data = {
                backgroundColor: this.canvas.backgroundColor,
                canvasWidth: this.canvas.width,
                canvasHeight: this.canvas.height
            }
            this.getActiveProperty({ obj: data, type: "bg" })
        } else {
            const data: any = {}
            propertyArr.forEach((item, index) => {
                data[item] = obj[item]
            })
            this.getActiveProperty({ obj: data, type: obj.type })
        }
    }

    public updateActiveProperty(param: any) {
        const obj = this.canvas.getActiveObject()
        obj.set(param)
        this.canvas.renderAll()
    }

}