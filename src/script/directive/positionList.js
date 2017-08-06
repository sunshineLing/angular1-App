'use strict';
angular.module('app').directive('appPositionList', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        scope: {
            data: '=',  //表示scope声明的这个属性和mainCtrl控制器是共享的
            filterObj: '=',  // 父组件传递过来的过滤对象
            isFavorite: '='
        },
        link: function($scope) {
            // 点击收藏按钮时，会把当前项发送到后台
            $scope.select = function(item) {
                $http.post('data/favorite.json', {
                    id: item.id,
                    select: !item.select
                }).then(function(res) {
                    item.select = !item.select;
                })
            };
        }
    };
}]);