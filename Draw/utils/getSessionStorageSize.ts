 // 查看保存字节大小
 export function getSessionStorageSize(key: any) {
    const item = sessionStorage.getItem(key);
    let size = JSON.stringify(item).length * 2;
    const arr = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    let sizeUnit = 0;

    while (size > 1024) {
        size /= 1024;
        ++sizeUnit;
    }
    return `${key}的大小为：${size.toFixed(2)}${arr[sizeUnit]}`;
}