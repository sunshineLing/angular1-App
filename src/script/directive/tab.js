'use strict';
angular.module('app').directive('appTab', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=',  // 关联到searchCtrl里面的tabList的值
            tabClick: '&'  // 通知付控制器，这个tab被点击了
        },
        templateUrl: 'view/template/tab.html',
        link: function($scope) {
            $scope.click = function(item) {
                // 点击的时候设置active样式
                $scope.selectId = item.id;
                $scope.tabClick(item);  // 调用父组件上定义的这个函数
            }
        }
    };
}]);