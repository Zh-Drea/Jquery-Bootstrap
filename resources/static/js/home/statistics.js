var PAGE_URLS ={
    //退款处理中的退款订单总数
    ALL_REFUND_ORDER : contextPath + '/applyRefund/getApplyRefundProgressingTotal' ,
    //未审核的的退款订单总数
    ALL_NOT_AUDIT: contextPath + '/applyRefund/getApplyRefundNotAuditTotal',
    //物流总数据
    ALL_DETAIL: contextPath +'/logisticDetail/getTotalAboutLogisticDetail'
};

var msg =new Message();

function myRefresh() {

    window.location.reload();
}

$(function(){

    var allRef = $.sendRequest(PAGE_URLS.ALL_REFUND_ORDER);

    if (!checkRespCodeSuccess(allRef)) {

        msg.show(allRef.errDesc);

        return;
    }

    if (allRef.data !== 0) {

        $('#ref-pro').find('STRONG').css({
            'color' : '#FF6600'
        });

        $('<SPAN>').addClass('badge').css({'background-color' : '#FF6600'}).text(allRef.data).appendTo($('#ref-pro'));
    }
    else {
        $('<SPAN>').addClass('badge').text(allRef.data).appendTo($('#ref-pro'));
    }

    var allNotAudit = $.sendRequest(PAGE_URLS.ALL_NOT_AUDIT);

    if (!checkRespCodeSuccess(allNotAudit)) {

        msg.show(allNotAudit.errDesc);

        return;
    }

    if (allNotAudit.data !== 0) {

        $('#ref-aduit').find('STRONG').css({
            'color' : '#FF6600'
        });

        $('<SPAN>').addClass('badge').css({'background-color' : '#FF6600'}).text(allNotAudit.data).appendTo($('#ref-aduit'));
    }
    else {
        $('<SPAN>').addClass('badge').text(allNotAudit.data).appendTo($('#ref-aduit'));
    }

    var allDetail = $.sendRequest(PAGE_URLS.ALL_DETAIL);

    if (!checkRespCodeSuccess(allDetail)) {

        msg.show(allDetail.errDesc);

        return;
    }

    if (allDetail.data.orderInfoWaitForDelivery !== 0) {

        $('#order-info-wait').find('STRONG').css({
            'color' : '#FF6600'
        });

        $('<SPAN>').addClass('badge').css({'background-color' : '#FF6600'}).text(allDetail.data.orderInfoWaitForDelivery).appendTo($('#order-info-wait'));
    }
    else{
        $('<SPAN>').addClass('badge').text(allDetail.data.orderInfoWaitForDelivery).appendTo($('#order-info-wait'));
    }

    if (allDetail.data.logisticStateFailure !== 0) {

        $('#logistic-num').find('STRONG').css({
            'color' : '#FF6600'
        });

        $('<SPAN>').addClass('badge').css({'background-color' : '#FF6600'}).text(allDetail.data.logisticStateFailure).appendTo($('#logistic-num'));
    }
    else {
        $('<SPAN>').addClass('badge').text(allDetail.data.logisticStateFailure).appendTo($('#logistic-num'));
    }
    if (allDetail.data.orderPackageNotDeliver !== 0) {

        $('#order-not-deliver').find('STRONG').css({
            'color' : '#FF6600'
        });

        $('<SPAN>').addClass('badge').css({'background-color' : '#FF6600'}).text(allDetail.data.orderPackageNotDeliver).appendTo($('#order-not-deliver'));
    }
    else {
        $('<SPAN>').addClass('badge').text(allDetail.data.orderPackageNotDeliver).appendTo($('#order-not-deliver'));
    }
});


$(function () {

    setTimeout('myRefresh()', 600000);

});