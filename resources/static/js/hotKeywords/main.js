//获取表单数据id
var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};
//网络接口
var PAGE_URLS = {
    //数据查询
    GET_PAGE: contextPath + '/hotKeywords/getPage',
    //数据删除
    DELETE: contextPath + '/hotKeywords/delete'
};
//设置按钮监听事件
var toolbarListener = function () {
    //设置表单的button属性为disabled
    $('#toolbar button').attr('disabled', 'disabled');
    //移除增加按钮属性disabled
    $('#toolbar #btn-add').removeAttr('disabled');
    //rows为json数据
    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();

    var length = rows.length;

    if (length === 1) {
        $('#toolbar #btn-edit').removeAttr('disabled');
    }
    if (length > 0) {
        $('#toolbar #btn-del').removeAttr('disabled');
    }

};

var queryParams = {};
var initBootstrapTables = function () {

    var options = {
        //请求后台的URL
        url: PAGE_URLS.GET_PAGE,
        //工具栏
        toolbar: '#toolbar',
        //表格页码
        queryParams: function (e) {
            //将Json解析为字符串。。。。分页
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
            field: 'keywords',
            title: '关键词'
        }, {
            field: 'orderNum',
            title: '排序编号'
        }, {
            field: 'enable',
            title: '是否启用',
            formatter: function (value, row, index) {
                return value ? "是" : "否";
            }
        }, {
            field: 'createDatetime',
            title: '创建时间'
        }, {
            field: 'updateDatetime',
            title: '修改时间'
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
        //刷新
        onRefresh: function () {

            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            toolbarListener();
        }

    };

    $(PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var editedCallback = function (params) {

    var optHandle = params.yesCallbackParams.viewOptHandle;

    var result = params.result;

    if (!result) {
        return;
    }

    if (checkRespCodeSuccess(result)) {

        layer.close(params.layerIndex);

        if (OPT_HANDLE.UPDATE === optHandle) {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRefreshCurrentPage();
        } else {
            $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
        }

        return;
    }

    new Message().show(result.errDesc);
};

//删除功能
function deleteCallback() {
    //实例
    var ids = [];
    //rows为获取选中行数据,JSON.stringify(rows)为选中行Json数据，JSON.stringify(row)为选中行的对象
    var rows = $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelections();
    //遍历处理数据
    $.each(rows, function (index, row) {
        //row.id为选中行id
        ids.push(row.id);

    });
    var params = {
        ids: ids
    };
    //发送请求，数据为选中行id
    $.sendRequest(PAGE_URLS.DELETE, JSON.stringify(params), {async: true}, function (result) {

        if (!checkRespCodeSuccess(result)) {

            new Message().show(result.errDesc);
            return;
        }
        //********删除指定行id*******
        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveByUniqueIds(ids, true);
    });

}

var initPageDom = function () {

    //查询
    $('#page-data-query-btn').click(function () {

        queryParams = $('#page-data-query-form').serializeJson();

        $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableSelectFirstPage();
    });

    $('#toolbar button').click(function () {

        //layer 标题
        var title = $(this).attr('data-title');

        var optHandle = $(this).attr('data-handle');

        //删除弹出框
        if (OPT_HANDLE.DELETE === optHandle) {

            new Message().confirm('确定删除选中数据？', deleteCallback);

            return;
        }

        var callParams = {};

        if (OPT_HANDLE.UPDATE === optHandle) {
            $.extend(callParams, {
                //被选中的行
                id: $(PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableGetSelectionRow().id
            })
        }

        var yesCallbackParams = {
            viewOptHandle: optHandle
        };
        //增加的layer页面
        new Message().openView({
            content: [contextPath + '/hotKeywords/editPage', 'no'],
            title: title,
            area: ['420px', '340px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });
};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});