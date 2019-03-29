var PAGE_URLS = {
    DELETE: contextPath + "/systemLog/delete"
};

var msg = new Message();

var startDatetime;

var endDatetime;

var initPage = function () {

    var endTimeSplitFirst;

    var endTimeSplitSecond;

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#startEndPayDatetime'
            ,type: 'month'
            ,range:true
            ,done:function (value, date, endDate) {
                //重新组装时间格式
                if (value !== "") {

                    var res = value.split(" - ");

                    $.each(res,function (index,obj) {

                        if (index === 0) {
                            startDatetime = obj+'-01'
                        }

                        if (index === 1) {

                            var plt = obj.split("-");

                            $.each(plt,function (o,i) {

                                if (o === 0) {

                                    endTimeSplitFirst = i;
                                }

                                if (o === 1) {

                                    if (i === '12') {

                                        endTimeSplitSecond = '01-01';

                                        endTimeSplitFirst = parseInt(endTimeSplitFirst) + 1;
                                    }
                                    else {

                                        var p = parseInt(i) + 1;

                                        endTimeSplitSecond = p + '-01'
                                    }
                                }
                            });

                            endDatetime = endTimeSplitFirst + '-' + endTimeSplitSecond;
                        }
                    })
                }
            }
        });
    });
};

var saveOrUpdate = function () {

    var params = $('#edit-form').serializeJson();

    if (!params.startEndPayDatetime) {
        msg.show("时间不能为空!");
        return;
    }

    var obj = {
        startCreateDate:startDatetime,
        endCreateDate:endDatetime
    };

    return $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(obj));
};
