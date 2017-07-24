/*
    属性：
    maxValue : 最大值
    starNumber:     星星数量
*/
(function() {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxStarToolCtrl", ["$scope", function ($scope) {
        $scope.componentName = "ljxStarTool";
        this.scope = $scope;

        //$scope.enableEdit = false;
        //$scope.maxValue = 5;
        //$scope.starNumber = 0;
        $scope._stars = [];

        $scope.itemClick = function (value) {
            if ($scope.enableEdit) {
                $scope.starNumber = value + 1;
                $scope.refresh();
                $scope.onValueChanged();
            }
        };

        $scope.refresh = function () {
            $scope._stars = [];
            for (var i = 0; i < $scope.maxValue; i++) {
                var starItem = {
                    color: i < $scope.starNumber ? "#ff8a00" : "gainsboro"
                };
                $scope._stars.push(starItem);
            }
        };

        $scope.onValueChanged = function () {
            $scope.$emit("valueChanged", { componentName: $scope.componentName, value: $scope.starNumber });
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxStarTool.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxStarTool.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxStarTool.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxStarTool.directive.pc.html');
                }
            }

            return url;
        };


    }]);
})();