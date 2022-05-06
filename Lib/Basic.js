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
