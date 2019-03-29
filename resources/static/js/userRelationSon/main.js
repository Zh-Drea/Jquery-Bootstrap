var PAGE_URL = {
    QUERY_FATHER: contextPath + "/user/getParentByPid"
};

var rows = {};

var sendParams = {};

var msg = new Message();

var queryTreeFather = function (param) {

    if (param.children[0].pid === sendParams.id) {

        if (!sendParams.res.pid){

            sendParams.res.itemStyle = {
                opacity : 1,
                borderColor : 'black'
            }
        }

        param.children[0].children = [sendParams.res];
    }

    else{

        var value = param.children[0];

        queryTreeFather(value);
    }

};

var initPage = function (param) {

    var result = $.sendRequest(PAGE_URL.QUERY_FATHER,JSON.stringify({id:param.callParams.parentUserId}));

    if (!checkRespCodeSuccess(result)) {

        msg.show(result.errDesc);

        return;
    }
    
    if (!result.data.pid) {

        result.data.itemStyle = {
            opacity : 1,
            borderColor : 'black'
        }
    }

    var myChart = echarts.init(document.getElementById('chartMain'));

    myChart.showLoading();

    rows.name = param.callParams.phoneNo;

    rows.children = [result.data];

    myChart.hideLoading();

    var option = {
        series:[
            {
                type: 'tree',

                data: [rows],

                top: '2%',
                left: '18%',
                bottom: '10%',
                right: '18%',

                symbolSize: 7,

                initialTreeDepth:-1,

                // itemStyle: {
                //     opacity : 1,
                //     borderColor : 'black'
                // },

                orient: 'RL',

                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                },

                leaves: {
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
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

                if (param.data.pid) {

                    var result = $.sendRequest(PAGE_URL.QUERY_FATHER,JSON.stringify({id:param.data.pid}));

                    if (!checkRespCodeSuccess(result)) {

                        msg.show(result.errDesc);

                        return;
                    }

                    sendParams = {
                        id:param.data.pid,
                        res:result.data
                    };

                    queryTreeFather(rows);

                    myChart.setOption(option,true);
                }
                else{

                    msg.show("该用户没有上级用户!");
                }
            }
        }
    }
};