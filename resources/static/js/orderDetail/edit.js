var PAGE_URLS = {
    GET_BY_ID: contextPath + "/orderDetail/getById",
    SAVE_OR_UPDATE: contextPath + "/orderDetail/updateOrderDetail",
    GET_ALL_PRO_AREA: contextPath + "/area/getAllParentArea",
    GET_ALL_PRO_CHD_AREA: contextPath + "/area/getAreaByPid"

};

var msg = new Message();

var detailId;

var cityVal;

var areaVal;

var initPage = function (params) {

    initPageDom(params);

    initFormData(params);

};

var initPageDom = function () {

    $("#province-list").prepend("<option value=''>请选择</option>");

    $("#city-list").prepend("<option value=''>请选择</option>");

    $("#receiverArea-list").prepend("<option value=''>请选择</option>");

    $.sendRequest(PAGE_URLS.GET_ALL_PRO_AREA, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {

                $('<OPTION>').val(row.id).text(row.name).appendTo($("#province-list"));
            });
        }
    });

    $("#province-list").change(function () {

        var isExists = false;

        $('#dis-area').show();

        $("#city-list").find("option").remove();

        $("#city-list").prepend("<option value=''>请选择</option>");

        $("#receiverArea-list").find("option").remove();

        $("#receiverArea-list").prepend("<option value=''>请选择</option>");

        var p = {
            id: $(this).val()
        };

        if ($(this).val()) {

            $.sendRequest(PAGE_URLS.GET_ALL_PRO_CHD_AREA,JSON.stringify(p),{},function (result) {

                if (checkRespCodeSuccess(result)){

                    $.each(result.data, function (index, row) {

                        $('<OPTION>').val(row.id).text(row.name).appendTo($("#city-list"));

                        if (!isExists && cityVal === row.id) {

                            isExists =true;
                        }
                    });

                    if (isExists) {

                        $("#city-list").val(cityVal);

                        $("#city-list").change();
                    }
                }
            })
        }
        else{

            $("#city-list").find("option").remove();

            $("#receiverArea-list").find("option").remove();

            $("#city-list").prepend("<option value=''>请选择</option>");

            $("#receiverArea-list").prepend("<option value=''>请选择</option>");
        }

    });

    $("#city-list").change(function () {

        var isExist = false;

        $("#receiverArea-list").find("option").remove();

        var p = {
            id: $(this).val()
        };

        if ($(this).val()) {

            $.sendRequest(PAGE_URLS.GET_ALL_PRO_CHD_AREA,JSON.stringify(p),{},function (result) {

                if (checkRespCodeSuccess(result)){

                    if (result.data.length !== 0) {

                        $('#dis-area').show();

                        $.each(result.data, function (index, row) {

                            $('<OPTION>').val(row.id).text(row.name).appendTo($("#receiverArea-list"));

                            if (!isExist && areaVal === row.id) {
                                isExist =true;

                            }
                        });

                        if (isExist) {
                            $("#receiverArea-list").val(areaVal);
                        }
                    }
                    else {
                        $('#dis-area').hide();
                    }
                }
            })
        }
        else{

            $('#dis-area').show();

            $("#receiverArea-list").find("option").remove();

            $("#receiverArea-list").prepend("<option value=''>请选择</option>");
        }
    });
};

var initFormData = function (params) {

    detailId = params.callParams.id;

    if (detailId) {

        var p = {
            id: detailId
        };

        var result = $.sendRequest(PAGE_URLS.GET_BY_ID, JSON.stringify(p));

        if (!checkRespCodeSuccess(result)) {
            new Message().show(result.errDesc);
            return;
        }

        $('#edit-form').autoFillForm(result.data);

        $.each(result.data.areas,function (index,obj) {

            if(index === 0) {

                var proVal = obj.id;

                $("#province-list").val(proVal);
            }

            if(index === 1) {

                cityVal = obj.id;

            }

            if (index === 2) {

                areaVal = obj.id;
            }

            if(result.data.areas.length === 2) {

                $('#dis-area').hide();
            }
        });
        $("#province-list").change();

        $("#city-list").change();
    }
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    params.id = detailId;

    params.province = {
        id: $("#province-list").val()
    };

    params.city = {
        id: $("#city-list").val()
    };

    params.receiverArea = {
        id: $("#receiverArea-list").val()
    };

    if (!params.receiverName) {
        msg.show("姓名不能为空!");
        return;
    }

    if (!params.receiverPhoneNo) {
        msg.show("电话号码不能为空!");
        return;
    }

    if (!params.receiverIdCardNo) {
        msg.show("身份证号不能为空!");
        return;
    }

    if (!params.province.id) {
        msg.show("省不能为空!");
        return;
    }
    if (!params.city.id) {
        msg.show("市不能为空!");
        return;
    }

    if ($('#dis-area').is(":visible")) {

        if (!params.receiverArea.id) {
            msg.show("县或区不能为空!");
            return;
        }
    }

    if (!params.receiverAddress) {
        msg.show("详细地址不能为空!");
        return;
    }

    if ($('#dis-area').is(":visible")) {

        delete params.province;

        delete params.city

    }
    else {

        delete params.province;

        delete params.city;

        params.receiverArea = {
            id:$("#city-list").val()
        }
    }
    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE, JSON.stringify(params));
};
