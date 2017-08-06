'use strict';
// 
angular.module('app').directive('appCompany', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            com: '='  // 先在positionCtrl里面获取到值
        },
        templateUrl: 'view/template/company.html'
    };
}]);