// 职位详情position.html的app-head-bar对应的指令
'use strict';
angular.module('app').directive('appHeadBar', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/headBar.html',
        scope: {
            text: '@'  //表示绑定的是字符串
        },
        link: function($scope) {  // 定义内在逻辑
            $scope.back = function() {
                // 模板里面的点击返回事件函数
                window.history.back();
            }
        }
    }
}])