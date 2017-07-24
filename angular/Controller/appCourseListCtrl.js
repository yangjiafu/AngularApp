(function() {
    angular.module("app")
        .controller("appCourseListCtrl", ["$scope", "$state", "dataService", "myConfig", "$log", "$window",
            function ($scope, $state, dataService, myConfig, $log, $window) {
                $scope.m = {
                    list : [],
                    config: myConfig,
                };

                $window.appCourseListCtrl_scope = $scope;
                $scope.loadData = function () {
                    $log.debug("load data");
                    dataService.getMyCourseList({}).then(function (args) {
                        $log.debug("my course number is :" + args.length);
                        $scope.m.list = args;
                    }, function (args) {
                    });
                };

                $scope.toCourse = function (id) {
                    $state.go("tab.courseItem", { id: id, parent:"myCourse"});
                };

                $scope.removeKeepCourse = function (id) {
                    var data = {
                        personId: dataService.userInfo.personId,
                        courseId: id
                    };
                    dataService.removeKeep(data).then(function (args) {
                        dataService.clearGetCourseInfoAllCache(data);
                        dataService.clearMyCourseListCache(data);
                        $window.appCourseListCtrl_scope.loadData();
                    }, function (args) { });
                }

                $scope.$on("$ionicView.enter", function (event, data) {
                    $log.debug("entry course list");
                    $scope.loadData();
                });

            }]);
})();
