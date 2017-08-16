/**
 * Created by linxiaodan on 17-8-14.
 * 集成nunjucks
 * 使用nunjucks，给ctx对象绑定一个render方法，在其他地方调用这个方法渲染模板
 */
const nunjucks = require('nunjucks');

function createEnv(path, opts){
    var
        autoescape = opts.autoescape === undefined? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            //文件系统加载器，从指定目录读取模板
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }),{
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters){
        for (var f in opts.filters){
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

function templating(path, opts){
    //创建Nunjucks的env对象
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        //给ctx绑定render函数
        ctx.render = function(view, model){
            //把render后的内容赋值给response.body
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            ctx.response.type = 'text/html';
        };
        //继续处理请求
        await next();
    }
}

module.exports = templating;