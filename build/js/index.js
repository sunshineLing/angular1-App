'use strict';

// 创建一个模块，声明依赖
angular.module('app', ['ui.router', 'ngCookies', 'validation', 'ngAnimate']);
'use strict';
angular.module('app').value('dict', {}).run(['dict', '$http', function(dict, $http) {
    $http.get('data/city.json').then(function(res) {
        dict.city = res.data;
    });
    $http.get('data/salary.json').then(function(res) {
        dict.salary = res.data;
    });
    $http.get('data/scale.json').then(function(res) {
        dict.scale = res.data;
    });
}])
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
'use strict';

// 导入app模块，配置
// 第一个参数是配置路由的，第二个是用来
angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // main是导航的名字
    $stateProvider.state('main', {
        url: '/main',  // url是路径
        templateUrl: 'view/main.html',  // 模板
        controller: 'mainCtrl'  
    }).state('position', {  // 职位详情页的路由
        url: '/position/:id',
        templateUrl: 'view/position.html',
        controller: 'positionCtrl'
    }).state('company', {
        url: '/company/:id',
        templateUrl: 'view/company.html',
        controller: 'companyCtrl'
    }).state('search', {
        url: '/search',
        templateUrl: 'view/search.html',
        controller: 'searchCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'view/login.html',
        controller: 'loginCtrl'
    }).state('register', {
        url: '/register',
        templateUrl: 'view/register.html',
        controller: 'registerCtrl'
    }).state('post', {
        url: '/post',
        templateUrl: 'view/post.html',
        controller: 'postCtrl'
    }).state('me', {
        url: '/me',
        templateUrl: 'view/me.html',
        controller: 'meCtrl'
    }).state('favorite', {
        url: '/favorite',
        templateUrl: 'view/favorite.html',
        controller: 'favoriteCtrl'
    })
    // 导航重定向到main上面
    $urlRouterProvider.otherwise('main');
}])
'use strict';
angular.module('app').config(['$validationProvider', function($validationProvider) {
    // 校验规则
    var expression = {
        phone: /^1[\d]{10}$/,
        password: function(value) {
            var str = value + '';
            return str.length > 5;
        },
        required: function(value) {
            return !!value;
        }
    };

    // 错误提示信息
    var defaultMsg = {
        phone: {
            success: '',
            error: '必须是11位手机号码'
        },
        password: {
            success: '',
            error: '长度至少6位'
        },
        required: {
            success: '',
            error: '不能为空'
        }
    };

    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);
'use strict';
angular.module('app').controller('companyCtrl',['$http', '$state', '$scope', function($http, $state, $scope) {
    $http.get('data/company.json?id=' + $state.params.id).then(function(res) {
        $scope.company = res.data;   // 数据供两个模板使用
    })
}])
'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope) {
    $http.get('data/myFavorite.json').then(function(res) {
        console.log(res);
        $scope.list = res.data;
    })
}])
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
'use strict';
// 控制首页的数据展示
angular.module('app').controller('mainCtrl', ['$http', '$scope', function($http, $scope) {
    $http.get('/data/positionList.json').then(function(res) {
        $scope.list = res.data;
    }).catch(function(err) {
        console.log(err);
    })
}])
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
'use strict';
angular.module('app').controller('postCtrl', ['$http', '$scope', function ($http, $scope) {
    $scope.tabList = [{
        id: 'all',
        name: '全部'
    }, {
        id: 'pass',
        name: '面试邀请'
    }, {
        id: 'fail',
        name: '不合适'
    }];

    // 获取投递的职位列表的信息
    $http.get('data/myPost.json').then(function (res) {
        console.log(res);
        $scope.positionList = res.data;
    });

    // 设置过滤条件
    $scope.filterObj = {};

    $scope.tClick = function (id, name) {
        switch (id) {
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
            default:
        }
    }
}])
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
'use strict';
angular.module('app').controller('searchCtrl', ['$http', '$scope', 'dict', function ($http, $scope, dict) {
    $scope.name = '';

    // search事件
    // 获取到职位列表信息
    $scope.search = function () {
        // 查询的参数是name
        $http.get('data/positionList.json?name=' + $scope.name).then(function (res) {
            console.log(res.data);
            $scope.positionList = res.data;
        });
    };

    // 默认进入页面时即显示
    $scope.search();

    // 获取tabList的值
    $scope.tabList = [{
        id: 'city',
        name: '城市'
    }, {
        id: 'salary',
        name: '薪水'
    }, {
        id: 'scale',
        name: '公司规模'
    }];

    // console.log(dict);  // 传入的帅选数组对象
    // tab-click属性对应的函数tClick,子组件点击事件，传入了id和name
    var tabId = '';
    $scope.sheet = {};
    $scope.filterObj = {};  // 初始化过滤条件对象
    // 父组件点击当前tab事件
    $scope.tClick = function (id, name) {
        tabId = id;
        // 点击的时候子组件被激活，父组件弹出框
        // 根据对应的条件
        $scope.sheet.list = dict[id];
        console.log($scope.sheet.list)
        // 弹出框显示
        $scope.sheet.visible = true;
    };

    // 点击弹框列表项时操作
    $scope.sClick = function(id, name) {
        console.log(id, name);
        // 第一项没有id
        if (id) {
            angular.forEach($scope.tabList, function(item) {
                if (item.id === tabId) {
                    // 让当前显示的城市改变为当前点击的项目的name
                    item.name = name;
                }
            });

            // 点击了这一项的时候，设置positionList数据显示的过滤条件
            $scope.filterObj[tabId + 'Id'] = id;  
            console.log($scope.filterObj);
            // 相当于filterObj = {
            //     tabId + 'Id': id
            // }
        } else {  // 没有id，就还原
            // 不需要过滤器
            delete $scope.filterObj[tabId + 'Id'];

            angular.forEach($scope.tabList, function(item) {
                // 也需要判断点击的是哪一个选项
                if (item.id === tabId) {
                    switch(item.id) {
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                        default:
                    }
                }
            })
        }
    }
}])

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
'use strict';
// 定义main.js里面的app-foot指令
angular.module('app').directive('appFoot', [function() {
    return {
        restrict: 'A',  //替换属性模板
        replace: true,
        templateUrl: 'view/template/foot.html'
    }
}])
'use strict';

// main.html里面 app-head对应的指令，必须驼峰写法
angular.module('app').directive('appHead', ['cache', function(cache) {
    return {
        restrict: 'A',  //以属性的方式调用指令，即前面的main.html里面的app-head指令
        replace: true,
        templateUrl: 'view/template/head.html',
        link: function($scope) {
            // 从cookie里面获取name
            $scope.name = cache.get('name') || '';
        }
    }
}])
// 职位详情position.html的app-head-bar对应的指令
'use strict';
angular.module('app').directive('appHeadBar', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/headBar.html',
        scope: {
            text: '@'  //表示绑定的是字符串
        },
        link: function($scope) {  // 定义内在逻辑
            $scope.back = function() {
                // 模板里面的点击返回事件函数
                window.history.back();
            }
        }
    }
}])
'use strict';
// 对应公司详情的职位分类的指令
angular.module('app').directive('appPositionClass', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            com: '='
        },
        templateUrl: 'view/template/positionClass.html',
        link: function($scope) {
            // 通过传递的索引值，获取到职位分类列表
            $scope.showPositionList = function(index) {
                $scope.positionList = $scope.com.positionClass[index].positionList;
                // 让当前的高亮项是当前的索引值
                $scope.isActive = index;
            }

            // 设置默认激活项为第一项,因为如果不监听的话，会出现进入页面的时候，com对象还没有生成，导致无法显示职位列表项
            $scope.$watch('com', function(newVal) {
                if (newVal) {
                    $scope.showPositionList(0);
                }
            }) 
        }
    };
}]);
'use strict';
// 对应position职位详情里面的信息，模板和主页面的关系
angular.module("app").directive('appPositionInfo', ['$http', function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionInfo.html',
        scope: {
            isActive: '=',  // '='表示传递的是变量
            isLogin: '=',
            pos: '='  // 在positionCtrl里面获取，用pos属性传递，此处又和模板里面关联，模板里面的数据是pos
        },
        link: function($scope) {
            // 解决没有获取到值的情况
            $scope.$watch('pos', function(newVal) {
                if (newVal) {
                    $scope.pos.select = $scope.pos.select || false;
                    $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
                }
            })
            // 点击收藏当前职位的时候，传递数据到后台
            $scope.post('data/favorite.json', {
                id: $scope.pos.id,
                select: !$scope.pos.select
            }).then(function(res) {
                $scope.pos.select = !$scope.pos.select;
                $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
            });
        }
    }
}])
'use strict';
angular.module('app').directive('appPositionList', [function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        scope: {
            data: '=',  //表示scope声明的这个属性和mainCtrl控制器是共享的
            filterObj: '=',  // 父组件传递过来的过滤对象
            isFavorite: '='
        },
        link: function($scope) {
            // 点击收藏按钮时，会把当前项发送到后台
            $scope.select = function(item) {
                $http.post('data/favorite.json', {
                    id: item.id,
                    select: !item.select
                }).then(function(res) {
                    item.select = !item.select;
                })
            };
        }
    };
}]);
'use strict';
angular.module('app').directive('appSheet', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=',
            visible: '=',  // 父组件传递的
            select: '&'  // 向父组件传递事件
        },
        templateUrl: 'view/template/sheet.html'
    };
}]);
'use strict';
angular.module('app').directive('appTab', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=',  // 关联到searchCtrl里面的tabList的值
            tabClick: '&'  // 通知付控制器，这个tab被点击了
        },
        templateUrl: 'view/template/tab.html',
        link: function($scope) {
            $scope.click = function(item) {
                // 点击的时候设置active样式
                $scope.selectId = item.id;
                $scope.tabClick(item);  // 调用父组件上定义的这个函数
            }
        }
    };
}]);
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