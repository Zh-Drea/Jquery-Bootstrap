var PAGE_URLS = {
    GET_BY_ID: contextPath + "/spu/getSpuImageBySpuId",
    SAVE_OR_UPDATE_BANNER: contextPath + "/spu/saveSpuImage"
};

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var msg = new Message();

var initPageDom = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

};

var saveOrUpdate = function (obj) {

    if (obj.callParams.id) {

        var params = $('#edit-form').serializeJson();

        params.imageAttachment = {
            id: $('#imageAttachmentId').val()
        };

        params.spuId = obj.callParams.id;
    }

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE_BANNER, JSON.stringify(params));
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

        $('#imageAttachmentId').val(result.data.id);

        var optHandle = params.yesCallbackParams.viewOptHandle;

        if ('edit-image' === optHandle) {

            if (null !== result.data) {
                $('#attachment-image').attr('src', result.data.resourceFullAddress).data(result.data);
            }
        }
    }

};

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