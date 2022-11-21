import {
    ZoomIn, ZoomOut, Clear, AddTextTwo, Save, Next, Back, DownPicture,
    MoveOne, Pencil, Rectangle, Round, Triangle, AddPicture,FilePdf,
    ToTop, DoubleUp, ToBottom, DoubleDown
} from '@icon-park/react'

const divideLine = () => {
    return (
        <div className='tool-box-divide-line' />
    )
}

export const iconArr = [
    {
        com: Save,
        commandIndex: 98,
        label: "保存画布"
    },
    {
        com: DownPicture,
        commandIndex: 99,
        label: "导出图片"
    },
    {
        com: divideLine,
        commandIndex: -9999
    },
    {
        com: ZoomIn,
        commandIndex: 25,
        label: "放大"
    },
    {
        com: ZoomOut,
        commandIndex: 26,
        label: "缩小"
    },
    {
        com: divideLine,
        commandIndex: -9999
    },
    {
        com: Back,
        commandIndex: 65,
        label: "撤回"
    },
    {
        com: Next,
        commandIndex: 66,
        label: "重做"
    },
    {
        com: divideLine,
        commandIndex: -9999
    },
    {
        com: MoveOne,
        commandIndex: 0,
        label: "选中"
    },
    {
        com: Pencil,
        commandIndex: 11,
        label: "画笔"
    },
    {
        com: AddTextTwo,
        commandIndex: 12,
        label: "文字"
    },
    {
        com: AddPicture,
        commandIndex: 13,
        label: "图片"
    },
    {
        com: FilePdf,
        commandIndex: 14,
        label: "PDF"
    },
    {
        com: divideLine,
        commandIndex: -9999
    },
    {
        com: DoubleUp,
        commandIndex: 31,
        label: "上移"
    },
    {
        com: DoubleDown,
        commandIndex: 32,
        label: "下移"
    },
    {
        com: ToTop,
        commandIndex: 33,
        label: "至顶层"
    },
    {
        com: ToBottom,
        commandIndex: 34,
        label: "至底层"
    },
    {
        com: Clear,
        commandIndex: 88,
        label: "清除"
    },
    {
        com: divideLine,
        commandIndex: -9999
    },
    {
        com: Rectangle,
        commandIndex: 1,
        label: "矩形"
    },
    {
        com: Round,
        commandIndex: 2,
        label: "圆形"
    },
    {
        com: Triangle,
        commandIndex: 3,
        label: "三角形"
    },
]