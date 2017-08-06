'use strict';
angular.module('app').controller('loginCtrl', ['cache','$http', '$state', '$scope', function(cache, $http, $state, $scope) {
    $scope.submit = function() {
        $http.post('data/login.json', $scope.user).then(function(res) {
            console.log(res);
            // 将登陆成功后服务器返回的信息存储在cookie里面.
            cache.put('id', res.data.id);
            cache.put('name', res.data.name);
            cache.put('image', res.data.image);
            // 跳转到主页
            $state.go('main');
        });
    }
}]);