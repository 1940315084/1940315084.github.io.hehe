const fs = require('fs');
const cheerio = require('cheerio');
const axios = require("axios");
let imageData = [];
var num = 0;
module.exports = {
    async getPage(url) {
        return {
            res: await axios.get(url)
        }
    },
    //获取当前页面的图片的alt和地址
    getPictureList(page) {
        let list = [];
        const $ = cheerio.load(page.res.data);
        $('.thumbnails li a').children().each((index, item) => {
            let album = {
              name: item.attribs.title, // 图片名称
              url: item.attribs.src, // 图片地址
              desc: item.attribs.alt//图片描述
            }
            list.push(album);
          })
        return list;
    },
    //下载图片到本地
    async downloadImage(imgSrc,title,fileName) {
        let headers = {
            // Referer: list.url,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
          }
         await  axios({
            method: 'get',
            url: imgSrc,
            responseType: 'stream',
            headers
          }).then(function(response) {
            response.data.pipe(fs.createWriteStream(`./src/image/${fileName}`));
          })
            //   console.log(res)
            //   if(res) {
                
            //   }
            
            // imageData.push({
            //     id: ++num,
            //     name: `${fileName}.jpg`,
            //     title: fileName,
            //     url: imgSrc,
            //     desc: desc
            // });
            // fs.writeFileSync("./data/imageData.json", JSON.stringify(imageData,null,'\t'));
        //   })
    },
    async pushData(imgSrc,title,fileName) {
        var  desc = '';
    // var desc = fs.readFileSync(`./src/image/${fileName}.jpg`);
        fs.readFile(`./src/image/${fileName}`,function(err,data) {
            console.log("data",data);
            desc = data.toString("base64");
            // var filename = fileName.split('.')[0];
            console.log(desc)
            imageData.push({
                id: ++num,
                name: fileName,
                title: title,
                url: imgSrc,
                desc: desc
        });
            fs.writeFileSync("./data/imageData.json", JSON.stringify(imageData,null,'\t'));
        });
    }
}