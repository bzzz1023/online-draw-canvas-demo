import React, { useEffect, useState, useRef } from "react"
import { Select } from 'antd';
import './index.css'

import { SketchPicker } from 'react-color'

const fontFamilyOptions = [
    {
        value: "Times New Roman",
        label: "Times New Roman",
    }
]

const fontWeightOptions = [
    {
        value: "normal",
        label: "normal",
    },
    {
        value: "bold",
        label: "bold",
    },
]

const TextPropertyBox = (props: any) => {
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
        props.updateTextProperty({ [state.colorType]: colorVal })
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
        <div className="graph-property-box-container">
            {
                props?.activeObjProperty && (
                    <div style={{ padding: "6px" }}>
                        <div className="graph-property-box-item">
                            <div className="graph-property-box-item-label">字体色</div>
                            <div
                                className="graph-property-box-item-color-showBox"
                                style={{ backgroundColor: props.activeObjProperty.obj.fill }}
                                onClick={(e: any) => {
                                    e.nativeEvent.stopImmediatePropagation()
                                    if (state.colorType) return
                                    state.colorType = "fill"
                                    state.colorPickX = e.clientX - 100
                                    state.colorPickY = e.clientY + 20
                                    setState({ ...state })
                                }}
                            />
                        </div>

                        <div className="graph-property-box-item">
                            <div className="graph-property-box-item-label">字体</div>
                            <Select
                                options={fontFamilyOptions}
                                value={props.activeObjProperty.obj.fontFamily}
                                onChange={(value: any) => {
                                    props.updateTextProperty({ fontWeight: value })
                                }}
                            />
                        </div>

                        <div className="graph-property-box-item">
                            <div className="graph-property-box-item-label">粗细</div>
                            <Select
                                options={fontWeightOptions}
                                value={props.activeObjProperty.obj.fontWeight}
                                onChange={(value: any) => {
                                    props.updateTextProperty({ fontWeight: value })
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

export default TextPropertyBox