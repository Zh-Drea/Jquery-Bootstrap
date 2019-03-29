var PAGE_URL = {
    QUERY_SON: contextPath + "/user/getAllChildren"
};

var rows = {};

var sendParams = {};

var msg = new Message();

var queryTreeSon = function (param) {

    $.each(param.children,function (index,value) {

        if (value.id === sendParams.id) {

            $.each(sendParams.res,function (i,o) {

                if (!o.childrenNode) {

                    o.itemStyle = {
                        opacity : 1,
                        borderColor : 'black'
                    }
                }
            });

            value.children = sendParams.res;
        }
        else{

            queryTreeSon(value);
        }
    });
};

var initPage = function (param) {

    var result = $.sendRequest(PAGE_URL.QUERY_SON,JSON.stringify({id:param.callParams.id}));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;
    }

    if (result.data.length === 0) {

        msg.show("该用户暂无子级用户!");

        return;
    }

    $.each(result.data,function (index,obj) {

        if (!obj.childrenNode) {

            obj.itemStyle = {
                opacity : 1,
                borderColor : 'black'
            }
        }
    });

    var myChart = echarts.init(document.getElementById('chartMain'));

    myChart.showLoading();

    rows.name = param.callParams.phoneNo;

    rows.children = result.data;

    myChart.hideLoading();

    var option = {

        series:[
            {
                type: 'tree',
                name: '关系树图',
                data: [rows],

                top: '2%',
                left: '18%',
                bottom: '10%',
                right: '18%',

                symbolSize: 7,
                //默认展示所有列
                initialTreeDepth:-1,

                // itemStyle: {
                //     opacity : 1,
                //     borderColor : 'black'
                // },
                label: {
                    normal: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },

                expandAndCollapse: true,

                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    };

    myChart.setOption(option);

    myChart.on("click", clickFun);

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

    function clickFun(param) {

        if (typeof param.seriesIndex === 'undefined') {

            return;
        }

        if (param.type === 'click') {

            if (!param.data.children){
                
                if (param.data.childrenNode) {

                    var result = $.sendRequest(PAGE_URL.QUERY_SON,JSON.stringify({id:param.data.id}));

                    if (!checkRespCodeSuccess(result)) {

                        msg.show(result.errDesc);

                        return;
                    }

                    sendParams = {
                        id:param.data.id,
                        res:result.data
                    };

                    queryTreeSon(rows);

                    myChart.setOption(option,true);
                }
                else {

                    msg.show("该用户没有下级用户!");
                }
            }
        }
    }
};