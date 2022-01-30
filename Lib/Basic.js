var mpSir = globalThis.mpSir = {}
    mpSir.BC = new BroadcastChannel('mpSir');
    //bc.postMessage('ReStart');
    mpSir.BC.onmessage = function (ev) { 
      console.log(ev.data); 
      switch (ev.data) {
        case 'ReStart':
          location.reload()
          break;
      
        default:
          break;
      }
    }
    mpSir.Run = function (Data) { eval(Data) }
    mpSir.ReConnected = function () { 
      //alert('reconnected')
      //location.reload() 
    }
    mpSir.AutoLogIn = function(){
        console.log('AutoLogIn Called');
      const cat = localStorage.getItem("mpSir2");
      if (cat) {
        var a = JSON.parse(cat);
        globalThis.mpSir.socket.emit("LogIn", { Name: a.Name, PassWord: a.PassWord });
        console.log('AutoLogIn Called');
        console.log(a);
      }
    }
    mpSir.LogIn = function () {
      function b(name) {
        let password = prompt("Please enter your password", "");
        if (password != null) { c(name, password) }
      }
      function c(name, password) {
        console.log(name);
        console.log(password);
        mpSir.socket.emit('LogIn', { Name:name, PassWord:password})
      }
      let name = prompt("Please enter your user name", "");
        if (name != null) { b(name) }
    }
  
