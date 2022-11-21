import React, { useEffect, useState, useRef } from "react"
import { ZoomIn, ZoomOut, Clear, AddTextTwo, Save, Next, Back, MoveOne, Pencil, Rectangle, Round, Triangle } from '@icon-park/react'

import './index.css'


import { iconArr } from './config'

const DrawTools = (props: any) => {

    const [state, setState] = useState({
        moveIndex: null
    })

    const currentSelectIndex = (drawTypeIndex: number, currentIndex: number) => {
        return drawTypeIndex === currentIndex || state.moveIndex === currentIndex ? "black" : "rgb(180,180,180)"
    }



    return (
        <div className="graphToolsIcon-container">
            {
                iconArr.map((Item: any, index: number) => {
                    if (Item.commandIndex > -1) {
                        return (
                            <div
                                onMouseEnter={() => {
                                    state.moveIndex = Item.commandIndex
                                    setState({ ...state })
                                }}
                                onMouseLeave = {() => {
                                    state.moveIndex = null
                                    setState({ ...state })
                                }}
                                key={index}
                                className={"graphToolsIcon-item"}
                                onClick={() => { props.getDrawTypeIndex(Item.commandIndex) }}
                            >
                                <Item.com size={22} theme="outline" fill={currentSelectIndex(props.drawTypeIndex, Item.commandIndex)} />
                                <div className="graphToolsIcon-item-text">{Item.label}</div>
                            </div>
                        )
                    } else {
                        return (
                            <Item.com key={index} />
                        )
                    }
                })
            }


        </div>
    )
}

export default DrawTools