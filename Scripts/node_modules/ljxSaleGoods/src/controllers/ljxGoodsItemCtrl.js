/*
    属性：
    img : 图片URL
    title: 标题
    starRating:   星级
    status:       状态
    commentNumber:    评论数
    infos:    信息数组
    displayType:    显示类型（BoxItem|RowItem)
    href:     单击时候的链接Url (href 属性和 clicked 事件互斥， href 为空时候，才广播 clicked 事件)

    事件触发器：
    clicked()       向父作用域发送消息   agrs:{item:item}

    函数：
    

    内部属性：
    

    内部函数：
    
*/
(function() {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxGoodsItemCtrl", ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {
        $scope.componentName = "ljxGoodsItem";
        $scope.img = "";
        $scope.title = "title";
        $scope.starRating = 3;
        $scope.commentNumber = 0;
        $scope.status = "status";
        $scope.infos = [];
        //$scope.displayType = "BoxItem";
        $scope.href = "";
        $scope.bootstrapSize = $rootScope.bootstrapSize;

        $scope.loadData = function (item) {
            if (!item) return;
            item.componentName = $scope.componentName;
            $scope.img = item.img;
            $scope.title = item.title;
            $scope.starRating = item.starRating;
            $scope.commentNumber = item.commentNumber;
            $scope.status = item.status;
            $scope.infos = item.infos;
            $scope.displayType = item.displayType;
            $scope.href = item.href;
        };

        $scope._onClicked = function (item) {
            if (!$scope.href && $scope.href !== "") {
                $scope.$emit('clicked', {
                    item: item
                });
            }
            else {
                $location.path($scope.href);
            }
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsItem.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsItem.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsItem.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsItem.directive.pc.html');
                }
            }
            return url;
        };

        $scope.$on("onresize", function (event, data) {
            $scope.bootstrapSize = data.bootstrapSize;
        });
    }]);
})();