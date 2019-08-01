let nShapeArray = (value, ...shape) => {
    if (shape.length === 0) return value;
    let result = new Array(shape[0]);
    let arg = shape.slice(1);
    for (let i = 0; i < shape[0]; i++)
        result[i] = nShapeArray(value, ...arg);
    return result;
};
// 生成任意shape的数组
