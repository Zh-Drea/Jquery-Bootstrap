var OPTION_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-option-data-table'
};

var OPTION_PAGE_URLS = {
    GET_PAGE: contextPath + '/orderInfoItemRefSpecialService/getPage'
};

var optionQueryParams = {};


var optionToolbarListener = function () {

};

var initOptionBootstrapTable = function () {

    var options = {
        url: OPTION_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-option',
        singleSelect: true,
        queryParams: function (e) {
            return JSON.stringify($.extend(optionQueryParams, {
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
            checkbox:true
        }, {
            field: 'specialServiceOption',
            title: '特殊服务名称',
            align: 'center',
            formatter:function (value,row,index) {
                return value ? value.goodsModelRefSpecialService.specialService.name : null;
            }
        }, {
            field: 'specialName',
            title: '特殊服务选项名称',
            align: 'center'
        }, {
            field: 'specialServicePrice',
            title: '特殊服务价格',
            align: 'center'
        },{
            field: 'num',
            title: '购买数量',
            align: 'center'
        },{
            field: 'remark',
            title: '备注',
            align: 'center'
        }
        ],
        onCheck: optionToolbarListener,
        onUncheck: optionToolbarListener,
        onCheckAll: optionToolbarListener,
        onUncheckAll: optionToolbarListener,
        onPageChange: function (number, size) {

            $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            optionToolbarListener();
        },
        onRefresh: function () {

            $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            optionToolbarListener();
        }
    };

    $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};


var optionRecoveryInitialization = function () {

    optionQueryParams = {};

    $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();
};

$(function () {

    initOptionBootstrapTable();

    optionToolbarListener();
});

