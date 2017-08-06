var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

// 目录路径
var app = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};

// 拷贝文件,将依赖文件放在开发目录和生产目录下
// 定义一个任务
gulp.task('lib', function() {
    // 任务内容
    // 读取文件
    gulp.src('lib/**/*.js')
    // 读取到生产环境和上线环境
    .pipe(gulp.dest(app.devPath + 'vendor'))
    .pipe(gulp.dest(app.prdPath + 'vendor'))
    // 因为serve服务里面做了watch监控，所以每次src下面的原文件更改之后，会自动构建，构建之后会热启动，刷新页面
    .pipe($.connect.reload())
})

// 建立html文件,定义任务明恒为
gulp.task('html', function() {
    // 读取这个文件夹下面的所有的html文件，进行拷贝
    gulp.src(app.srcPath + '**/*.html')
    .pipe(gulp.dest(app.devPath))
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload())
})

// 读取假数据的任务，因为此处是没有后台服务器的
gulp.task('json', function() {
    // 从src的data文件夹下读取json文件，读入到build下面的data文件夹下
    gulp.src(app.srcPath + 'data/**/*.json')
    .pipe(gulp.dest(app.devPath + 'data'))
    .pipe(gulp.dest(app.prdPath + 'data'))
    .pipe($.connect.reload())
})

// less任务
gulp.task('less', function() {
    gulp.src(app.srcPath + 'style/index.less')
    .pipe($.less())
    // 编译完成之后放入生产环境
    .pipe(gulp.dest(app.devPath + 'css'))
    // 压缩
    .pipe($.cssmin())
    // 压缩之后放入上线环境
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe($.connect.reload())
})

// js任务
gulp.task('js', function() {
    gulp.src(app.srcPath + 'script/**/*.js')
    // 把src下面的所有js合并成一个文件,index.js
    .pipe($.concat('index.js'))
    // 放入开发目录
    .pipe(gulp.dest(app.devPath + 'js'))
    // 压缩
    .pipe($.uglify())
    // 发布到生产环境
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload())
})

// image任务
gulp.task('image', function() {
    gulp.src(app.srcPath + 'image/**/*')
    .pipe(gulp.dest(app.devPath + 'image'))
    // 压缩
    .pipe($.imagemin())
    .pipe(gulp.dest(app.prdPath + 'image'))
    .pipe($.connect.reload())
})

// 打包整个项目，合并,不需要每次一个个的用gulp js等命令启动
gulp.task('build', ['image', 'js', 'less', 'lib', 'html', 'json']);

// 服务器任务
gulp.task('serve', ['build'], function() {
    $.connect.server({
        // 默认从开发模式下读取
        root: [app.devPath],
        // 自动刷新浏览器，热启动
        livereload: true,
        // 启动端口
        port: 1234
    });
    // 自动打开网址
    open('http://localhost:1234');

    // 自动监控src下面的原文件更改，有更改就自动构建
    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'image/**/*', ['image']);
});

// default默认任务，想调用serve的时候，不需要用gulp serve，只需要执行gulp就可以了
gulp.task('default', ['serve']);

// clean删除任务，删除两个文件夹
gulp.task('clean', function() {
    gulp.src([app.devPath, app.prdPath])
    .pipe($.clean());
})

