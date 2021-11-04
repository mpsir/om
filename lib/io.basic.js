globalThis.init = true
globalThis.vp = { data: { data: { f: [] } } }
globalThis.vp.socket = io()

globalThis.vp.socket.on('connect', function () {

  if (globalThis.init == true) {
    globalThis.init = false
  }
  else { location.reload(); }

  globalThis.vp.socket.on('re_start', function () {
    location.reload();
  })

  globalThis.vp.socket.on('eval', function (data) { eval(data) })

  globalThis.vp.socket.on('msg', function (msg) {
    globalThis.readMsg(msg)
  })

})

  globalThis.sendMsg = function(opts){
  globalThis.vp.socket.emit(
    'msg',
    {
      type: opts.type,
      data: opts.data
    }
  )
}

globalThis.readMsg = function(msg){
  console.log(msg)
  //sglobalThis.vp.data.data = msg
}
