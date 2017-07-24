/*
    属性：
    maxItems:          最大显示数量
    classifyId:          类型
    classifyName:
    displayType:       显示样式（CellBox|RowBox)
    items:     
    contentHref        内容回调接口

    方法：

*/
(function() {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxGoodsBoxCtrl", ["$scope", function ($scope) {
        $scope.maxItems = 6;
        $scope.classifyId = "";
        $scope.classifyName = "热门课程";
        $scope.displayType = "CellBox";
        $scope.items = [];

        $scope.loadData = function (items) {
            $scope.items = items;
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsBox.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsBox.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxGoodsBox.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxGoodsBox.directive.pc.html');
                }
            }
            
            return url;
        };
    }]);
})();