g.Funs = {
    ... JSONF.parse( JSONF.stringify(g.Funs) ),
    MakeContextMenu: function (e, menu_array, prevent_default = true) {
        prevent_default ? e.preventDefault() : null

        var x = $(e.target).position()

        var a = $("<div>OK</div>")
        $("body").append(a)

        $(a).css({
            top: x.top, // + $(toggleHandle).outerHeight(),
            left: x.left,
            position: 'fixed',
            zIndex: g.Funs.GetMaxZ()
        });

    },
    GetMaxZ: function () {
        return Math.max.apply(null,
            $.map($('body *'), function (e, n) {
                if ($(e).css('position') != 'static')
                    return parseInt($(e).css('z-index')) || 1;
            }));
    }
}