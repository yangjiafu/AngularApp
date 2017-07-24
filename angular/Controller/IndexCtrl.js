(function() {
    angular.module("app")
        .controller("IndexCtrl", ["$scope", "$timeout", "dataService", "$state", "$log", "dataShareService",
            function ($scope, $timeout, dataService, $state, $log, dataShareService) {
            $scope.fineItems = [];
            $scope.hotItems = [];
            $scope.loadData = function () {
                //$scope._loadFineItems();
                //$scope._loadHotItems();
            };

            $scope._loadFineItems = function () {
                console.debug("do loadFineItems");
                dataService.getCourseList({
                    type: "精品课程",
                    limit: 100
                }).then(function (args) {
                    // 执行成功
                    $scope.fineItems = args;
                }, function (args) {
                    // 执行失败
                });
            };

            $scope._loadHotItemsDelay = function () {
                $timeout(function () {
                    $scope._loadHotItems();
                }, 100);
            };

            $scope._loadHotItems = function () {
                console.debug("do loadHotItems");
                dataService.getCourseList({
                    type: "热门课程",
                    limit: 100
                }).then(function (args) {
                    // 执行成功
                    $scope.hotItems = args;
                }, function (args) {
                    // 执行失败
                });
            };

            $scope.$on('clicked', function (event, data) {
                if (data.item.componentName == "ljxGoodsItem") {
                    $state.go("tab.selectCourse", { isAll: true, courseId: data.item.id });
                }
            });

            $log.debug("init index ctrl " + new Date().getTime());

            $scope.$on("$ionicView.enter", function () {
                $log.debug("enter index " + new Date().getTime());
            });
                //$scope.$emit("showLogin");
        }]);
})();
