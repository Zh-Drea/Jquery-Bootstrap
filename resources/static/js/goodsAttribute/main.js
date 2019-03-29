var ATTRIBUTE_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-attr-data-table'
};


var ATTRIBUTE_PAGE_URLS = {
    GET_PAGE: contextPath + '/goodsAttribute/getPage',
    DELETE: contextPath + '/goodsAttribute/delete'
};

var attributeToolbarListener = function () {

    $('#toolbar-attr #btn-del-attr').attr('disabled', 'disabled');

    var rows = $(ATTRIBUTE_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length > 0) {

        $('#toolbar-attr #btn-del-attr').removeAttr('disabled');
    }
};

var attributeQueryParams = {};

var initAttributeBootstrapTable = function () {

    var options = {
        url: ATTRIBUTE_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-attr',
        queryParams: function (e) {
            return JSON.stringify($.extend(attributeQueryParams, {
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
            title: '属性名称',
            align:'center'
        }, {
            field: 'goodsAttributeOptions',
            title: '属性选项',
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

            $(ATTRIBUTE_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            attributeToolbarListener();
        },
        onRefresh: function () {

            $(ATTRIBUTE_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            attributeToolbarListener();
        }
    };

    $(ATTRIBUTE_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

function deleteAttributeCallback() {

    var ids = [];

    var rows = $(ATTRIBUTE_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    $.each(rows, function (index, row) {
        ids.push(row.id);
    });

    var params = {
        ids: ids
    };

    $.sendRequest(ATTRIBUTE_PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);

            return;
        }

        $(ATTRIBUTE_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var attributeRecoveryInitialization = function () {

    attributeQueryParams = {};

    $(ATTRIBUTE_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

};

var initAttributePageDom = function () {

    $('#toolbar-attr button').click(function () {

        var optHandle = $(this).attr('data-handle');

        if ('delete-attr' === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteAttributeCallback);

            return
        }

    });

};

$(function () {

    initAttributePageDom();

    initAttributeBootstrapTable();

    attributeToolbarListener();
});