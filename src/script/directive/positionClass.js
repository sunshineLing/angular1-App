'use strict';
// 对应公司详情的职位分类的指令
angular.module('app').directive('appPositionClass', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            com: '='
        },
        templateUrl: 'view/template/positionClass.html',
        link: function($scope) {
            // 通过传递的索引值，获取到职位分类列表
            $scope.showPositionList = function(index) {
                $scope.positionList = $scope.com.positionClass[index].positionList;
                // 让当前的高亮项是当前的索引值
                $scope.isActive = index;
            }

            // 设置默认激活项为第一项,因为如果不监听的话，会出现进入页面的时候，com对象还没有生成，导致无法显示职位列表项
            $scope.$watch('com', function(newVal) {
                if (newVal) {
                    $scope.showPositionList(0);
                }
            }) 
        }
    };
}]);