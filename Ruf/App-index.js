var debug = require('debug')('express-socket.io-session:example'),
	app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	session = require('express-session')({
		secret: 'my-secret',
		resave: true,
		saveUninitialized: true
	}),
	sharedsession = require('../');

app.use(session);

io.use(
	sharedsession(session, { autoSave: true })
);

app.use('*', function (req, res, next) { f.use_app(req, res, next) });
io.use(function (socket, next) { f.use_io(socket, next) });
app.use(require('express').static(__dirname + '/WWW'));
app.use('/login', function (req, res, next) { f.app_login(req, res, next) });
app.use('/logout', function (req, res, next) { f.app_logout(req, res, next) });

io.on('connection', function (socket) { f.socket_connection(socket) });
server.listen(8080);
