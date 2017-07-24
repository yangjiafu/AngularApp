/*

*/
(function () {
    'use strict';
    angular.module('ljxTools')
    .controller("ljxMobileTreeCtrl", ["$scope", function ($scope) {
        $scope.componentName = "ljxMobileTree";
        $scope.nodes = [];
        $scope.list = [];
        $scope.nodeStack = [];

        $scope.$on("goBack", function (event, data) {
            if (data.componentName == $scope.componentName) {
                $scope.toParent();
            }
        });
        $scope.loadData = function () {
            $scope.list = $scope.nodes;
        };

        $scope.toParent = function () {
            $scope.nodeStack.pop();
            if ($scope.nodeStack.length <= 0) {
                $scope.list = $scope.nodes;
            }
            else {
                var node = $scope.nodeStack[$scope.nodeStack.length - 1];
                $scope.list = node.nodes;
            }
            
        };

        $scope.toChild = function (node) {
            //$scope.$eval($scope.clickCallback(node));
            $scope.onClick(node);
            if (node.type && node.type == "课程") return;
            $scope.nodeStack.push(node);
            $scope.list = node.nodes;
        };

        $scope.onClick = function (node) {
            $scope.$emit("click", { componentName: $scope.componentName, data: node });
        };

        $scope._getTemplateUrl = function () {
            var url = "";
            if ($scope.platform == "app") {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxMobileTree.directive.app.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxMobileTree.directive.app.html');
                }
            }
            else {
                if ($('script[src*="ljxSaleGoods.js"]').length > 0) {
                    url = $('script[src*="ljxSaleGoods.js"]').attr('src').replace('ljxSaleGoods.js', 'directives/ljxMobileTree.directive.pc.html');
                }
                else {
                    url = $('script[src*="ljxSaleGoods.min.js"]').attr('src').replace('ljxSaleGoods.min.js', 'directives/ljxMobileTree.directive.pc.html');
                }
            }
            return url;
        };
    }]);
})();