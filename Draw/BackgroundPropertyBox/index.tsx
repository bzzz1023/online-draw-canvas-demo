import React, { useEffect, useState, useRef } from "react"
import './index.css'

import { Input } from 'antd'

import { SketchPicker } from 'react-color'

const BackgroundPropertyBox = (props: any) => {
    const [state, setState] = useState<any>({
        colorType: null,
        colorPickX: null,
        colorPickY: null,
    })

    // 颜色选择器callback
    const getColorValue = (e: any) => {
        const r = e.rgb.r
        const g = e.rgb.g
        const b = e.rgb.b
        const a = e.rgb.a
        const colorVal = `rgba(${r},${g},${b},${a})`
        props.updateBackgroundProperty({ [state.colorType]: colorVal })
    }

    const closeColorPicker = () => {
        state.colorType = null
        state.colorPickX = null
        state.colorPickY = null
        setState({ ...state })
    }

    useEffect(() => {
        setState({ ...state })
        document.addEventListener('click', closeColorPicker)
        return () => {
            document.removeEventListener('click', closeColorPicker)
        }
    }, [])

    return (
        <div className="background-property-box-container">
            {
                props?.activeObjProperty && (
                    <div style={{ padding: "6px" }}>
                        <div className="background-property-box-item">
                            <div className="background-property-box-item-label">背景色</div>
                            <div
                                className="background-property-box-item-color-showBox"
                                style={{ backgroundColor: props.activeObjProperty.obj.backgroundColor }}
                                onClick={(e: any) => {
                                    e.nativeEvent.stopImmediatePropagation()
                                    if (state.colorType) return
                                    state.colorType = "backgroundColor"
                                    state.colorPickX = e.clientX - 100
                                    state.colorPickY = e.clientY + 20
                                    setState({ ...state })
                                }}
                            />
                        </div>
                        <div className="background-property-box-item">
                            <div className="background-property-box-item-label">宽</div>
                            <Input
                                style={{ width: "120px" }}
                                suffix="px"
                                value={props.activeObjProperty.obj.canvasWidth}
                                onChange={(e: any) => {
                                    props.updateBackgroundProperty({ canvasWidth: e.target.value * 1 })
                                }}
                                onBlur={(e: any) => {
                                    props.CanvasRef.current.canvas.setWidth(e.target.value * 1) 
                                }}
                            />
                        </div>
                        <div className="background-property-box-item">
                            <div className="background-property-box-item-label">高</div>
                            <Input
                                style={{ width: "120px" }}
                                suffix="px"
                                value={props.activeObjProperty.obj.canvasHeight}
                                onChange={(e: any) => {
                                    props.updateBackgroundProperty({ canvasHeight: e.target.value * 1 })
                                }}
                                onBlur={(e: any) => {
                                    props.CanvasRef.current.canvas.setHeight(e.target.value * 1) 
                                }}
                            />
                        </div>
                        {/* 颜色选择器 */}
                        {
                            state.colorType && (
                                <div
                                    style={{
                                        position: "fixed",
                                        top: state.colorPickY,
                                        left: state.colorPickX,
                                    }}
                                    onClick={(e: any) => {
                                        e.nativeEvent.stopImmediatePropagation()
                                    }}
                                >
                                    <SketchPicker
                                        color={props.activeObjProperty.obj[state.colorType]}
                                        onChange={getColorValue}
                                    />
                                </div>

                            )
                        }
                    </div>
                )
            }

        </div>
    )
}

export default BackgroundPropertyBox