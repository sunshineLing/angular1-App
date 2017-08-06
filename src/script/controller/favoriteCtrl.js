'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope) {
    $http.get('data/myFavorite.json').then(function(res) {
        console.log(res);
        $scope.list = res.data;
    })
}])