(function () {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxListBox', function () {
        return {
            scope: {
                count: "@",
                items: "=",
                displayMode: "@",
                pageStep: "@",
                itemTemplate: "@",
                queryAllData: "&",
                queryPageData: "&",
                platform:"@"
            },
            controller: "ljxListBoxCtrl",
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace:true,
            link: function (scope, element, attrs, ctrls) {
                if (!attrs.items)
                    scope.items = [];

                if (!attrs.displayMode)
                    scope.displayMode = "显示全部";

                if (!attrs.pageStep)
                    scope.pageStep = 10;

                scope.$watch("items", function (newValue, oldValue) {
                    scope.init();
                });

                scope.$watch("displayMode", function (newValue, oldValue) {
                    scope.init();
                });

                scope.$watch("pageStep", function (newValue, oldValue) {
                    scope.init();
                });

                scope.$on("currentPageChanged", function (event, args) {
                    scope._toPage(args.currentPage);
                });

                angular.element("ljx-list-box").bind("scroll", function () {
                    var pageYOffset = $window.pageYOffset;
                    var clientHeight = $document[0].documentElement.clientHeight;
                    var offsetHeight = $document[0].body.offsetHeight;
                    //当滚动到90%的时候去加载
                    if (pageYOffset + clientHeight > offsetHeight * 0.9) {

                        //scope.shopWorkCanLoad是否可加载,controller中定义
                        //scope.shopWorkOnLoad是否正在加载,controller中定义
                        if (scope.shopWorkCanLoad === true && scope.shopWorkOnLoad === false) {
                            //加载数据,controller中定义
                            scope.scrollPage();//
                        }
                    }
                });
            }
        };
    });
})();