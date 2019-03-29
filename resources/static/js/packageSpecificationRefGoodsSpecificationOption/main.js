var OPTION_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-option-data-table'
};


var OPTION_PAGE_URLS = {
    GET_PAGE: contextPath + '/goodsSpecification/getPage',
    DELETE: contextPath + '/goodsSpecification/delete'
};

var attributeToolbarListener = function () {

    $('#toolbar-option #btn-option-del').attr('disabled', 'disabled');

    var rows = $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length > 0) {

        $('#toolbar-option #btn-option-del').removeAttr('disabled');
    }
};

var optionQueryParams = {};

var initAttributeBootstrapTable = function () {

    var options = {
        url: OPTION_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-option',
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
            checkbox: true
        }, {
            field: 'name',
            title: '商品规格名称',
            align:'center'
        }, {
            field: 'goodsSpecificationOptions',
            title: '商品规格选项',
            align:'center',
            formatter: function (value, row, index) {
                if (null === value) {
                    return "";
                }

                var names = [];

                $.each(value, function (index, o) {
                    names.push(o.value);
                });

                return names.join(",")
            }
        }],
        onCheck: attributeToolbarListener,
        onUncheck: attributeToolbarListener,
        onCheckAll: attributeToolbarListener,
        onUncheckAll: attributeToolbarListener,
        onPageChange: function (number, size) {

            $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            attributeToolbarListener();
        },
        onRefresh: function () {

            $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            attributeToolbarListener();
        }
    };

    $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var optionRecoveryInitialization = function () {

    optionQueryParams = {};

    $(OPTION_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

$(function () {


    initAttributeBootstrapTable();

    attributeToolbarListener();
});