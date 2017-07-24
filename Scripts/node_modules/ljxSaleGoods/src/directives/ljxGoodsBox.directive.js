(function() {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxGoodsBox', function () {
        return {
            scope: {
                maxItems: "@",
                classifyId: "@",
                classifyName: "@",
                displayType: "@",
                platform:"@"
            },
            require: ['ngModel'],
            controller: "ljxGoodsBoxCtrl",
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace:true,
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                ngModel.$render = function () {
                    if (ngModel.$modelValue instanceof Array) {
                        scope.items = ngModel.$modelValue;
                    }
                    else {
                        scope.items = [];
                        scope.items.push(ngModel.$modelValue);
                    }

                };

                scope.$watch("displayType", function (newValue, oldValue, scope) {
                    var itemDisplayType = "";
                    if (newValue == "CellBox") {
                        itemDisplayType = "BoxItem";
                    }
                    else if (newValue == "RowBox") {
                        itemDisplayType = "RowItem";
                    }
                    if (itemDisplayType === "") return;
                    for (var i = 0; i < scope.items.length; i++) {
                        if (scope.items[i]) {
                            scope.items[i].displayType = itemDisplayType;
                        }
                    }
                });

                scope.$watch("items", function (newValue, oldValue, scope) {
                    var itemDisplayType = "";
                    if (scope.displayType == "CellBox") {
                        itemDisplayType = "BoxItem";
                    }
                    else if (scope.displayType == "RowBox") {
                        itemDisplayType = "RowItem";
                    }
                    if (itemDisplayType === "") return;
                    for (var i = 0; i < scope.items.length; i++) {
                        if (scope.items[i]) {
                            scope.items[i].displayType = itemDisplayType;
                        }
                    }
                });
            }
        };
    });
})();