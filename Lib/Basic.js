//console.clear()
    //ResizeEvent()

if (globalThis.hasOwnProperty('require')) {
  require.config({ paths: { vs: 'https://mpsir.github.io/om/Lib/vs' } })
  window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
  self.MonacoEnvironment = { baseUrl: 'https://mpsir.github.io/om/Lib/' };
  importScripts('https://mpsir.github.io/om/Lib/vs/base/worker/workerMain.js');`)}`
    }
  }
}


function if_not_id(Arr, N){
	var r = false
	Arr.forEach(function(ar, ar_no){
		if(ar.id == N){ r = true
		}
	})
	return r
}
function AddID(Arr, N, OBJ){
//console.log(typeof N)
//console.log(N)

	var b1 = if_not_id(Arr, N)
  	if(! b1){ OBJ.id = N }
  	else { 
  		N=N+1; 
  		//console.log(typeof N)
//console.log(N)
  		AddID(Arr, N, OBJ); 
  	}
}

Array.prototype.AddObj = function (opts = {}) {
  var AddId = opts.AddId === undefined ? true : opts.AddId;
  var AddAtLast = opts.AddAtLast === undefined ? true : opts.AddAtLast;
  var OBJ = opts.OBJ === undefined ? {} : opts.OBJ;
  if (!OBJ.hasOwnProperty('id')) { if (AddId) {
  	AddID(this, (this.length + 1), OBJ) 	
  } }
  if (AddAtLast) { this.splice(this.length, 0, OBJ) }
  else { this.splice(0, 0, OBJ) }
};

Array.prototype.CopyI = function (i) {
  var arr = this;
  localStorage.setItem("CopyItem", JSON.stringify(arr[i]));
 const channel = new BroadcastChannel('my_bus');
 channel.postMessage('abc');
 channel.close();
};

Array.prototype.CopyArr = function (i) {
  var arr = this;
  localStorage.setItem("CopyItem", JSON.stringify(arr));
 const channel = new BroadcastChannel('my_bus');
 channel.postMessage('abc');
 channel.close();
};

Array.prototype.PasteI = function (i) {
var arr = this;
var a = 
    JSON.parse(globalThis.localStorage.getItem('CopyItem'))
    if(a!=null && a != undefined){
    	arr[i] = a
    }  
};

Array.prototype.Move = function (old_index, new_index) {
  var arr = this;
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) { arr.push(undefined); }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

Array.prototype.DelI = function (i) {
  this.splice(i, 1);
};

Array.prototype.AddI = function (opts = {}) {
  var AddAtLast = opts.AddAtLast === undefined ? true : opts.AddAtLast;
  var OBJ = opts.OBJ === undefined ? "" : opts.OBJ;
  if (AddAtLast) { this.splice(this.length, 0, OBJ) }
  else { this.splice(0, 0, OBJ) }
};
Array.prototype.UpI = function (ArrNo) {
  if (ArrNo != 0) { this.Move(ArrNo, ArrNo - 1); }
}; 
Array.prototype.DownI = function (i) {
  if (!(i + 1 == this.length)) { this.Move(i, i + 1); }
};
Array.prototype.DupI = function (
  i, changeID = true, changeName = true
) {
  var a = JSON.parse(JSON.stringify(
    this[i]
  ));
  if (a.hasOwnProperty('id') && changeID) { 
    //a.id = this.length + 1 
    //AddID(this, (this.length + 1), this[i]) 	
  }
  if (a.hasOwnProperty('name') && changeName) { a.name = a.name + "_2"; }
  this.splice(i + 1, 0, a);
  AddID(this, (this.length + 1), a) 	

};
Array.prototype.ToObj = function () {
  return Object.assign({}, JSON.parse(JSON.stringify(this)));
};
Array.prototype.ToKeyObj = function () {
  var a = this.reduce((previousValue, currentValue) => {
    return JSON.parse(JSON.stringify(previousValue))
  })
  return a
};


function loadJS(file) {
  var jsElm = document.createElement("script");
  jsElm.type = "application/javascript";
  jsElm.src = file;
  document.body.appendChild(jsElm);
}



var mpSir = globalThis.mpSir = {}

mpSir.ChangeTitle = function(){
let person = prompt("Please enter page title", "Editor");

if (person != null) {
  document.title = person
} 
}



mpSir.BC = new BroadcastChannel('mpSir');
//bc.postMessage('ReStart');
mpSir.BC.onmessage = function (ev) {
  //console.log(ev.data);
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
mpSir.AutoLogIn = function () {
  //console.log('AutoLogIn Called');
  const cat = localStorage.getItem("mpSir2");
  if (cat) {
    var a = JSON.parse(cat);
    globalThis.mpSir.socket.emit("LogIn", { name: a.name, PassWord: a.PassWord });
    //console.log('AutoLogIn Called');
    //console.log(a);
  }
}
mpSir.LogIn = function () {
  function b(name) {
    let password = prompt("Please enter your password", "");
    if (password != null) { c(name, password) }
  }
  function c(name, password) {
    //console.log(name);
    //console.log(password);
    mpSir.socket.emit('LogIn', { name: name, PassWord: password })
  }
  let name = prompt("Please enter your user name", "");
  if (name != null) { b(name) }
}



mpSir.Msg = function(MsgType, MsgData={}){
  if(MsgType != null && MsgType != undefined){
  mpSir.socket.emit(
    'Msg', 
    { 
      Type: MsgType, 
      Data: MsgData
    }
    )
  }
}


// mpSir.Toast = function (title = 'Title Needed !', icon = 'success') {
//   const Toast = Swal.mixin({
//     toast: true,
//     position: 'top-end',
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.addEventListener('mouseenter', Swal.stopTimer)
//       toast.addEventListener('mouseleave', Swal.resumeTimer)
//     }
//   });

//   Toast.fire({
//     icon: icon,
//     title: title
//   })
// }
