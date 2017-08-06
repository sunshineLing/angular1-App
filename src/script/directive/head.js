'use strict';

// main.html里面 app-head对应的指令，必须驼峰写法
angular.module('app').directive('appHead', ['cache', function(cache) {
    return {
        restrict: 'A',  //以属性的方式调用指令，即前面的main.html里面的app-head指令
        replace: true,
        templateUrl: 'view/template/head.html',
        link: function($scope) {
            // 从cookie里面获取name
            $scope.name = cache.get('name') || '';
        }
    }
}])