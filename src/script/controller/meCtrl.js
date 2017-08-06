'use strict';
angular.module('app').controller('meCtrl', ['$state', 'cache', '$http', '$scope', function($state, cache, $http, $scope) {
    // 从缓存里面取得用户的信息
    if (cache.get('name')) {
        $scope.name = cache.get('name');
        $scope.image = cache.get('image');
    }

    // 退出的时候删除cookie里面的信息
    $scope.logout = function() {
        cache.remove('id');
        cache.remove('name');
        cache.remove('image');
        // 跳转到主页
        $state.go('main');
    }
}])