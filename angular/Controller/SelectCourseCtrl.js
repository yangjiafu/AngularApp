(function() {
    angular.module("app")
        .controller("SelectCourseCtrl", ["$scope", "$stateParams", "$state", "dataService", "$interval", "myConfig", "utilityService", "$log",
            function ($scope, $stateParams, $state, dataService, $interval, myConfig, utilityService, $log) {
            $scope.nodes = [];        // 左侧的树
            $scope.courseInfo = null;    // 右侧的课程信息
            $scope.activeDiv = "分类";
            $scope.list = [];         // 列表

            $scope.score = 0;         // 评分
            $scope.discuss = "";      // 评论
            $scope.learnType = "";    // 学习|测试

            $scope.isAll = $stateParams.isAll;      // 是否显示所有
            $scope.courseId = $stateParams.courseId;      // 默认显示的课程

            $scope.divContent = "学习记录";       // 学习记录|我要评论|查看评论
            $scope.difficultyValue = "一般";          // 无难度|容易|一般|困难

            $scope.showTab = function (content) {
                $scope.divContent = content;
            };

            $scope._initSelected = function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type == "课程") {
                        nodes[i].selected = false;
                        $scope.list.push(nodes[i]);
                    }
                    
                    arguments.callee(nodes[i].nodes);
                }
            };
            $scope._findNodeById = function (nodes, courseId) {
                if (courseId == -1) return null;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].id == "1_" + courseId) {
                        return nodes[i];
                    }
                    var tempNode = arguments.callee(nodes[i].nodes, courseId);
                    if (tempNode)
                        return tempNode;
                }
                return null;
            };
            $scope._getDefaultNode = function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type == "课程") {
                        return nodes[i];
                    }
                    var tempNode = arguments.callee(nodes[i].nodes);
                    if (tempNode)
                        return tempNode;
                }
                return null;
            };

            // 仅仅在微信端使用
            $scope.goBack = function () {
                $scope.$broadcast("goBack", { componentName: 'ljxMobileTree' });
            };


            $scope.loadTree = function () {
                dataService.getCourseIndexTree({
                    personId: dataService.userInfo.personId,
                    isAll: $scope.isAll
                }).then(function (args) {
                    $scope.nodes = args;
                    $scope._initSelected($scope.nodes);
                    var tempNode = $scope._findNodeById($scope.nodes, $scope.courseId);
                    if (!tempNode) {
                        //tempNode = $scope._getDefaultNode($scope.nodes);
                    }

                    if (tempNode) {
                        $scope.selectTreeNode(tempNode);
                    }
                }, function (args) {
                });
            };

            $scope._selectedNode = null;
            $scope.selectTreeNode = function (item) {
                if (item.type != "课程") return;
                if ($scope._selectedNode) {
                    $scope._selectedNode.selected = false;
                }
                $scope._selectedNode = item;
                $scope._selectedNode.selected = true;
                dataService.getCourseInfoAll({
                    personId: dataService.userInfo.personId,
                    courseId: item.id.replace("1_", "")
                }).then(function (args) {
                    $scope.activeDiv = "课程";
                    $scope.courseInfo = args;
                }, function (args) {
                });
            };

            $scope.toListDiv = function () {
                $scope.activeDiv = "分类";
            };

            $scope.doLearnExam = function () {
                var difficulty = 2;
                if ($scope.difficultyValue === "无难度") {
                    difficulty = 0;
                }
                else if ($scope.difficultyValue === "容易") {
                    difficulty = 1;
                }
                else if ($scope.difficultyValue === "一般") {
                    difficulty = 2;
                }
                else if ($scope.difficultyValue === "困难") {
                    difficulty = 3;
                }

                var courseId = $scope.courseInfo.baseInfo.id;
                var courseName = $scope.courseInfo.baseInfo.title;
                var obj  = null;
                if ($scope.learnType == "学习") {
                    angular.element('#myDifficulty').modal('hide');
                    obj = $interval(function () {
                        $state.go('learnCourse', { courseId: courseId, courseName: courseName, difficulty: difficulty });
                        $scope.$emit("hiddenMenu", {});
                        $interval.cancel(obj);
                    }, 500);
                    
                }
                else {
                    angular.element('#myDifficulty').modal('hide');
                    obj = $interval(function () {
                        $state.go('examCourse', { courseId: courseId, courseName: courseName, difficulty: difficulty });
                        $scope.$emit("hiddenMenu", {});
                        $interval.cancel(obj);
                    }, 500);
                    
                }
            };

            $scope.difficultyChanged = function (value) {
                $scope.difficultyValue = value;
            };

            $scope.showLearn = function () {
                if (!dataService.userInfo || !dataService.userInfo.personId) {
                    utilityService.alert("请先登录");
                    return;
                }

                var difficulty = 2;
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
                    utilityService.alert("课程收藏成功");
                    dataService.clearCourseIndexTreeCache({
                        isAll: false,
                        personId: data.personId
                    });
                    dataService.clearMyCourseListCache({
                        personId: dataService.userInfo.personId,
                        courseId: $scope.courseInfo.baseInfo.id
                    });
                },
                function (args) {

                });
            };

            $scope.submitDiscuss = function () {
                if (!dataService.userInfo || !dataService.userInfo.personId) {
                    utilityService.alert("请先登录");
                    return;
                }
                //$scope.score = angular.element("#starRating").getStars();


                var courseParams = {
                    personId: dataService.userInfo.personId,
                    courseId: $scope.courseInfo.baseInfo.id,
                };
                var discussValue = angular.element("#txtDiscuss").val();
                $scope.discuss = discussValue;
                dataService.saveDiscuss({
                    personId: dataService.userInfo.personId,
                    courseId: $scope.courseInfo.baseInfo.id,
                    score: $scope.score,
                    discuss: $scope.discuss
                })
                .then(function (args) {
                    angular.element("#txtDiscuss").val("");
                    dataService.clearGetCourseInfoAllCache(courseParams);
                    dataService.getCourseInfoAll(courseParams).then(function (args) {
                        $scope.activeDiv = "课程";
                        $scope.courseInfo = args;
                    }, function (args) {
                    });
                    utilityService.alert("评论提交成功");
                }, function (args) {

                });
            };

            $scope.$on('valueChanged', function (event, args) {
                if (args.componentName == "ljxStarTool")
                    $scope.score = args.value;
            });

            $scope.$on("click", function (event, args) {
                if (args.componentName == "ljxMobileTree") {
                    $scope.selectTreeNode(args.data);
                }
            });

            $scope.$emit("showLogin");

            $scope.$on("$ionicNavView.enter", function (event, data) {
                $log.debug("entry select course");
                $scope.loadData();
            });

            $scope.loadTree();
        }]);
})();
