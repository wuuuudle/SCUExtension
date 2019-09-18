let nShapeArray = (value, ...shape) => {
    if (shape.length === 0) return value;
    let result = new Array(shape[0]);
    let arg = shape.slice(1);
    for (let i = 0; i < shape[0]; i++)
        result[i] = nShapeArray(value, ...arg);
    return result;
};
// 生成任意shape的数组
let imRead = (imageSource) => {
    let img = null;
    if (imageSource.constructor === String)
        img = document.getElementById(imageSource);
    else if (imageSource instanceof HTMLElement)
        img = imageSource;

    let canvas = null;
    let ctx = null;

    canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 60;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 180, 60);
    let temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let array = nShapeArray(null, 1, 60, 180, 3);
    array[0].forEach((value, item1, arr) => {
        arr[item1].forEach((value, item2, arr) => {
            arr[item2].forEach((value, item3, arr) => {
                arr[item3] = temp.data[4 * (item1 * 180 + item2) + item3] / 255.0;
            })
        });
    });
    return array;
}
