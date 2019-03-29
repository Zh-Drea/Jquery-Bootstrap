var PAGE_URLS = {
    GET_BY_ID: contextPath + "/brand/getById",
    SAVE_OR_UPDATE: contextPath + "/brand/saveOrUpdate",
    COUNTRY_GET_ALL: contextPath + "/country/getAll",
    GOODS_GROUP_GET_ALL: contextPath + "/goodsGroup/getAll"
};

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

    //  获取国家Id
    $.sendRequest(PAGE_URLS.COUNTRY_GET_ALL, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#country-list'));

                if (index === 0) {
                    $('#country-list').val(row.id);
                }
            });
        }
    });

    //  所有商品分类
    $.sendRequest(PAGE_URLS.GOODS_GROUP_GET_ALL, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {
            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($('#goods-group-multiple-selected'));
            });
        }
    });

    $('#goods-group-multiple-selected').multiselect({
        buttonWidth: '212px'  ,
        nonSelectedText: '请选择',
        maxHeight: 200
    });
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.country = {
        id: $('#country-list').val()
    };

    if (!params.code) {
        msg.show("品牌编码不能为空!");
        return;
    }
    if (!params.name) {
        msg.show("品牌名称不能为空!");
        return;
    }
    if (!REG_EXPS.INTEGER.test(params.orderNum)) {
        msg.show("排序编号格式不正确!");
        return;
    }
    params.imageAttachment = {
        id: $('#imageAttachmentId').val()
    };

    var goodsGroupIds = $('#goods-group-multiple-selected').val();

    var goodsGroup = [];

    $.each(goodsGroupIds, function (index, obj) {

        goodsGroup.push({'id': obj});

        params.goodsGroups = goodsGroup;

    });

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};

var initFormData = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }

        $('#edit-form').autoFillForm(result.data);

        var optHandle = params.yesCallbackParams.viewOptHandle;

        if (OPT_HANDLE.UPDATE === optHandle) {

            if (result.data.imageAttachment) {
                $('#attachment-image').attr('src', result.data.imageAttachment.resourceFullAddress).data(result.data.imageAttachment);
            }

            var goodsGroupIds = [];
            //回显分类选项
            if (result.data.goodsGroups) {

                $.each(result.data.goodsGroups, function (index, obj) {

                    goodsGroupIds.push(obj.id);
                });
            }

            $('#goods-group-multiple-selected').multiselect('select', goodsGroupIds);
        }
    }

};

var msg = new Message();

$(function () {

    layui.use('upload', function () {

        var upload = layui.upload;

        upload.render({
            elem: '#select-file-btn',
            url: uploadParams.uploadUrl,
            auto: false,
            data: {
                attachmentOrigin: uploadParams.attachmentOrigin
            },
            bindAction: '#upload-file-btn',
            before: function (obj) {
                msg.loading();
            },
            done: function (result, index, upload) {
                msg.closeLoading();

                if (checkRespCodeSuccess(result)) {

                    $('#imageAttachmentId').val(result.data.id);

                    $('#attachment-image').attr('src', result.data.resourceFullAddress).data(result.data);
                }

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });

});