(function() {
    angular.module("app")
    .service("dataShareService", ["dataService", "storeService", "$state",
        function (dataService, storeService, $state) {
            // 热门课程
            this.hotCourseList = [];

            // 精品课程
            this.fineCourseList = [];

            // 我的课程
            this.myCourseList = [];

            // 最新课程
            this.latestCourseList = [];

            // 所有课程
            this.allCourseList = [];

            // 课程树
            this.treeCourse = [];

            // 只包含课程一级分类和所有课程的数组
            this.classifyCourse = [];

            // 消息
            this.messageList = [];
            
            // 我的信息
            this.personInfo = {};

            // 我的职业意愿
            this.personJobWish = {};


            var _loadClassifyCourse = function () {
                this.classifyCourse = [];
                for (var i = 0; i < this.treeCourse.length; i++) {
                    var newNode = {
                        id: this.treeCourse[i].id,
                        type: this.treeCourse[i].type,
                        title: this.treeCourse[i].title,
                        nodes:[]
                    }
                    this.classifyCourse.push(newNode);
                    _loadClassifyCourseRecursive(this.treeCourse[i], newNode);
                }
            };
            var _loadClassifyCourseRecursive = function (node, newNode) {
                if (node.type == "课程") {
                    for (var i = 0; i < allCourseList.length; i++) {
                        var temp = node.id.split("_");
                        if (allCourseList[i].id == temp[1]) {
                            var tt = {
                                id: allCourseList[i].id,
                                title: allCourseList[i].title,
                                img: allCourseList[i].img,
                                status: allCourseList[i].status,
                                starRating: allCourseList[i].starRating,
                                commentNumber: allCourseList[i].commentNumber
                            }
                            newNode.nodes.push(tt);
                            break;
                        }
                    }
                    
                }
                else {
                    for (var i = 0; i < node.nodes.length; i++) {
                        arguments.callee(node.nodes[i], newNode);
                    }
                }
            }

            this.loadIndex = function () {
                dataService.getCourseList({
                    type: "精品课程",
                    limit: 100
                }).then(function (args) {
                    this.allCourseList = args;

                    dataService.getCourseIndexTree({
                        personId: dataService.userInfo.personId,
                        isAll: true
                    }).then(function (args) {
                        this.treeCourse = args;
                        _loadClassifyCourse();
                    }, function (args) {
                    });
                }, function (args) {
                });
            };

            this.loadCourseInfo = function () {

            };

            this.loadCourseItem = function () {

            };
        }]);
})();