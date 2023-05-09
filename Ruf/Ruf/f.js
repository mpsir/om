globalThis.f = {
    use_io: function(socket, next) {
        // debug('socket.handshake session data is %j.', socket.handshake.session);
        next();
    },
    use_app: function(req, res, next) {
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
                App_Index = data.data
                fs.writeFileSync("App-index.js", data.data);
                io.emit('msg', {
                    type: 'Set_App_Index',
                    data: data.data
                })
            }
        }

        if (data.subt_type == "Get_Funs") {
            if (c_back != undefined) {
                console.log("ok");
                console.log(f);
                //var a = JSON.parse(JSONF.stringify(f))
                var a = JSONF.stringify(f)
                c_back(  a ) 
            }
        }
        if (data.subt_type == "Set_App_Funs") {
            if (data.hasOwnProperty('data')) {
                console.clear()
                console.log('msg received', 'Set_App_Funs');
                g.f = JSONF.parse(data.data)
                // g.f = JSONF.parse( JSONF.stringify(data.data) )
                // console.log(g.f);
                fs.writeFileSync("App-funs.json", JSONF.stringify(g.f, null, 2));
                io.emit('msg', {
                    type: 'Set_App_Funs',
                    data: JSON.parse(JSONF.stringify(f))
                })
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