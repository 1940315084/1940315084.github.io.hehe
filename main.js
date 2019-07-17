const fs = require('fs');
const app = require('./tools/app.js');
const util = require('./tools/utils.js');
let currentPage = 1;
//初始化
const start = () => {
    main(currentPage);
}
const main = async pageNum => {
    console.log(`当前页码：${pageNum}`);
    //根据页码获取页面
    const pageUrl = `${util.originPath}/?pager_offset=${pageNum}`;
    const page = await app.getPage(pageUrl);
    let imglist = app.getPictureList(page);
    //下载本页面中所有图片 
    downloadImage(imglist);
}
// var num = 0;
//下载本页所有图片
let indexx = 1;
const downloadImage = async (list) => {
    let index = 0;
    for(var i = 0; i < list.length; i ++) {
        // var name = list[i].name;
        // var url = list[i].url;
        // if(name.indexOf('/') == name.length - 1) {
        //     name = name.slice("/",name.length - 1);
        // } 
        // console.log(name)
        //将图片转换成二进制存入json文件中
        await app.downloadImage(list[i].url,list[i].name, `${indexx}.jpg`).then(
            app.pushData(list[i].url,list[i].name, `${indexx}.jpg`)
        );
        index ++;
        indexx ++;
    }
    if(index == list.length) {
        console.log(`第${currentPage}下载完成`);
        //进入下一个页面爬取
        if(currentPage < util.maxPage) {
            main(++currentPage);
        }
    }
}

start();