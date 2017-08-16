/**
 * Created by linxiaodan on 17-8-14.
 * 登录，URL处理函数
 */

// //登录界面
// var fn_index = async (ctx, next) => {
//     ctx.response.body = `<h1>Index</h1>
//         <form action="/signin" method="post">
//             <p>Name:<input name="name" value="koa"></p>
//             <p>Password: <input name="password" type="password"></p>
//             <p><input type="submit" value="Submit"></p>
//         </form> `
// };
//
// //登录判断
// var fn_signin = async (ctx, next) => {
//     var
//         name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`sign in with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345'){
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     }
//     else{
//         ctx.response.body = `<h>Login failed!</h><p><a href="/">Try again</a></p>`
//     }
// };
//
// module.exports = {
//     'GET /': fn_index,
//     'POST /signin': fn_signin
// };

/*
module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome'
        });
    }
};*/

module.exports = {
    'GET /': async (ctx, next) => {
        let user = ctx.state.user;
        if (user){
            ctx.render('room.html', {
                user: user
            })
        } else {
            ctx.response.redirect('/signin');
        }
    }
}
