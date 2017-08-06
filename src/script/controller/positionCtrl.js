'use strict';
// 职位详情页面
angular.module('app').controller('positionCtrl', ['$log', '$q', '$http', '$state', '$scope', 'cache', function($log, $q, $http, $state, $scope, cache) {
    // 添加一个cookie值
    // cache.put('name', 'zhangsan');
    // cache.remove('name');
    
    // 从cookie里面获取有没有存入名字，来判断是否登陆
    $scope.isLogin = !!cache.get('name');  // 布尔值
    // 职位详情页面下方的button文字，根据登陆状态来判断
    $scope.message = $scope.isLogin?'投个简历':'去登陆';

    // 获取职位详情信息，需要传递当前点击的职位的id信息过去
    function getPosition() {
        // 延迟加载对象
        var def = $q.defer();
        $http.get('data/position.json', {
            params: {
                id: $state.params.id  // 获取到上一个页面传递过来的id值
            }
        }).then(function(res) {
            // 通过属性pos关联到positionInfo数据上
            $scope.position = res.data;
            if (res.posted) {
                $scope.message = '已投递';
            }
            // 执行成功将结果传递出去
            def.resolve(res);
        }).catch(function(err) {
            def.reject(err);
        })
        return def.promise;
    }

    // 获取公司信息
    function getCompany(id) {
        $http.get('data/company.json?id=' + id).then(function(res) {
            $scope.company = res.data;  // 获取到的值，传递到company模板页面
        })
    }

    
    getPosition().then(function(obj) {
        getCompany(obj.companyId);
    })

    // 底部button按钮绑定的事件
    $scope.go = function() {
        if ($scope.message !== '已投递') {
            if ($scope.isLogin) {
                // 去投递简历
                $http.post('data/handle.json', {
                    id: $scope.position.id
                }).then(function(res) {
                    $log.info(res);
                    $scope.message = '已投递';
                });
            } else {
                $state.go('login');  // 跳转到登陆页面
            }
        }
    }
}])