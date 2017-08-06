// 修改angular的http内置服务，装饰器
// 因为是模拟数据，所以post请求没有返回，需要把post请求转化为get请求，返回数据
'use strict';
angular.module('app').config(['$provide', function ($provide) {
    $provide.decorator('$http', ['$delegate', '$q', function ($delegate, $q) {
        $delegate.post = function (url, data, config) {
            var def = $q.defer();
            $delegate.get(url).then(function (res) {
                def.resolve(res);
            }).catch(function (err) {
                def.reject(err);
            });
            return {
                then: function (cb) {
                    def.promise.then(cb);
                },
                catch: function (cb) {
                    def.promise.then(null, cb);
                }
            }
        }
        return $delegate;
    }]);
}]);