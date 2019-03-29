//获取表单数据id
var PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-data-table'
};
//网络接口
var PAGE_URLS = {
    //数据查询
    GET_PAGE: contextPath + '/repertory/getPage',
    //数据删除
    DELETE: contextPath + '/repertory/delete',
    //获取国家信息
    GET_ALL: contextPath + "/country/getAll"

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
            field: 'id',
            title: '主键',
            align: 'center'
        }, {
            field: 'country',
            title: '国家名称',
            align:'center',
            formatter: function (value, row, index) {
                return value ? value.name : null;
            }
            //一般使用时是在对数据库读取的数据不能直接显示时，需要进行转换时调用formatter，
            // formatter: function (value, row, index) {
        }, {
            field: 'code',
            title: '仓库编码',
            align:'center'
        }, {
            field: 'name',
            title: '仓库名称',
            align:'center'
        }, {
            field: 'address',
            title: '详细地址',
            align:'center'
        },  {
            field: 'defaultSenderName',
            title: '默认发货人',
            align:'center'
        },  {
            field: 'defaultSenderPhoneNo',
            title: '默认发货电话号码',
            align:'center'
        }, {
            field: 'manager',
            title: '管理人员',
            align:'center'
        }, {
            field: 'phoneNo',
            title: '电话号码',
            align:'center'
        }, {
            field: 'bossName',
            title: '老板名称',
            align:'center'
        }, {
            field: 'paymentType',
            title: '支付方式',
            align:'center'
        }, {
            field: 'paymentAccountNo',
            title: '支付账号',
            align:'center'
        }, {
            field: 'remark',
            title: '详细备注',
            align:'center'
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align:'center'
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align:'center'
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
            content: [contextPath + '/repertory/editPage', 'no'],
            title: title,
            area: ['800px', '485px']
        }, 'initPage', callParams, 'saveOrUpdate', null, editedCallback, yesCallbackParams);

    });

    $.sendRequest(PAGE_URLS.GET_ALL, JSON.stringify({}), {async: false}, function (result) {

        if (checkRespCodeSuccess(result)) {

            $.each(result.data, function (index, row) {
                $('<OPTION>').val(row.id).text(row.name).appendTo($('#country-list'));
            });
        }
    });

};

$(function () {

    initPageDom();

    initBootstrapTables();

    toolbarListener();

});