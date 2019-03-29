var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/user/getAgentPage',
    GET_NUM: contextPath + '/agentAmountStatistics/getMonthTotal'
};

var toolbarListener = function () {

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    infoRecoveryInitialization();

    asRecoveryInitialization();

    if (length === 1) {

        $('#queryPanel').show();

        $('#info-after-sales-row').show();

        refreshAsTable($('#page-data-query-form').serializeJson().dateTime,$(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id);

        $(PAGE_AS_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();

        refreshInfoTable($('#page-data-query-form').serializeJson().dateTime,$(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id);

        $(PAGE_INFO_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();

        var result =  $.sendRequest(PAGE_URLS.GET_NUM,JSON.stringify({dateTime:$('#page-data-query-form').serializeJson().dateTime,userId:$(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id}));

        $('#total').html('<strong>交易总金额:</strong>'+result.data.total);

        $('#refundOrderInfoTotal').html('<strong>退款总金额:</strong>'+result.data.refundOrderInfoTotal);

        $('#orderInfoTotal').html('<strong>订单总金额:</strong>'+result.data.orderInfoTotal);
    }
    else {

        $('#queryPanel').hide();

        $('#info-after-sales-row').hide();
    }
};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {

        url: PAGE_URLS.GET_PAGE,

        toolbar: '#toolbar',

        singleSelect: true,

        queryParams: function (e) {

            return JSON.stringify($.extend(queryParams, {
                page: {
                    pageNumber: (e.offset / e.limit) + 1,
                    pageSize: e.limit
                }
            }));
        },

        responseHandler: function (result) {
            if (checkRespCodeSuccess(result)) {
                return result.data;
            }

            new Message().show(result.errDesc);
        },
        columns: [{
            checkbox: true
        }, {
            field: 'phoneNo',
            title: '电话号码',
            align: 'center'
        }, {
            field: 'wxNo',
            title: '微信号',
            align: 'center'
        }, {
            field: 'country',
            title: '所属国家',
            align: 'center',
            formatter: function (value,row,index) {
                return value ? value.name : null;
            }
        },  {
            field: 'country',
            title: '电话区号',
            align: 'center',
            formatter:function (value,row,index) {
                return value ? value.phoneNoCode : null;
            }
        }, {
            field: 'nickname',
            title: '昵称',
            align: 'center'
        }, {
            field: 'sexual',
            title: '性别',
            align: 'center',
            formatter:function (obj,index,row) {
                return obj ? constantsEnumData.sexual[obj].name : null;
            }
        }, {
            field: 'birthday',
            title: '生日',
            align: 'center'
        }, {
            field: 'userType',
            title: '类型',
            align: 'center',
            formatter:function (obj,row,index) {
                return  obj ? constantsEnumData.userType[obj].name : null;
            }
        }, {
            field: 'agentLevel',
            title: '用户级别',
            align: 'center',
            formatter:function (obj,row,index) {
                return  obj ? obj.name : null;
            }
        },
        {
            field: 'accountState',
            title: '状态',
            align: 'center',
            formatter:function (obj,row,index) {
                return  obj ? constantsEnumData.accountState[obj].name : null;
            }
        }, {
            field: 'remark',
            title: '备注',
            align: 'center'
        }
        ],
        onCheck: toolbarListener,
        onUncheck: toolbarListener,
        onCheckAll: toolbarListener,
        onUncheckAll: toolbarListener,
        onPageChange: function (number, size) {

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        },

        onRefresh: function () {

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        }

    };

    $(PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var initPageDom = function () {

    layui.use('laydate', function () {

        var dateTime,fontMonth,fontYear;

        var month = new Date().getMonth() + 1;

        var year = new Date().getFullYear();

        if ( 1 < month && month< 10) {

            var res = month -1;

            dateTime = year + '-' + '0' + res;
        }
        else if (month === 1) {

            fontMonth = 12;

            fontYear = year -1;

            dateTime = fontYear + '-' + fontMonth;
        }
        else  if (month === 10) {

            var res = month-1;

            dateTime = year + '-' + '0' + res;
        }
        else{

            var res = month -1;

            dateTime = year + '-' + res;
        }

        var laydate = layui.laydate;

        laydate.render({
            elem: '#agentDatetime'
            ,type:'month'
            ,max:0
            ,value:dateTime
        });
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});