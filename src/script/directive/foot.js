'use strict';
// 定义main.js里面的app-foot指令
angular.module('app').directive('appFoot', [function() {
    return {
        restrict: 'A',  //替换属性模板
        replace: true,
        templateUrl: 'view/template/foot.html'
    }
}])