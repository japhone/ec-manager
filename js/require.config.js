require.config({
    baseUrl: "../bower_components/",
    paths: {
        "css": "vue/css",
        "text": "vue/text",
        "lodash": "vue/lodash",
        "vue": "vue/vue",
        "vueRouter": "vue/vue-router",
        "vuex": "vue/vuex",
        "routes": "../js/routes",
        "axios": "vue/axios.min",
        "header":"../js/components/header"
    }
});
require(
    [
        'vue',
        'vueRouter',
        'routes',
        'vuex',
        'axios',
        'header'
    ],
    function (
        Vue,
        VueRouter,
        routes,
        Vuex,
        Axios,
        Header
    ) {
        Vue.use(VueRouter);
        Vue.use(Vuex);

        Vue.prototype.$llz = {
            name: '荔只文化传媒',
            baseUrl: '/api',
            token: '',
            sign: '',
            secretKey: 'Llz_web_3e2deF#043_777=='
        };
        Vue.prototype.$web = {
            "page": {
                "currentPage" : 1,
                "pageSize" : 10
            },
            "user": {
                "id": null,
                "nickName": ''
            }
        };

        var router = new VueRouter({
            routes: routes,
            mode: 'hash'
        });

        // 定义Header
        var header = Vue.extend(Header);
        Vue.component('llz-header', header);

        new Vue({
            el: '#app',
            router: router
        });
        

        router.beforeEach((to, from ,next) => {
            if(!Vue.prototype.$llz.token) {
                if(to.path == '/login'){
                    next();
                }else {
                    next({ 
                        path: '/login', // 验证失败要跳转的页面 
                        query: { 
                            redirect: to.fullPath // 要传的参数 
                        } 
                    });
                }
            }
            Vue.prototype.$web.page.currentPage = 1;
            next();
        });

        Axios.interceptors.request.use(function (config) {

            function SortMap(){
                this._map = {};
            }

            SortMap.prototype.put = function(key, value){
                this._map[key] = value;
            }
            SortMap.prototype.get = function(key){
                return this._map[key];
            }
            SortMap.prototype.sortKey = function(){
                var arr = new Array();
                var b = false;
                for(var item in this._map){
                    b = false;
                    for(var i=0;i < arr.length;i++){
                        if(item < arr[i]){
                            for(var j=arr.length; j > i; j--){
                                arr[j] = arr[j-1];
                            }
                            arr[i] = item;
                            b = true;
                            break;
                        }
                    }
                    if(!b){
                        arr[arr.length] = item;
                    }
                }
                return arr;
            }

            var signStr = "";
            var datas = config.data;
            var map = new SortMap();
            map.put("secretKey", Vue.prototype.$llz.secretKey);
            map.put("token", Vue.prototype.$llz.token);
            for(var item in datas){
                map.put(item, datas[item]);
            }
            var keys = map.sortKey();
            var n = 0;
            for(var i=0; i<keys.length;i++){
                if(!!map.get(keys[i]) || map.get(keys[i]) === 0){
                    if(n++ > 0){
                        signStr += "&";
                    }
                    signStr += keys[i] + "=" + map.get(keys[i]);
                }
            }
            // 在发送请求之前做些什么
            config.headers['token'] = Vue.prototype.$llz.token;
            config.headers['sign'] = md5(signStr);
            return config;
        }, function (error) {
            // 对请求错误做些什么
            alert(error);
            return Promise.reject(error);
        });

        Vue.prototype.$ajax= Axios;

        /**格式化日期**/
        Vue.filter('formatting', function(time) {
            if(time == null) return null;
            time = new Date(time);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var day = time.getDate();
            var hour = time.getHours();
            var minute = time.getMinutes();
            var second = time.getSeconds();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            return time;
        });
    }
);