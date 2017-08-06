'use strict';
angular.module('app').controller('searchCtrl', ['$http', '$scope', 'dict', function ($http, $scope, dict) {
    $scope.name = '';

    // search事件
    // 获取到职位列表信息
    $scope.search = function () {
        // 查询的参数是name
        $http.get('data/positionList.json?name=' + $scope.name).then(function (res) {
            console.log(res.data);
            $scope.positionList = res.data;
        });
    };

    // 默认进入页面时即显示
    $scope.search();

    // 获取tabList的值
    $scope.tabList = [{
        id: 'city',
        name: '城市'
    }, {
        id: 'salary',
        name: '薪水'
    }, {
        id: 'scale',
        name: '公司规模'
    }];

    // console.log(dict);  // 传入的帅选数组对象
    // tab-click属性对应的函数tClick,子组件点击事件，传入了id和name
    var tabId = '';
    $scope.sheet = {};
    $scope.filterObj = {};  // 初始化过滤条件对象
    // 父组件点击当前tab事件
    $scope.tClick = function (id, name) {
        tabId = id;
        // 点击的时候子组件被激活，父组件弹出框
        // 根据对应的条件
        $scope.sheet.list = dict[id];
        console.log($scope.sheet.list)
        // 弹出框显示
        $scope.sheet.visible = true;
    };

    // 点击弹框列表项时操作
    $scope.sClick = function(id, name) {
        console.log(id, name);
        // 第一项没有id
        if (id) {
            angular.forEach($scope.tabList, function(item) {
                if (item.id === tabId) {
                    // 让当前显示的城市改变为当前点击的项目的name
                    item.name = name;
                }
            });

            // 点击了这一项的时候，设置positionList数据显示的过滤条件
            $scope.filterObj[tabId + 'Id'] = id;  
            console.log($scope.filterObj);
            // 相当于filterObj = {
            //     tabId + 'Id': id
            // }
        } else {  // 没有id，就还原
            // 不需要过滤器
            delete $scope.filterObj[tabId + 'Id'];

            angular.forEach($scope.tabList, function(item) {
                // 也需要判断点击的是哪一个选项
                if (item.id === tabId) {
                    switch(item.id) {
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                        default:
                    }
                }
            })
        }
    }
}])
