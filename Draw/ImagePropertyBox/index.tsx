import React, { useEffect, useState, useRef } from "react"
import './index.css'

import { SketchPicker } from 'react-color'

const ImagePropertyBox = (props: any) => {
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
        document.addEventListener('click', closeColorPicker)
        return () => {
            document.removeEventListener('click', closeColorPicker)
        }
    }, [])

    return (
        <div className="image-property-box-container">
            {
                props?.activeObjProperty && (
                    <div style={{padding: "6px"}}>
                        <div className="image-property-box-item">
                            <div className="image-property-box-item-label">背景色</div>
                            <div
                                className="image-property-box-item-color-showBox"
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

export default ImagePropertyBox