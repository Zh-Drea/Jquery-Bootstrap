var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {

    GET_PAGE: contextPath + '/coinOperateRecord/getPage'

};

var toolbarListener = function () {
};

var queryParams = {};

var initBootstrapTables = function () {

    var options = {
        url: PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar',
        singleSelect: true,
        clickToSelect: false,
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
            field: 'user',
            title: '用户电话',
            align: 'center',
            formatter: function (value, row, index) {
                return value ? value.phoneNo : null;
            }
        }, {
            field: 'coinTotal',
            title: '币总量',
            align: 'center'
        }, {
            field: 'beforeCoinTotal',
            title: '操作前币总量',
            align: 'center'
        }, {
            field: 'afterCoinTotal',
            title: '操作后币总总量',
            align: 'center'
        }, {
            field: 'coinType',
            title: '币类型',
            align: 'center',
            formatter: function (value, row, index) {
                return constantsEnumData.coinType[value].name;
            }
        }, {
            field: 'coinOrigin',
            title: '币来源',
            align: 'center',
            formatter: function (value, row, index) {
                return constantsEnumData.coinOrigin[value].name;
            }
        }, {
            field: 'upAccountStatus',
            title: '上账状态',
            align: 'center',
            formatter: function (value, row, index) {
                return constantsEnumData.upAccountStatus[value].name;
            }
        }, {
            field: 'calculateMode',
            title: '计算方式',
            align: 'center',
            formatter: function (value, row, index) {
                return constantsEnumData.calculateMode[value].name;
            }
        }, {
            field: 'latestToReachedDatetime',
            title: '最晚到账日期',
            align: 'center'
        }, {
            field: 'reachedDatetime',
            title: '到账日期',
            align: 'center'
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

    var startReachedDatetime;

    var endReachedDatetime;

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#startEndReachedDatetime'
            , type: 'datetime'
            , range: true
            , max: 0
            , done: function (value, date, endDate) {

                if (value !== "") {

                    var res = value.split(" ");

                    $.each(res, function (index, obj) {

                        var arr = [];

                        var endArr = [];

                        arr[0] = res[0];

                        arr[1] = res[1];

                        endArr[0] = res[3];

                        endArr[1] = res[4];

                        startReachedDatetime = arr.join(" ");

                        endReachedDatetime = endArr.join(" ");
                    })

                }

            }
        });
    });

    $.each(constantsEnumData.coinType, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#coin-type'));

    });

    $.each(constantsEnumData.coinOrigin, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#coin-origin'));

    });

    $.each(constantsEnumData.upAccountStatus, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#upAccount-status'));

    });
    $.each(constantsEnumData.calculateMode, function (index, obj) {

        $('<OPTION>').val(obj.value).text(obj.name).appendTo($('#calculate-Mode'));

    });

    $('#page-data-query-btn').click(function () {

        var queryParam = $('#page-data-query-form').serializeJson();
        /*如果枚举为空 那就传空*/
        if (queryParam.coinOrigin === "") {

            queryParam.coinOrigin = null;

            queryParams = queryParam;
        }
        if (queryParam.coinType === "") {

            queryParam.coinType = null;

            queryParams = queryParam;
        }
        if (queryParam.upAccountStatus === "") {

            queryParam.upAccountStatus = null;

            queryParams = queryParam;
        }
        if (queryParam.calculateMode === "") {

            queryParam.calculateMode = null;

            queryParams = queryParam;
        }

        /* 日期处理*/
        if (queryParam.startEndReachedDatetime !== "") {

            delete queryParam.startEndReachedDatetime;

            queryParam.startReachedDatetime = startReachedDatetime;

            queryParam.endReachedDatetime = endReachedDatetime;
        } else {

                       delete queryParam.startEndReachedDatetime;

            queryParam.endReachedDatetime = "";

            queryParam.startReachedDatetime = "";
        }

        queryParams = queryParam;

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});