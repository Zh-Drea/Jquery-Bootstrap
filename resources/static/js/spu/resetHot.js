var PAGE_URLS = {
    RESET_HOT: contextPath + "/spu/resetHot"
};

var msg = new Message();

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    if (!REG_EXPS.PLUS_INTEGER.test(params.num)) {
        msg.show("热门个数格式不正确!");
        return;
    }

    return $.sendRequest(PAGE_URLS.RESET_HOT, JSON.stringify(params));
};
