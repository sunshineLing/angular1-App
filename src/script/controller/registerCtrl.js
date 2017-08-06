'use strict';
angular.module('app').controller('registerCtrl', ['$interval', '$http', '$state', '$scope', function($interval, $http, $state, $scope) {
    $scope.submit = function() {
        console.log($scope.user);
        $http.post('data/regist.json', $scope.user).then(function(res) {
            // 成功之后跳转到登陆页面
            console.log(res);
            $state.go('login');
        });
    };

    var count = 60;
    $scope.send = function() {
        console.log(1);
        $http.get('data/code.json').then(function(res) {
            console.log(res);
            if (res.data.state === 1) {
                count = 60;
                $scope.time = '60s';
                var timer = $interval(function() {
                    if (count <= 0) {
                        $interval.cancel(timer);
                        $scope.timer = '';
                    } else {
                        count--;
                        $scope.time = count + 's';
                    }
                }, 1000);
            }
        });
    }
}]);