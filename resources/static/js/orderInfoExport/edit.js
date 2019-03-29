var msg =new Message();

$(function () {

    layui.use('laydate', function () {

        var laydate = layui.laydate;

        laydate.render({
            elem: '#dateInterval'
            ,type: 'datetime'
            ,range:true
            ,max:1
        });
    });

    $('#checkNo').click(function () {

        var res = $('#dateInterval').val();

        if (res) {
            return true;
        }
        else {
            msg.show("时间区段不能为空!");
            return false;
        }
    });

});

