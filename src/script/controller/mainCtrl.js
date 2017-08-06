'use strict';
// 控制首页的数据展示
angular.module('app').controller('mainCtrl', ['$http', '$scope', function($http, $scope) {
    $http.get('/data/positionList.json').then(function(res) {
        $scope.list = res.data;
    }).catch(function(err) {
        console.log(err);
    })
}])