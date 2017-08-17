/**
 * Created by linxiaodan on 17-8-11.
 */
const koa = require('koa');
const app = new koa();

const bodyParser = require('koa-bodyparser');

const templating = require('./templating');

const controller = require('./controller');

const WebSocketServer = require('ws').Server;

const isProduction = process.env.NODE_ENV === 'production';//判断当前环境是否是production环境。

const Cookies = require('cookies');
const url = require('url');

//log: request url
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

//app: get user form cookie
app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '');
    await next();
});

//parse request body
app.use(bodyParser());

//add nunjucks as view
app.use(templating('views', {
    noCache: !isProduction,
    watch: isProduction
}));

//add controller: 处理URL的路由
app.use(controller());

//添加静态文件处理的包，比如获取'static/css/bootstrap.css'的URL为'http://localhost:3000/static/css/bootstrap.css'
if(!isProduction){
    const serve = require('koa-static');
    app.use(serve('.'));
}

let server = app.listen(3000);

//识别用户身份的逻辑
function parseUser(obj){
    if (!obj){
        return
    }
    console.log('try parse:' + obj);
    let s = '';
    if (typeof obj === 'string'){
        s = obj;
    }else if (obj.headers){
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s){
        try{
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        }catch(e){
            //ignore
        }
    }
}

function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
    //将WebSocketServer和koa app绑定到同一个端口，获取koa创建的http.Server的引用，再根据http.server创建WebSocketServer
    //koa app的listen方法返回http.server
    let wss = new WebSocketServer({
        server: server
    });

    //广播方法
    wss.broadcast = function(data){
        wss.clients.forEach(function each(client){
            client.send(data);
        });
    };

    onConnection = onConnection || function() {
        console.log('[WebSocket] connected.');
        };

    wss.on('connection', function(ws){
        let location = url.parse(ws.upgradeReq.url, true);
        console.log('[WebSocketServer] connection: ' + location.href);

        ws.on('message', onMessage || function(msg) {
                console.log('[WebSocket] message received: ' + msg);
            });
        ws.on('close', onClose || function(code, message){
                console.log(`[WebSocket] closed: ${code} - ${message}`);
            });
        ws.on('error', onError || function(err) {
                console.log('[WebSocket] error: '+err);
            });

        if (location.pathname !== '/ws/chat'){
            //close ws
            ws.close(4000, 'Invalid URL');
        }

        //check user
        let user = parseUser(ws.upgradeReq);    //ws.upgradeReq是有个request对象
        if (!user) {
            ws.close(4001, 'Invalid user');
        }
        ws.user = user;
        ws.wss = wss;

        onConnection.apply(ws);
    });
    console.log('WebSocketServer was attached');
    return wss;
}

function onConnect() {
    let user = this.user;
    let msg = createMessage('join', user, `${user.name} joined`);
    this.wss.broadcast(msg);
    //build user list:
    let users = this.wss.clients.map(function (client) {
        return client.user;
    });
    this.send(createMessage('list', user, users));
}

function onMessage(message) {
    console.log(message);
    if (message && message.trim()){
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.broadcast(msg);    //收到消息之後進行廣播
    }
}

function onClose() {
    let user = this.user;
    let msg = createMessage('left', user, `${user.name} is left`);
    this.wss.broadcast(msg);
}

var messageIndex = 0;
function createMessage(type, user, data){
    messageIndex ++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);

console.log('\napp started at port 3000...');