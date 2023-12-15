const imageSize = require("image-size");

export async function findTextures(dir:string, size: number) {
    let pattern = dir ? `db://assets/${dir}/**/*` : "db://assets/**/*";
    
    let images = await Editor.Message.request("asset-db", "query-assets", {
        //@ts-ignore
        type: "image",
        //@ts-ignore
        // ccType: "cc.ImageAsset",
        pattern,
    });
    
    let results:any[] = [];
    // 过滤出指定大小的图片
    images.forEach(async (image: any) => {
        let file = image.file;
        // 读取图片
        let imgInfo = imageSize(file);
        if(imgInfo.width >= size || imgInfo.height >= size) {
            image.width = imgInfo.width;
            image.height = imgInfo.height;
            results.push(image);
            // console.log(image)
        }
    });

    return results;
}