/**
 * Created by linxiaodan on 17-8-14.
 * 聊天界面
 */

module.exports = {
    'GET /': async (ctx, next) => {     //根据cookie验证身份，否则进入登录界面
        let user = ctx.state.user;
        if (user){
            ctx.render('room.html', {
                user: user
            })
        } else {
            ctx.response.redirect('/signin');
        }
    }
};
