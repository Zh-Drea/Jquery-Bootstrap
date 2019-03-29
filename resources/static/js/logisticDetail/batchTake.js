var PAGE_URLS = {
    SAVE_OR_UPDATE : contextPath + "/logisticDetail/executeBulkSubscribeLogisticTask"
};

var startCreateDatetime;

var endCreateDatetime;

var initPage = function () {

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#dateInterval'
            ,type: 'datetime'
            ,range:true
            ,max:0
            ,done:function (value, date, endDate) {

                if (value !== "") {

                    var res = value.split(" ");

                    $.each(res,function (index,obj) {

                        var arr=[];

                        var endArr=[];

                        arr[0] = res[0];

                        arr[1] = res[1];

                        endArr[0] = res[3];

                        endArr[1] = res[4];

                        startCreateDatetime = arr.join(" ");

                        endCreateDatetime = endArr.join(" ");
                    })

                }

            }
        });
    });
};

var saveOrUpdate = function () {

    var p = {};

    p.startCreateDatetime = startCreateDatetime;

    p.endCreateDatetime = endCreateDatetime;

    return $.sendRequest(PAGE_URLS.SAVE_OR_UPDATE,JSON.stringify(p));
};