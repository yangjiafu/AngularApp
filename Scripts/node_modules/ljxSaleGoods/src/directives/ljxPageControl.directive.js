(function () {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxPageControl', function () {
        return {
            scope: {
                buttonsCount: "@",
                pageCount: "=",
                currentPage: "=",
                platform:"@"
            },
            controller: "ljxPageControlCtrl",

            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace: true,
            link: function (scope, element, attr, ctrls) {
                scope.$watch("pageCount", function (newValue, oldValue) {
                    scope._pageCount = newValue;
                    scope._buttonStep = scope.buttonsCount - 1;
                    scope._endPage = Math.min(scope._buttonStep, parseInt(newValue));
                    scope._refreshButtons(1);
                });
            }
        };
    });
})();