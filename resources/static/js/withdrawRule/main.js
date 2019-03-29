var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};

var PAGE_URLS = {
    GET_PAGE: contextPath + '/withdrawRule/getPage'
};

var toolbarListener = function () {

    $('#toolbar button').attr('disabled', 'disabled');

    $('#toolbar #btn-add').removeAttr('disabled');

    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');
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
            field: 'singleOrderMinWithdrawAmount',
            title: '单笔订单最小提现金额',
            align: 'center'

        }, {
            field: 'singleOrderMaxWithdrawAmount',
            title: '单笔订单最大提现金额',
            align: 'center'

        }, {
            field: 'bonusCoinExchangeToRmbRate',
            title: '奖金币换算成人民币比例(元)',
            align: 'center'

        }, {
            field: 'rmbExchangeToBonusCoinRate',
            title: '人民币换算成奖金币比例(元)',
            align: 'center'

        }, {
            field: 'singleDayMaxWithdrawNum',
            title: '单日最大提现次数',
            align: 'center'

        }, {
            field: 'singleDayMaxWithdrawTotalAmount',
            title: '单日最大累计提现金额',
            align: 'center'

        },{
            field: 'withdrawRate',
            title: '提现费率(千分比)',
            align: 'center'

        }, {
            field: 'withdrawWeekdays',
            title: '提现时间',
            align: 'center',
            formatter:function (value,row,index) {

                if (value) {

                    var names = [];

                    $.each(JSON.parse(value),function (o,p) {

                        if (p === 1) {

                            names.push('星期一')
                        }
                        else if (p === 2){

                            names.push('星期二')
                        }
                        else if (p === 3){

                            names.push('星期三')
                        }
                        else if (p === 4){

                            names.push('星期四')
                        }
                        else if (p === 5){

                            names.push('星期五')
                        }
                        else if (p === 6){

                            names.push('星期六')
                        }
                        else {

                            names.push('星期天')
                        }

                        names.join(' , ');
                    });

                    return names;
                }
                else {
                    return "";
                }
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

var editedCallback = function (params) {

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();

        return;
    }

    new Message().show(result.errDesc);
};

var initPageDom = function () {

    $('#toolbar button').click(function () {

        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');

        var callParams = {};

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {
                id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };

        new Message().openView({
            content: [contextPath + '/withdrawRule/editPage'],
            title: title,
            area: ['550px', '520px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);
    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});