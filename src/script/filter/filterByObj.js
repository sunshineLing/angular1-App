// 船建一个过滤器
'use strict';
angular.module('app').filter('filterByObj', [function() {
    // obj是过滤的对象
    // 比如：Object {cityId: "c1"}
    return function(list, obj) {
        var result = [];
        // 遍历原数组
        angular.forEach(list, function(item) {
            // 设置一个标识符
            var isEqual = true;
            // 遍历传入的对象的k
            for (var k in obj) {
                // 判断同样的属性的值是不是相等
                if (item[k] !== obj[k]) {
                    isEqual = false;
                }
            }
            if (isEqual) {
                result.push(item);
            }
        });
        return result;
    };
}]);