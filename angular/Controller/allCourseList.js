(function () {
    angular.module("app")
        .controller("allCourseListCtrl", ["$scope", "$log", "dataShareService", "dataService", "$state", "myConfig", "utilityService",
            "$ionicScrollDelegate", "$q", "$timeout",
            function ($scope, $log, dataShareService, dataService, $state, myConfig, utilityService, $ionicScrollDelegate, $q, $timeout) {
                var scope = $scope;
                $scope.m = {
                    sd: dataShareService
                };

                $scope.toCourse = function (courseId) {
                    $state.go("tab.allCourseItem", { id: courseId, parent: "allCourse" });
                };

                var _loadAdvertisement = function () {
                    dataService.getAdvertisementList().then(function (args) {
                        $scope.m.advertisement = args;
                        for (var i = 0; i < args.length; i++) {
                            swiper.appendSlide('<div class="swiper-slide"><img style="width:100%;"  src="' + args[i] + '" /></div>')
                        }

                        $log.debug("do load 广告 completed : " + moment().format('h:mm:ss '));
                    }, function (args) {
                    });
                };
                $scope.getImgPath = function(url){
                    return myConfig.filesUrl + "/Advertisement/" + url;
                }

                var _loadClassifyCourse = function () {
                    $scope.m.sd.classifyCourse = [];
                    for (var i = 0; i < $scope.m.sd.treeCourse.length; i++) {
                        var newNode = {
                            id: $scope.m.sd.treeCourse[i].id,
                            type: $scope.m.sd.treeCourse[i].type,
                            title: $scope.m.sd.treeCourse[i].title,
                            nodes: []
                        };
                        $scope.m.sd.classifyCourse.push(newNode);
                        _loadClassifyCourseRecursive($scope.m.sd.treeCourse[i], newNode);
                    }
                };

                var _loadClassifyCourseRecursive = function (node, newNode) {
                    if (node.type == "课程") {
                        for (var i = 0; i < $scope.m.sd.allCourseList.length; i++) {
                            var temp = node.id.split("_");
                            if ($scope.m.sd.allCourseList[i].id == temp[1]) {
                                var tt = {
                                    id: $scope.m.sd.allCourseList[i].id,
                                    title: $scope.m.sd.allCourseList[i].title,
                                    img: $scope.m.sd.allCourseList[i].img,
                                    status: $scope.m.sd.allCourseList[i].status,
                                    starRating: $scope.m.sd.allCourseList[i].starRating,
                                    commentNumber: $scope.m.sd.allCourseList[i].commentNumber
                                };
                                newNode.nodes.push(tt);
                                break;
                            }
                        }

                    }
                    else {
                        for (var j = 0; j < node.nodes.length; j++) {
                            arguments.callee(node.nodes[j], newNode);
                        }
                    }
                };


                var _getCourseList = function(){
                    var defer = $q.defer();
                    $log.debug("do load course list start : " + moment().format('h:mm:ss '));
                    dataService.getCourseList({
                        type: "精品课程",
                        limit: 100
                    }).then(function (args) {
                        $log.debug("do load course list end : " + moment().format('h:mm:ss '));
                        $scope.m.sd.allCourseList = args;
                        defer.resolve(args);
                    }, function (args) {
                        defer.reject(args);
                    })
                    return defer.promise;
                }

                var _getCourseIndexTree = function () {
                    var defer = $q.defer();
                    $log.debug("do load course index start : " + moment().format('h:mm:ss '));
                    dataService.getCourseIndexTree({
                        personId: dataService.userInfo.personId,
                        isAll: true
                    }).then(function (args) {
                        $log.debug("do load course index end : " + moment().format('h:mm:ss '));
                        $scope.m.sd.treeCourse = args;
                        defer.resolve(args);
                    }, function (args) {
                        defer.reject(args);
                    })
                    return defer.promise;
                }

                var loadIndexPromise = function () {
                    var defer = $q.defer();
                    var promiseList = [];
                    promiseList.push(_getCourseList());
                    promiseList.push(_getCourseIndexTree());
                    defer.all(promiseList).then(function(args){
                        defer.resolve(args);
                    },function(args){
                        defer.reject(args);
                    });
                    return defer.promise;
                }
                var loadIndex = function () {
                    $log.debug("do load course start : " + moment().format('h:mm:ss '));
                    var promiseList = [];
                    promiseList.push(_getCourseList());
                    promiseList.push(_getCourseIndexTree());
                    $q.all(promiseList).then(function (args) {
                        _loadClassifyCourse();

                        $log.debug("do load course completed : " + moment().format('h:mm:ss '));
                    }, function (args) {
                        
                    });

                    _loadAdvertisement();
                };

                $log.debug("do load index : " + moment().format('h:mm:ss '));
                
                var swiper = new Swiper('.swiperImg',
                {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 5000
                });

                $scope.getSwiperClass = function (index) {
                    return "mySwiper" + index;
                }

                $scope.createSwiper = function (index) {
                    $timeout(function () {
                        var swiper = new Swiper('.mySwiper' + index, {
                            pagination: '.swiper-pagination',
                            slidesPerView: 3,
                            paginationClickable: true,
                            spaceBetween: 10
                        });
                    }, 10);
                };
                loadIndex();
            }]);
})();