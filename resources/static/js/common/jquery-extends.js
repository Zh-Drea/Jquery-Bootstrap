(function ($) {

    $.fn.autoFillForm = function (json) {

        var inputs = $(this).find('INPUT, SELECT,TEXTAREA');

        $.each(inputs, function (index, item) {

            var input = $(item);
            var key = input.attr('name');

            if (key !== undefined) {

                var keys = key.split('.');
                var value = undefined;

                for (var i = 0; i < keys.length; i++) {
                    if (undefined === value) {
                        value = json[keys[i]];
                    } else {
                        value = value[keys[i]];
                    }

                    if (typeof(value) !== 'boolean' && !value) {
                        return;
                    }
                }

                if (undefined !== value) {

                    value = input.is('SELECT') ? value + '' : value;

                    input.val(value);
                }
            }
        });

    };

    $.fn.serializeJson = function () {

        var serializeObj = {};
        var array = this.serializeArray();

        $(array).each(function () {

            if (serializeObj[this.name]) {

                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });

        return serializeObj;
    };

    jQuery.sendRequest = function (url, params, options, callback) {
        var requestOptions = {
            url: url,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: params,
            async: false,
            cache: false,
            success: function (result) {
                if (callback && typeof (callback) === 'function') {
                    callback(result);
                    return;
                }
                return result;
            }
        };

        $.extend(requestOptions, options);

        return $.ajax(requestOptions).responseJSON;
    };

})(jQuery);