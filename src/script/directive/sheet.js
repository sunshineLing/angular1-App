'use strict';
angular.module('app').directive('appSheet', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=',
            visible: '=',  // 父组件传递的
            select: '&'  // 向父组件传递事件
        },
        templateUrl: 'view/template/sheet.html'
    };
}]);