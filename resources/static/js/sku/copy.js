var PAGE_URLS = {
    COPY_IMAGE: contextPath + "/sku/copySkuImageResources"
};

var msg = new Message();

var skuId;

var initPage = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    if (OPT_HANDLE.UPDATE === optHandle) {
    }

    $('#copy-group-multiple-selected').multiselect({
        buttonWidth: '260px'  ,
        nonSelectedText: '请选择'
    });

    skuId = params.callParams.id;

};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.skuId = skuId;

    var res = $('#copy-group-multiple-selected').val();

    if (res.length === 0) {

        msg.show("分类选择不能为空!");

        return;
    }

    $.each(res,function (index,value) {

        if ( value === 'plt1') {

            params.isBanner = true

        }
        if ( value === 'plt2') {

            params.isDetailImage = true
        }
        if ( value === 'plt3') {

            params.isSliderImage = true
        }

    });

    return $.sendRequest(PAGE_URLS.COPY_IMAGE, JSON.stringify(params));
};
