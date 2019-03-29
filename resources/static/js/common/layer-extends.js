var layer = layui.layer;

var DEFAULT_OPEN_VIEW_OPTIONS = {
    content: ['', 'no'],
    type: 2,
    shade: [0.4],
    maxmin: true,
    area: ["900px", '600px'],
    skin: 'layui-layer-lan',
    btn: ['确定', '关闭']
};

function Message() {
}

Message.prototype = {

    show: function (msg) {
        if (msg) {
            layer.msg(msg);
        }
    },

    loading: function () {
        layer.load(0, {
            shade: [0.5, '#fff']
        });
    },

    closeLoading: function () {
        layer.closeAll('loading');
    },

    confirm: function (msg, callback, param) {

        layer.confirm(msg, function (lay) {
            if (callback && typeof (callback) === 'function') {
                layer.close(lay);
                callback(param);
            }
        })
    },

    tipLeft: function (id, msg, time) {

        time = time || 3000;

        layer.tips(msg, $(id), {
            tips: [4, '#3595CC'],
            time: time
        });
    },

    openView: function (options, callMethod, callParams, yesCallMethod, yesCallParams, yesCallbackMethod, yesCallbackParams) {

        var viewOptions = {};

        var params = {
            callParams: callParams,
            yesCallParams: yesCallParams,
            yesCallbackParams: yesCallbackParams
        };

        if (callMethod) {

            $.extend(viewOptions, {

                success: function (layero, index) {

                    var iframeWin = window[layero.find('iframe')[0]['name']];

                    var p = {
                        layerIndex: index,
                        layero: layero
                    };

                    $.extend(p, params);

                    iframeWin[callMethod].call(this, p);
                }
            });
        }

        if (yesCallMethod) {

            $.extend(viewOptions, {

                yes: function (index, layero) {

                    var iframeWin = window[layero.find('iframe')[0]['name']];

                    var p = {
                        layerIndex: index,
                        layero: layero
                    };

                    $.extend(p, params);

                    var result = iframeWin[yesCallMethod].call(this, p);

                    $.extend(p, {result: result});

                    if (yesCallbackMethod && typeof (yesCallbackMethod) === 'function') {
                        yesCallbackMethod(p);
                    }
                }
            });

        }

        $.extend(viewOptions, DEFAULT_OPEN_VIEW_OPTIONS, options);

        return layer.open(viewOptions);
    }

};
