import { fabric } from 'fabric'
import { throttle } from 'lodash'

import useCanvasPropertyHook from './useCanvasProperty'

// var textProperties = ['angle', 'backgroundColor', 'clipTo', 'fill', 'fillRule', 'flipX', 'flipY', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'globalCompositeOperation', 'height', 'id', 'left', 'letterSpace', 'lineHeight', 'opacity', 'originX', 'originY', 'path', 'scaleX', 'scaleY', 'shadow', 'stroke', 'strokeDashArray', 'strokeLineCap', 'strokeLineJoin', 'strokeMiterLimit', 'strokeWidth', 'text', 'textAlign', 'textBackgroundColor', 'textDecoration', 'top', 'transformMatrix', 'useNative', 'visible', 'width'];

class useCanvasMapHook {
    static drawTypeArr: Array<number> = [1, 2, 3, 12]
    public canvas: any;
    private mouseDownX: number = 0;
    private mouseDownY: number = 0;
    private mouseUpX: number = 0;
    private mouseUpY: number = 0;
    private drawType: number = 0;   //  画笔类型
    private updateDrawTypeIndex: (param?: any) => void = () => { }

    private useCanvasProperty: any

    constructor({ canvasId, updateDrawTypeIndex, getActiveProperty }: any) {
        this.canvas = new fabric.Canvas(canvasId, {
            includeDefaultValues: false,
            backgroundColor: "white",
            preserveObjectStacking:true
        });

        this.useCanvasProperty = new useCanvasPropertyHook({
            canvas: this.canvas,
            getActiveProperty
        })
        this.updateDrawTypeIndex = updateDrawTypeIndex
        this.canvas.on("mouse:down", (param: any) => { this._setMouseDownXY(param) });
        this.canvas.on("mouse:up", (param: any) => { this._setMouseUpXY(param) });
        // this.canvas.on("mouse:move", throttle((param: any) => { this._mouseMoving(param) }, 200))
        // this.canvas.on("mouse:move", (param: any) => { this._mouseMoving(param) })
    }


    // 加载画布数据
    public loadCanvas(data: any) {
        this.canvas.loadFromJSON(data)
    }

    public setDrawType(drawType: number, innerSetFLag = true) {
        // 设置图形不可选中
        if (drawType > 0) {
            // start to draw
            this.canvas.discardActiveObject()
            this.setAllObjectState("selectable", false)
            this.canvas.renderAll();
        }
        if (drawType === 0) {
            // finish draw
            this.setAllObjectState("selectable", true)
            this.canvas.renderAll();
        }

        this.drawType = drawType

        if (innerSetFLag) {
            // 如果是内部修改，需要通知上层--修改state.drawType
            this.updateDrawTypeIndex(drawType)
        }

        this._cleanXY()
    }

    // 鼠标按下
    private _setMouseDownXY(param: any) {
        if (this.canvas.isDrawingMode) return
        const flag = useCanvasMapHook.drawTypeArr.includes(this.drawType)
        if (!flag) {
            // 获取 点击元素 属性
            this.useCanvasProperty.getObjProperty()
        } else {
            const { e: { offsetX, offsetY } } = param
            this.mouseDownX = offsetX
            this.mouseDownY = offsetY
        }
    }

    // 鼠标抬起
    private _setMouseUpXY(param: any) {
        if (this.canvas.isDrawingMode) return
        const flag = useCanvasMapHook.drawTypeArr.includes(this.drawType)
        if (!flag) return
        const { e: { offsetX, offsetY } } = param
        this.mouseUpX = offsetX
        this.mouseUpY = offsetY

        const { width, height } = this._computeRectSize()
        if (width > 4 && height > 4) {
            // 根据 drawType 画不同图形
            this._drawTypeMap()
        }

        this.setDrawType(0, true)
    }

    //  鼠标移动中
    private _mouseMoving(param: any) {
        const flag = this.drawType > 0 && this.mouseDownX > 0 && this.mouseDownY > 0
        if (!flag) return
    }

    // 清空坐标位置
    private _cleanXY() {
        this.mouseDownX = 0
        this.mouseDownY = 0
        this.mouseUpX = 0
        this.mouseUpY = 0
    }

    // Map 画图方法 映射
    private _drawTypeMap() {

        switch (this.drawType) {
            case 0:
                break
            case 1:
                this._drawRect()
                break
            case 2:
                this._drawCircle()
                break
            case 3:
                this._drawTriangle()
                break
            case 12:
                this._drawText()
        }
    }

    // 统一 在画的时候，设置属性
    private _draw(obj: any) {
        obj.selectable = false
        // obj.preserveObjectStacking = false
        this.canvas.add(obj)
    }

    private _getObjectBasicProperty() {
        return {
            fill: 'rgb(123,123,132)',
            strokeWidth: 3,
            stroke: 'red',
        }
    }

    private _getDrawStartPoint() {
        const left = this.mouseDownX < this.mouseUpX ? this.mouseDownX : this.mouseUpX
        const top = this.mouseDownY < this.mouseUpY ? this.mouseDownY : this.mouseUpY
        return { left, top }
    }

    // 计算矩形尺寸
    private _computeRectSize() {
        const { left, top } = this._getDrawStartPoint()
        const width = Math.abs(this.mouseDownX - this.mouseUpX)
        const height = Math.abs(this.mouseDownY - this.mouseUpY)
        return { top, left, width, height }
    }

    // 画矩形
    public _drawRect() {
        const { top, left, width, height } = this._computeRectSize()
        const rect: any = new fabric.Rect({
            top,
            left,
            width,
            height,
            ...this._getObjectBasicProperty()
        });
        this._draw(rect)
    }

    // 计算圆的尺寸
    private _computeCircleSize() {
        const { top, left, width, height } = this._computeRectSize()
        const radius = width > height ? height : width
        return { top, left, radius: radius / 2 }
    }

    // 画圆形
    private _drawCircle() {
        const { top, left, radius } = this._computeCircleSize()
        const circle = new fabric.Circle({
            top,
            left,
            radius,
            ...this._getObjectBasicProperty()
        })
        this._draw(circle)
    }

    // 计算三角形形状
    private _computeTriangleSize() {
        return this._computeRectSize()
    }

    // 画三角形
    private _drawTriangle() {
        const { top, left, width, height } = this._computeTriangleSize()
        const triangle = new fabric.Triangle({
            top, left, width, height, ...this._getObjectBasicProperty()
        })
        this._draw(triangle)
    }

    public _drawText() {
        const { top, left } = this._computeTriangleSize()
        const iText = new fabric.IText('please write here...', {
            left,
            top,
            stroke: '',
            fontFamily: "Times New Roman",
            fontWeight: 'bold'
        })
        this.canvas.add(iText).setActiveObject(iText)
        // 激活输入状态
        iText.enterEditing()
    }

    // 设置所有对象属性
    public setAllObjectState(property: string, state: any) {
        this.canvas.getObjects().forEach((e: any) => {
            e[property] = state
        });
    }

    // 删除对象
    public removeObjects() {
        const objs = this.canvas.getActiveObjects()
        objs.forEach((e: any) => {
            this.canvas.remove(e)
        });
    }

    // 开启自由画笔
    public startFreeDraw(flag: boolean) {
        this.canvas.isDrawingMode = flag
        if (!flag) return
        this.canvas.freeDrawingBrush.color = 'red'
        this.canvas.freeDrawingBrush.width = 5
        // this.canvas.freeDrawingBrush.strokeDashArray = [20, 50]
        this.canvas.freeDrawingBrush.limitedToCanvasSize = true // 画笔 不 超出画布可视范围
        this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: 10,
            offsetX: 10,
            offsetY: 10,
            affectStroke: true,
            color: '#30e3ca'
        })
    }

    // insert pic
    public insertPic(src: any) {

        const Img = new Image()
        Img.src = src
        Img.onload = () => {

            fabric.Image.fromURL(src, (img: any) => {
                img.fill = ""
                img.stroke = ""
                this.canvas.add(img)
                // this.canvas.sendToBack(img)
            });
        }

    }

    // 设置缩放
    public setCanvasScale(flag: boolean) {
        const activeObj = this.canvas.getActiveObject()
        if (activeObj) {
            if (!flag) {
                activeObj.set({ scaleX: activeObj.scaleX - 0.1 })
                activeObj.set({ scaleY: activeObj.scaleY - 0.1 })
                this.canvas.renderAll()
            } else {
                activeObj.set({ scaleX: activeObj.scaleX + 0.1 })
                activeObj.set({ scaleY: activeObj.scaleY + 0.1 })
                this.canvas.renderAll()
            }
        } else {
            if (!flag) {
                // 缩小
                this.canvas.getObjects().forEach((e: any) => {
                    e.set({ scaleX: e.scaleX - 0.1 })
                    e.set({ scaleY: e.scaleY - 0.1 })
                    this.canvas.renderAll()
                });
            } else {
                this.canvas.getObjects().forEach((e: any) => {
                    e.set({ scaleX: e.scaleX + 0.1 })
                    e.set({ scaleY: e.scaleY + 0.1 })
                    this.canvas.renderAll()
                });
            }
        }
    }

    // 设置元素属性
    public updateActiveProperty(param: any) {
        this.useCanvasProperty.updateActiveProperty(param)
    }

    public saveCanvasToPic = () => {
        const dataURL = this.canvas.toDataURL({
            width: this.canvas.width,
            height: this.canvas.height,
            left: 0,
            top: 0,
            format: "jpg",
        });
        const link = document.createElement("a");
        link.download = "图片";
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

}

export { useCanvasMapHook }