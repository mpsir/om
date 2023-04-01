g.start = async function () {
    $("body").append("started")
    // if (navigator.platform.search("Win") == "-1") {
    //     add_script('https://mpsir.github.io/om/Lib/eruda.js')
    //     setTimeout(() => {
    //         eruda.init()
    //     }, 2000);
    // }
}

function add_script(address) {
    const script = document.createElement('script');

    script.setAttribute(
        'src',
        address,
    );

    script.setAttribute('async', '');

    script.onload = function handleScriptLoaded() {
        console.log('script has loaded');
        $("body").append("script added")

    };

    script.onerror = function handleScriptError() {
        console.log('error loading script');
    };

    document.head.appendChild(script);

}
