var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/systemLog/getPage'
};

var msg = new Message();

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-del').removeAttr('disabled');

    var res = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = res.length;

    if (length > 0) {

        $('#toolbar #btn-query').removeAttr('disabled');
    }
};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {

        url: PAGE_URLS.GET_PAGE,

        toolbar: '#toolbar',

        singleSelect:true,

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
            field: 'username',
            title: '操作人',
            align: 'center'
        }, {
            field: 'ipAddress',
            title: 'ip地址',
            align: 'center'
        }, {
            field: 'operationType',
            title: '操作类型',
            align: 'center',
            formatter: function (obj, row, index) {
                return constantsEnumData.operationType[obj].name;
            }
        }, {
            field: 'operation',
            title: '具体操作',
            align: 'center'
        }, {
            field: 'requestUri',
            title: '请求地址',
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            align: 'center'
        }, {
            field: 'createDatetime',
            title: '生成日期',
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

var editedCallback = function (params) {

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();

        return;
    }

    new Message().show(result.errDesc);
};

var initPageDom = function () {

    var startDatetime;

    var endDatetime;

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#startEndPayDatetime'
            ,range:true
            ,max:0
            ,done:function (value, date, endDate) {

                if (value !== "") {

                    var res = value.split(" ");

                    $.each(res,function (index,obj) {

                        if (index === 0) {
                            startDatetime = obj
                        }

                        if (index === 2) {
                            endDatetime = obj
                        }
                    })
                }
            }
        });
    });

    $('#page-data-query-btn').click(function () {

        var queryParam = $('#page-data-query-form').serializeJson();

        if (queryParam.startEndPayDatetime !== "") {

            delete queryParam.startEndPayDatetime;

            queryParam.startCreateDate = startDatetime;

            queryParam.endCreateDate = endDatetime;

            queryParams =queryParam;

        }
        else {

            delete queryParam.startEndPayDatetime;

            queryParam.startCreateDate = "";

            queryParam.endCreateDate = "";

            queryParams =queryParam;
        }

        if (!queryParam.operationType) {

             delete queryParams.operationType
        }

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#btn-del').click(function () {

        new Message().openView({
            content: [contextPath + '/systemLog/deletePage', 'yes'],
            title: '删除日志',
            area: ['620px', '470px']
        }, 'initPage', null, 'saveOrUpdate', null, editedCallback, null);
    });

    $('#btn-query').click(function () {

        var allResult = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow();

        var callParams = {
            params : allResult.params ,
            result : allResult.result
        };

        var index = new Message().openView({
            content: [contextPath + '/systemLog/queryPage', 'yes'],
            title: '查看明细',
            btn:['关闭'],
            area: ['620px', '470px']
        }, 'initPage', callParams, null, null, editedCallback, null);

        layer.full(index);
    });

    $.each(constantsEnumData.operationType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#operation-type-select'));
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});