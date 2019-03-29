var ITEM_PAGE_URLS = {
    GET_BY_ID: contextPath + "/dynamicModuleGroupItem/getById",
    SAVE_OR_UPDATE: contextPath + "/dynamicModuleGroupItem/saveOrUpdate"
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var dynamicModuleGroupId;

var initPageDom = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    dynamicModuleGroupId = params.callParams.dynamicModuleGroupId;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

    $.each(constantsEnumData.skipType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#skip-type-select'));

        if (index === 'WINDOW') {
            $('#skip-type-select').val(obj.value);
        }
    });
};

var initFormData = function (params) {

    if (params.callParams.id) {

        var p = {
            id: params.callParams.id
        };

        var result = $.sendRequest(ITEM_PAGE_URLS.GET_BY_ID, JSON.stringify(p));
        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }
        $('#edit-form').autoFillForm(result.data);

        var optHandle = params.yesCallbackParams.viewOptHandle;

        if (OPT_HANDLE.UPDATE === optHandle) {

            if (null !== result.data.imageAttachment) {
                $('#attachment-image').attr('src', result.data.imageAttachment.resourceFullAddress).data(result.data.imageAttachment);
            }
        }
    }

};


var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.imageAttachment = {
        id: $('#imageAttachmentId').val()
    };

    params.dynamicModuleGroup = {
        id:dynamicModuleGroupId
    };

    if (!params.title) {
        msg.show("标题不能为空!");
        return;
    }
    if (!REG_EXPS.INTEGER.test(params.orderNum)) {
        msg.show("排序编号格式不正确!");
        return;
    }
    if ("" === params.imageAttachment.id) {
        msg.show("照片不能为空!");
        return;
    }

    return $.sendRequest(ITEM_PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
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