(function() {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxStarTool', [
        function () {
            return {
                scope: {
                    maxValue: '@',
                    starNumber: '=',
                    enableEdit: '@',
                    platform:'@'
                },
                //require: ['ngModel'],
                controller: 'ljxStarToolCtrl',
                template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
                replace: true,
                link: function (scope, element, attr, ctrls) {
                    //var ngModel = ctrls[0];
                    //ngModel.$render = function () {
                    //    scope.starNumber = ngModel.$modelValue;
                    //};
                    if (!attr.maxValue)
                        scope.maxValue = 5;

                    if (!attr.starNumber)
                        scope.starNumber = 0;

                    if (!attr.enableEdit)
                        scope.enableEdit = false;

                    scope.$watch('maxValue', function (newValue, oldValue) {
                        scope.refresh();
                    });

                    scope.$watch('starNumber', function (newValue, oldValue) {
                        scope.refresh();
                    });
                }
            };
        }
    ]);
})();
