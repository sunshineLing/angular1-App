'use strict';
angular.module('app').service('cache', ['$cookies', function ($cookies) {
    // 创建一个对象，添加方法
    this.put = function (key, val) {
        $cookies.put(key, val);
    };

    // 取值
    this.get = function (key) {
        return $cookies.get(key);
    };

    // 删除
    this.remove = function (key) {
        $cookies.remove(key);
    };
}])