(function() {
    angular.module("app")
        .controller("appCourseItemCtrl", ["$scope", "$state", "$stateParams", "dataService", "myConfig", "$log", "utilityService",
            "$ionicPopup", 
    function ($scope, $state, $stateParams, dataService, myConfig, $log, utilityService, $ionicPopup) {
        var scope = $scope;
        $scope.m = {};
        $scope.m.score = 0;         // 评分
        $scope.m.discuss = "";      // 评论
        $scope.m.learnType = "";    // 学习|测试
        $scope.m.parent = $stateParams.parent;
        $scope.m.isOldLearn = false;
        $scope.m.isLearnEasy = true;
        $scope.m.isLearnNormal = false;
        $scope.m.isLearnHard = false;
        $scope.m.isExam = true;

        $scope.m.divContent = "目录";       // 学习记录|我要评论|查看评论
        $scope.m.difficultyValue = "一般";          // 无难度|容易|一般|困难

        $scope.courseInfo = null;

        $scope.showTab = function (content) {
            $scope.m.divContent = content;
        };



        $scope.loadData = function () {
            dataService.getCourseInfoAll({
                personId: dataService.userInfo.personId,
                courseId: $stateParams.id
            }).then(function (args) {
                $scope.courseInfo = args;
                if ($scope.courseInfo.baseInfo.courseMode) {
                    $scope.m.isLearnEasy = $scope.courseInfo.baseInfo.courseMode.indexOf("学习简单") >= 0;
                    $scope.m.isLearnNormal = $scope.courseInfo.baseInfo.courseMode.indexOf("学习一般") >= 0;
                    $scope.m.isLearnHard = $scope.courseInfo.baseInfo.courseMode.indexOf("学习困难") >= 0;
                    $scope.m.isExam = $scope.courseInfo.baseInfo.courseMode.indexOf("考试") >= 0;
                }
                else {
                    $scope.m.isOldLearn = true;
                }
                
            }, function (args) {
            });
        };


        $scope.showLearn = function (difficulty) {
            if (!dataService.userInfo || !dataService.userInfo.personId) {
                utilityService.alert("请先登录");
                return;
            }

            //var difficulty = 2;
            var courseId = $scope.courseInfo.baseInfo.id;
            var courseName = $scope.courseInfo.baseInfo.title;

            if ($scope.courseInfo.baseInfo.version == "1") {
                $state.go('learnCourse', { courseId: courseId, courseName: courseName, difficulty: difficulty });
            }
            else {
                $state.go('learnCourse1', { courseId: courseId, courseName: courseName, difficulty: difficulty });
            }
        };

        $scope.showExam = function () {
            if (!dataService.userInfo || !dataService.userInfo.personId) {
                utilityService.alert("请先登录");
                return;
            }
            var difficulty = 2;
            var courseId = $scope.courseInfo.baseInfo.id;
            var courseName = $scope.courseInfo.baseInfo.title;
            if ($scope.courseInfo.baseInfo.version == "1") {
                $state.go('examCourse', { courseId: courseId, courseName: courseName, difficulty: difficulty });
            }
            else {
                $state.go('examCourse1', { courseId: courseId, courseName: courseName, difficulty: difficulty });
            }

        };

        $scope.doKeep = function () {
            if (!dataService.userInfo || !dataService.userInfo.personId) {
                utilityService.alert("请先登录");
                return;
            }
            var data = {
                personId: dataService.userInfo.personId,
                courseId: $scope.courseInfo.baseInfo.id
            };
            dataService.saveKeep(data).then(function (args) {
                utilityService.alert("课程已经收藏");
                dataService.clearMyCourseListCache({});
                dataService.clearGetCourseInfoAllCache(data);
                scope.loadData();
            },
            function (args) {

            });
        };

        $scope.removeKeep = function () {
            if (!dataService.userInfo || !dataService.userInfo.personId) {
                utilityService.alert("请先登录");
                return;
            }
            var data = {
                personId: dataService.userInfo.personId,
                courseId: $scope.courseInfo.baseInfo.id
            };
            dataService.removeKeep(data).then(function (args) {
                utilityService.alert("收藏已经移除");
                dataService.clearMyCourseListCache({
                    personId: dataService.userInfo.personId,
                    courseId: $scope.courseInfo.baseInfo.id
                });
                $state.go("tab.courseList");
            },
            function (args) {

            });
        };

        $scope.submitDiscuss = function () {
            if (!dataService.userInfo || !dataService.userInfo.personId) {
                utilityService.alert("请先登录");
                return;
            }

            var courseParams = {
                personId: dataService.userInfo.personId,
                courseId: $scope.courseInfo.baseInfo.id,
            };
            dataService.saveDiscuss({
                personId: dataService.userInfo.personId,
                courseId: $scope.courseInfo.baseInfo.id,
                score: $scope.m.score,
                discuss: $scope.m.discuss
            })
            .then(function (args) {
                dataService.getDiscuss({
                    courseId: courseParams.courseId,
                    start: 0,
                    limit: 10
                }).then(function (args) {
                    $scope.courseInfo.baseInfo.discussCount = args.count;
                    $scope.courseInfo.discusses = args.list;
                }, function (args) { });
            }, function (args) {

            });
        };

        var discussPageNumber = 0;
        $scope.m.refreshDiscuss = function () {
            discussPageNumber++;
            $log.debug("load more discuss : " + discussPageNumber);  
            dataService.getDiscuss({
                courseId: $scope.courseInfo.baseInfo.id,
                start: discussPageNumber * 10,
                limit: 10
            }).then(function (args) {
                $scope.courseInfo.baseInfo.discussCount = args.count;
                //angular.extend(args.list, $scope.courseInfo.discusses);
                if (args.list.length > 0) {
                    for (var i = 0; i < args.list.length; i++) {
                        $scope.courseInfo.discusses.push(args.list[i]);
                    }
                }
                else {
                    m_enableRefreshDiscuss = false;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                
            }, function (args) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        var m_enableRefreshDiscuss = true;
        $scope.enableRefreshDiscuss = function(){
            return m_enableRefreshDiscuss;
        }

        $scope.showDiscuss = function () {
            var content = "<ion-item><ljx-star-tool platform='app' max-value='5' star-number='m.score' enable-edit='true' style='font-size:24px;'></ljx-star-tool></ion-item>";
            content += "<textarea style='height:100px;' ng-model='m.discuss'/>";
            var tt = $ionicPopup.show(
                {
                    title: '评论', // String. 弹窗的标题。
                    subTitle: '', // String (可选)。弹窗的子标题。
                    template: content, // String (可选)。放在弹窗body内的html模板。
                    templateUrl: '', // String (可选)。在弹窗body内的html模板的URL。
                    scope: $scope, // Scope (可选)。一个链接到弹窗内容的scope（作用域）。
                    buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                        text: '确定',
                        type: 'button-default',
                        onTap: function (e) {
                            // 当点击时，e.preventDefault() 会阻止弹窗关闭。
                            $scope.submitDiscuss();
                        }
                    }, {
                        text: '取消',
                        type: 'button-positive',
                        onTap: function (e) {
                        }
                    }]
                });
        };

        $scope.goBack = function () {
            $log.debug("parent info is : " + $scope.m.parent)
            if ($scope.m.parent == "allCourse") {
                $state.go("tab.allCourseList")
            }
            else if ($scope.m.parent == "myCourse") {
                $state.go("tab.courseList")
            }
        };

        $scope.$on('valueChanged', function (event, args) {
            if (args.componentName == "ljxStarTool")
                $scope.score = args.value;
        });

        $scope.$on("$ionicView.enter", function (event, data) {
            $log.debug("entry course item");
            //$scope.loadData();
        });
        $scope.loadData();
        $log.debug("end course item ctrl");
    }]);
})();
