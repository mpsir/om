var fs = require('fs');
const path = require('path');

var g = globalThis
g.f = {}
globalThis.r = {
    connected_sockets: 0
}



globalThis.f = {
    use_io(socket, next) {
        // debug('socket.handshake session data is %j.', socket.handshake.session);
        next();
    },
    use_app(req, res, next) {
        // debug('Express `req.session` data is %j.', req.session);
        next();
    },
    socket_connection: function (socket) {
        g.f.socket_connect(socket)
        socket.on('login', function () { g.f.socket_login(socket) });
        socket.on('msg', function (data, c_back) { g.f.socket_msg(socket, data, c_back) });
        socket.on('checksession', function () { g.f.socket_checksession(socket) });
        socket.on('logout', function () { f.socket_logout(socket) });
    },
    socket_login: function (socket) {
        debug('Received login message');
        socket.handshake.session.user = {
            username: 'OSK'
        };
        debug('socket.handshake session data is %j.', socket.handshake.session);

        // socket.handshake.session.save();
        //emit logged_in for debugging purposes of this example
        socket.emit('logged_in', socket.handshake.session);
    },
    socket_checksession: function (socket) {
        debug('Received checksession message');
        debug('socket.handshake session data is %j.', socket.handshake.session);
        socket.emit('checksession', socket.handshake.session);
    },
    socket_logout: function (socket) {
        debug('Received logout message');
        delete socket.handshake.session.user;
        // socket.handshake.session.save();
        //emit logged_out for debugging purposes of this example
        debug('socket.handshake session data is %j.', socket.handshake.session);
        socket.emit('logged_out', socket.handshake.session);
    },
    socket_connect: function (socket) {
        r.connected_sockets++
        console.log('\nconnected_sockets', r.connected_sockets);
        // socket.emit('sessiondata', socket.handshake.session);
    },
    socket_msg: function (socket, data, c_back) {
        if (typeof data == 'object') {
            if (data.hasOwnProperty('type') && (typeof data.type == 'string')) {
                switch (data.type) {
                    case 'admin':
                        globalThis.f.socket_admin_msg(socket, data, c_back)
                        break;

                    default:
                        break;
                }
            } else { console.log(`type not fount or type is not string.`); }
        }
        else { console.log('msg is not object', msg); }
    },
    socket_admin_msg: function (socket, data, c_back) {

        console.log('admin msg received', data.subt_type);

        if (data.subt_type == "Get_App_Index") {
            if (c_back != undefined) { c_back(App_Index) }
        }
        if (data.subt_type == "Set_App_Index") {
            if (data.hasOwnProperty('data')) {
                console.log(data.data);
                // App_Index = data.data
                // fs.writeFileSync("App-index.js", data.data);
                // io.emit('msg', {
                //     type: 'Set_App_Index',
                //     data: data.data
                // })
            }
        }

        if (data.subt_type == "Get_Funs") {
            if (c_back != undefined) { c_back(App_Funs) }
        }
        if (data.subt_type == "Set_App_Funs") {
            if (data.hasOwnProperty('data')) {
                console.log(data.data);
                // App_Funs = data.data
                // //update_f_on_fly()
                // fs.writeFileSync("App-funs.json", JSON.stringify(data.data, null, 2));
                // io.emit('msg', {
                //     type: 'Set_App_Funs',
                //     data: data.data
                // })
            }
        }

    },
    app_login: function (req, res, next) {
        debug('Requested /login');
        req.session.user = {
            username: 'OSK'
        };
        //req.session.save();
        res.redirect('/');
    },
    app_logout: function (req, res, next) {
        debug('Requested /logout');
        delete req.session.user;
        //req.session.save();
        res.redirect('/');
    }
}

function update_f_on_fly() {
    App_Funs.forEach(function(f, f_no){
        eval(`globalThis.f.${f.name} = ${f.value}`);
    });
}

var App_Index = fs.readFileSync(__dirname + '/App-index.js').toString()
var App_Funs = JSON.parse(fs.readFileSync(__dirname + '/App-funs.json').toString())
update_f_on_fly()
console.log(f);
eval(App_Index);
