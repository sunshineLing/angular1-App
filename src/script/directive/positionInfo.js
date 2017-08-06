'use strict';
// 对应position职位详情里面的信息，模板和主页面的关系
angular.module("app").directive('appPositionInfo', ['$http', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionInfo.html',
        scope: {
            isActive: '=',  // '='表示传递的是变量
            isLogin: '=',
            pos: '='  // 在positionCtrl里面获取，用pos属性传递，此处又和模板里面关联，模板里面的数据是pos
        },
        link: function($scope) {
            // 解决没有获取到值的情况
            $scope.$watch('pos', function(newVal) {
                if (newVal) {
                    $scope.pos.select = $scope.pos.select || false;
                    $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
                }
            })
            // 点击收藏当前职位的时候，传递数据到后台
            $scope.post('data/favorite.json', {
                id: $scope.pos.id,
                select: !$scope.pos.select
            }).then(function(res) {
                $scope.pos.select = !$scope.pos.select;
                $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
            });
        }
    }
}])