var PAGE_URLS = {
    TO_LEAD:contextPath + '/orderInfo/importLogisticInfo'
};

var msg =new Message();

$(function () {

    layui.use('upload', function () {

        var upload = layui.upload;

        upload.render({
            elem: '#select-file-btn',
            url: PAGE_URLS.TO_LEAD,
            auto: false,
            bindAction: '#upload-file-btn',
            field:'excelFile',
            accept: 'file',
            exts:'xls|xlsx',
            before: function (obj) {
                msg.loading();
            },
            done: function (result, index, upload) {
                msg.closeLoading();

                    if (!checkRespCodeSuccess(result)) {

                        msg.show(result.errDesc);

                        return;
                    }

                msg.show('成功'+result.data.success+'条 , '+'失败'+result.data.lost+'条');

            }, error: function (index, upload) {
                msg.closeLoading();
            }
        });
    });

});

