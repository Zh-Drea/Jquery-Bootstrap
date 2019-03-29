var ITEM_PAGE_DOMS = {
    PAGE_DATA_TABLE: '#page-item-data-table'
};

var ITEM_PAGE_URLS = {
    GET_PAGE: contextPath + '/applyRefundRefOrderInfoItem/getPage'
};

var msg = new Message();

var initPage = function (params) {

    initPageDom(params);

};

var itemQueryParams = {};

var initPageDom = function (params) {

    initItemPageDom(params);

    if (params.callParams.applyRefundId) {
        itemQueryParams.applyRefundId = params.callParams.applyRefundId;
    }

    initItemBootstrapTable();

    itemToolbarListener();

};

var itemToolbarListener = function () {

};

var initItemBootstrapTable = function () {

    var options = {
        url: ITEM_PAGE_URLS.GET_PAGE,
        toolbar: '#toolbar-item',
        singleSelect: true,
        queryParams: function (e) {

            return JSON.stringify($.extend(itemQueryParams, {
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
        },  {
            field: 'orderInfoItem',
            title: '属性选项',
            align: 'center',
            formatter: function (value,row,index) {
                if (null === value.sku.skuRefGoodsAttributeOptions) {
                    return "";
                }
                var names = [];

                $.each(value.sku.skuRefGoodsAttributeOptions,function (index , o) {
                    names.push(o.goodsAttribute.name+ ':'+o.goodsAttributeOption.value);
                });

                return names.join(" ; ");
            }
        }, {
            field: 'orderInfoItem',
            title: 'sku名称',
            align: 'center',
            formatter: function (value, row, index) {
                return value.skuName ? value.skuName : null;
            }
        }, {
            field: 'orderInfoItem',
            title: '备案编号',
            align: 'center',
            formatter: function (value, row, index) {
                return value.skuRecordNo ? value.skuRecordNo : null;
            }
        }, {
            field: 'num',
            title: '退款商品个数',
            align: 'center'
        }, {
            field: 'orderInfoItem',
            title: '下单个数',
            align: 'center',
            formatter: function (value, row, index) {
                return value.num;
            }
        }, {
            field: 'refundAmount',
            title: '退款总金额',
            align: 'center'
        }, {
            field: 'orderInfoItem',
            title: '订单总金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.totalAmount;
            }
        },  {
            field: 'orderInfoItem',
            title: '订单支付金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.payAmount;
            }
        }, {
            field: 'orderInfoItem',
            title: '订单商品金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.goodsAmount;
            }
        }, {
            field: 'orderInfoItem',
            title: '订单税费金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.taxAmount;
            }
        }, {
            field: 'orderInfoItem',
            title: '订单特殊服务费金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.specialServiceAmount;
            }
        }, {
            field: 'orderInfoItem',
            title: '订单优惠金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.couponAmount;
            }
        }, {
            field: 'orderInfoItem',
            title: '订单成本金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.costAmount;
            }
        }, {
            field: 'orderInfoItem',
            title: '订单盈利金额',
            align: 'center',
            formatter: function (value, row, index) {
                return value.winningsAmount;
            }
        }, {
            field: 'orderInfoItem',
            title: '备注',
            align: 'center',
            formatter: function (value, row, index) {
                return value.remark ? value.remark : null;
            }
        }, {
            field: 'createDatetime',
            title: '创建时间',
            align: 'center',
            visible: false
        }, {
            field: 'updateDatetime',
            title: '修改时间',
            align: 'center',
            visible: false
        }
        ],
        onCheck: itemToolbarListener,
        onUncheck: itemToolbarListener,
        onCheckAll: itemToolbarListener,
        onUncheckAll: itemToolbarListener,
        onPageChange: function (number, size) {

            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            itemToolbarListener();
        },
        onRefresh: function () {

            $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).bootstrapTableRemoveAll();

            itemToolbarListener();
        }
    };

    $(ITEM_PAGE_DOMS.PAGE_DATA_TABLE).initBootstrapTable(options, true);
};

var initItemPageDom = function (params) {


};
