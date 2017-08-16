/**
 * Created by linxiaodan on 17-8-14.
 * 扫描controllers下的js文件，创建router，绑定URL处理
 */

//导入fs模块
const fs = require('fs');

function addMapping(router, mapping){
    for(var url in mapping){
        //get方法
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);     //URL处理
            console.log(`register URL mapping: GET ${path}`);
        }
        //POST方法
        else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);    //URL处理
            console.log(`register URL mapping: POST ${path}`);
        }
        else{
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir){
    var files = fs.readdirSync(__dirname + dir);//用sync， 因为只在启动时运行一次，不存在性能问题
    var js_files = files.filter((f) => {    //得到js文件
        return f.endsWith('.js');
    });
    //对每个js文件添加到router的get方法中进行URL处理
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + dir + '/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function (dir) {
    let
        controllers_dir = dir || '/controllers',//默认为controllers目录
        router = require('koa-router')();   //URL处理
    addControllers(router, controllers_dir);
    return router.routes();
};