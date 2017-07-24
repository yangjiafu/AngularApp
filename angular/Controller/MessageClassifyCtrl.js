(function() {
    angular.module("app")
        .controller("MessageClassifyCtrl", ["$scope", "dataService", "$state", function ($scope, dataService, $state) {
            $scope.m = {};
            $scope.m.classifyList = [
                {
                    css: "icon-zhaopinqiuzhi msgZPColor",
                    id:"1",
                    title: "招聘信息",
                    subTitle: "查看全部招聘信息",
                    unreadCount: 10
                },
                {
                    css: "icon-kecheng1 msgKCColor",
                    id:"2",
                    title: "课程信息",
                    subTitle: "查看全部课程信息",
                    unreadCount: 10
                },
                {
                    css: "icon-meirirenwuh app-mrxz-color",
                    id:"3",
                    title: "每日新知",
                    subTitle: "查看全部每日新知",
                    unreadCount: 10
                },
                {
                    css: "icon-hedeyangchuxingjiaotong app-cxbd-color",
                    id:"4",
                    title: "出行宝典",
                    subTitle: "查看全部出行宝典",
                    unreadCount: 10
                }
            ];


            $scope.toList = function (id) {
                $state.go("tab.messageList", { id: id });
            };
        }]);
})();
