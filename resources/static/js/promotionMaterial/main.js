var PAGE_URLS = {
    GET_DATE: contextPath + '/promotionMaterial/getAllByParams',
    CHANGE_STATUS: contextPath + '/promotionMaterial/changeAuditStatusParams'
};

var clickPage = {
   pageSize:5,
   pageNumber:1
};

var msg = new Message();

var plt=1;

var queryParam;

var hsk;

var refresh = function (params) {

    $.each(params,function (index,value) {

        var item = $('#li-template').clone().attr('id','li-template-'+plt).appendTo($('#template'));

        $(item).find('#userName').attr('itemId',value.id).text(value.user.phoneNo);

        $(item).find('#goodsName').text(value.goodsName);

        $(item).find('#auditDatetime').text(value.auditDatetime);

        $(item).find('#auditStatus').attr('refs',value.auditStatus).text(constantsEnumData.auditStatus[value.auditStatus].name);

        $(item).find('#content').text(value.content);

        $.each(value.attachmentList,function (p,o) {

            $('<IMG>').attr('src', o.resourceFullAddress).addClass('common-show-img').css({
                'height':'100px','width':'100px',"border":"1px solid black"
            }).appendTo($(item).find('#mater-img'));
        });

        if(value.auditStatus === 'AUDIT_PASS'){

            $(item).find('#success').hide();
        }
        else if (value.auditStatus === 'AUDIT_NOT_PASS'){

            $(item).find('#fail').hide();
        }
        else{
            $(item).find('#success').show();

            $(item).find('#fail').show();
        }

        $(item).find('#success').click(function () {

            var p = {};

            p.id = $(item).find('#userName').attr('itemId');

            p.auditStatus = 'AUDIT_PASS';

            var res = $.sendRequest(PAGE_URLS.CHANGE_STATUS,JSON.stringify(p));

            if (!checkRespCodeSuccess(res)) {
                msg.show(res.errDesc);
                return;
            }

            if (queryParam) {

                queryParam.page.pageNumber = hsk;

                loadParams(queryParam);
            }
            else{
                loadParams({page:{
                        pageSize:5,
                        pageNumber:hsk
                    }});
            }
        });

        $(item).find('#fail').click(function () {

            var p = {};

            p.id = $(item).find('#userName').attr('itemId');

            p.auditStatus = 'AUDIT_NOT_PASS';

            var res = $.sendRequest(PAGE_URLS.CHANGE_STATUS,JSON.stringify(p));

            if (!checkRespCodeSuccess(res)) {
                msg.show(res.errDesc);
                return;
            }

            if (queryParam) {

                queryParam.page.pageNumber = hsk;

                loadParams(queryParam);
            }
            else{
                loadParams({page:{
                        pageSize:5,
                        pageNumber:hsk
                }});
            }
        });

        $(item).show();

        plt++;

    });
};

var loadParams = function (params) {

    var allTotal;

    var currentPage;

    var res = $.sendRequest(PAGE_URLS.GET_DATE,JSON.stringify(params));

    if (!checkRespCodeSuccess(res)){

        msg.show(res.errDesc);
    }

    if (res.data) {

        $('#template').children().remove();

        refresh(res.data.records);

        allTotal = res.data.totalElements;

        currentPage=res.data.pageNumber;
    }

    layui.use(['laypage', 'layer'], function() {

        var laypage = layui.laypage;

        laypage.render({
            elem: 'layPage'
            , count: allTotal
            ,curr:currentPage
            ,limit:5
            , jump: function (obj,first) {

                if (!first) {

                    hsk = obj.curr;

                    var param = {};

                    if(params.hasOwnProperty("phoneNo")){

                        $.extend(param,params);
                    }

                    param.page = {
                        pageSize:5,
                        pageNumber:obj.curr
                    };

                    $('#template').children().remove();

                    var p = $.sendRequest(PAGE_URLS.GET_DATE,JSON.stringify(param));

                    if (!checkRespCodeSuccess(p)){
                        msg.show(res.errDesc);
                        return;
                    }

                    refresh(p.data.records);
                }
            }
        });
    });
};

var initPageDate = function () {
    
    var res = {};

    res.page = clickPage;
    
    loadParams(res);
};

var initPageDom = function () {

    $.each(constantsEnumData.auditStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#audit-status-select'));
    });

    var startAuditDatetime;

    var endAuditDatetime;

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#startEndAuditDatetime'
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

                        startAuditDatetime = arr.join(" ");

                        endAuditDatetime = endArr.join(" ");
                    })
                }
            }
        });
    });

    $('#data-query-btn').click(function () {

        queryParam = $('#data-query-form').serializeJson();

        if (queryParam.auditStatus === "") {

            queryParam.auditStatus=null;
        }

        if (queryParam.startEndAuditDatetime !== "") {

            delete queryParam.startEndAuditDatetime;

            queryParam.startAuditDatetime = startAuditDatetime;

            queryParam.endAuditDatetime = endAuditDatetime;
        }else {

            delete queryParam.startEndAuditDatetime;

            queryParam.startAuditDatetime = "";

            queryParam.endAuditDatetime = "";
        }

        queryParam.page = {
            pageSize:5,
            pageNumber:1
        };

        $('#template').children().remove();

        loadParams(queryParam);
    });
};


$(function () {

    initPageDom();

    initPageDate();

});
