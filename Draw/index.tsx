import './index.css'
import { throttle } from 'lodash'

import React, { useEffect, useState, useRef } from "react"

import { useCanvasMapHook } from './hooks/useCanvasMap'
import TopToolBox from './TopToolBox'

import GraphtPropertyBox from './GraphtPropertyBox'
import BackgroundPropertyBox from './BackgroundPropertyBox'
import TextPropertyBox from './TextPropertyBox'
import ImagePropertyBox from './ImagePropertyBox'

import { useControlHook } from './hooks/useControl'

import {message} from 'antd'

const Draw: React.FC = (props: any) => {
    const CanvasContainerEl = useRef<any>(null)

    const CanvasRef = useRef<any>(null)

    const [state, setState] = useState<any>({
        drawTypeIndex: 0,
        activeObjProperty: null
    })

    const { saveCanvas, localUploadPic, localUploadPdf } = useControlHook(state, setState, CanvasRef)

    // 加载画布
    const loadCanvas = () => {
        const childNodes = CanvasContainerEl.current.children
        if (childNodes.length) {
            CanvasContainerEl.current.removeChild(childNodes[0])
        }

        const CANVAS: any = document.createElement("CANVAS");

        CANVAS.width = CanvasContainerEl.current.offsetWidth
        CANVAS.height = CanvasContainerEl.current.offsetHeight
        CANVAS.style.border = "1px solid rgb(220,220,220)"
        CanvasContainerEl.current.appendChild(CANVAS)

        CanvasRef.current = new useCanvasMapHook({
            canvasId: CANVAS,
            updateDrawTypeIndex,
            getActiveProperty,
            parentContainerWidth: CanvasContainerEl.current.offsetWidth
        })

        const canvasData = localStorage.getItem("canvas_0001")
        if (!canvasData) return
        CanvasRef.current.loadCanvas(canvasData)

        const activeObjProperty = {
            obj: {
                backgroundColor: CanvasRef.current.canvas.backgroundColor,
                canvasWidth: CanvasRef.current.canvas.width,
                canvasHeight: CanvasRef.current.canvas.height
            },
            type: "bg"
        }

        state.activeObjProperty = activeObjProperty
        setState({ ...state })
    }

    // 获取icon索引
    const getDrawTypeIndex = (index: number) => {
        CanvasRef.current.canvas.isDrawingMode = false
        if ([0, 1, 2, 3, 11, 12].includes(index)) {
            CanvasRef.current.canvas.discardActiveObject()
            CanvasRef.current && CanvasRef.current.setDrawType(index, false)
            state.activeObjProperty = null
            state.drawTypeIndex = index
            setState({ ...state })
        }

        if ([13, 88].includes(index)) {
            state.activeObjProperty = null
            setState({ ...state })
        }
        switch (index) {
            case 98:
                saveCanvas()
                message.success("success~~")
                break;
            case 99:
                CanvasRef.current.saveCanvasToPic()
                break;
            case 25:
                CanvasRef.current.setCanvasScale(true)
                break;
            case 26:
                CanvasRef.current.setCanvasScale(false)
                break;
            case 31:
                CanvasRef.current.canvas.bringForward(CanvasRef.current.canvas.getActiveObject())
                break
            case 32:
                CanvasRef.current.canvas.sendBackwards(CanvasRef.current.canvas.getActiveObject())
                break
            case 33:
                CanvasRef.current.canvas.bringToFront(CanvasRef.current.canvas.getActiveObject())
                break
            case 34:
                CanvasRef.current.canvas.sendToBack(CanvasRef.current.canvas.getActiveObject())
                break
            case 65:
                // 撤回
                message.info("under developing~~")
                break;
            case 66:
                // 重做
                message.info("under developing~~")
                break;
            case 11:
                CanvasRef.current.startFreeDraw(true)
                break;
            case 13:
                localUploadPic()
                break;
            case 14:
                message.info("under developing~~")
                // localUploadPdf()
                break;
            case 88:
                CanvasRef.current.removeObjects()
                break;
        }
    }

    // 更新 画笔类型
    const updateDrawTypeIndex = (index: number) => {
        state.activeObjProperty = null
        state.drawTypeIndex = index
        setState({ ...state })
    }

    // 获取 点击元素属性
    const getActiveProperty = (param: any) => {
        state.activeObjProperty = param
        setState({ ...state })
    }

    // 更新 矩形 圆形 三角形 对象属性
    const updateActiveProperty = (param: any) => {
        CanvasRef.current.updateActiveProperty(param)
        state.activeObjProperty = {
            obj: {
                ...state.activeObjProperty.obj,
                ...param
            },
            type: state.activeObjProperty.type
        }
        setState({ ...state })
    }

    // 更新背景色属性
    const updateBackgroundProperty = (param: any) => {
        state.activeObjProperty = {
            obj: { ...state.activeObjProperty.obj, ...param },
            type: "bg"
        }
        setState({ ...state })
        if (Object.keys(param).includes('backgroundColor')) {
            CanvasRef.current.canvas.backgroundColor = param.backgroundColor
            CanvasRef.current.canvas.renderAll()
        }
    }

    // 更新 字体 属性
    const updateTextProperty = (param: any) => {
        CanvasRef.current.updateActiveProperty(param)
        state.activeObjProperty = {
            obj: {
                ...state.activeObjProperty.obj,
                ...param
            },
            type: state.activeObjProperty.type
        }
        setState({ ...state })
    }

    // 更新 图片 属性
    const updateImageProperty = () => { }

    const updateCanvasSize = () => {
        CanvasRef.current.canvas.setWidth(CanvasContainerEl.current?.offsetWidth)
        CanvasRef.current.canvas.setHeight(CanvasContainerEl.current?.offsetHeight)
    }

    useEffect(() => {
        loadCanvas()
        // window.addEventListener('resize', updateCanvasSize)

        // return () => {
        //     window.removeEventListener('resize', updateCanvasSize)
        // }
    }, [])

    return (
        <div className='all-container'>
            {/* 上侧工具栏 */}
            <div className='top-tool-container'>

                <TopToolBox
                    getDrawTypeIndex={getDrawTypeIndex}
                    drawTypeIndex={state.drawTypeIndex}
                />
            </div>

            <div className="entire-workspace">
                {/* 左侧画布 */}
                <div className='canvas-container'>
                    <div
                        className='canvas-el-container'
                        ref={CanvasContainerEl}
                    />
                </div>

                {/* 右侧工具栏 */}
                <div style={{ flex: 1 }}>
                    <div className="property-box-topTitle-container">编辑栏</div>
                    {
                        state.activeObjProperty && ['bg'].includes(state.activeObjProperty.type) && (
                            <BackgroundPropertyBox
                                activeObjProperty={state.activeObjProperty}
                                updateBackgroundProperty={updateBackgroundProperty}
                                CanvasRef={CanvasRef}
                            />
                        )
                    }
                    {
                        state.activeObjProperty && ['circle', 'rect', 'triangle', 'graph'].includes(state.activeObjProperty.type) && (
                            <GraphtPropertyBox
                                activeObjProperty={state.activeObjProperty}
                                updateActiveProperty={updateActiveProperty}
                            />
                        )
                    }
                    {
                        state.activeObjProperty && ['i-text'].includes(state.activeObjProperty.type) && (
                            <TextPropertyBox
                                activeObjProperty={state.activeObjProperty}
                                updateTextProperty={updateTextProperty}
                            />
                        )
                    }
                    {
                        state.activeObjProperty && ['image'].includes(state.activeObjProperty.type) && (
                            <ImagePropertyBox
                                activeObjProperty={state.activeObjProperty}
                                updateImageProperty={updateImageProperty}
                            />
                        )
                    }

                </div>
            </div>

        </div >

    )
}

export default Draw