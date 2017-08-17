/**
 * Created by linxiaodan on 17-8-15.
 */

// sign in:

var index = 0;

module.exports = {
    'GET /signin': async (ctx, next) => {
        let names = '甲乙丙丁戊己庚辛壬葵';
        let name = names[index % 10];
        ctx.render('signin.html', {
            name: `路人${name}`
        });
    },

    'POST /signin': async (ctx, next) => {
        index ++;
        let name = ctx.request.body.name || '路人甲';
        let user = {
            id: index,
            name: name,
            image: index % 10
        };
        let value = Buffer.from(JSON.stringify(user)).toString('base64');
        console.log(`Set cookie value: ${value}`);
        ctx.cookies.set('name', value);
        ctx.response.redirect('/');     //聊天界面
    },

    'GET /signout': async (ctx, next) => {
        ctx.cookies.set('name', '');
        ctx.response.redirect('/signin');
    }
};