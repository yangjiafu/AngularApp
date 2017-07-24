(function () {
    'use strict';
    angular.module('ljxTools')
    .directive('ljxMobileTree', function () {
        return {
            scope: {
                itemTemplate: "@",
                clickCallback: "&",
                platform:"@"
            },
            require: ['ngModel'],
            controller: "ljxMobileTreeCtrl",
            template: '<div class="templateDiv" ng-include="_getTemplateUrl()"></div>',
            replace: true,
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                ngModel.$render = function () {
                    if (ngModel.$modelValue instanceof Array) {
                        scope.nodes = ngModel.$modelValue;
                        scope.list = scope.nodes;
                        
                    }
                    else {
                        scope.nodes = [];
                        scope.nodes.push(ngModel.$modelValue);
                        scope.list = scope.nodes;
                    }

                };

                
                //scope.$watch("nodes", function (newValue, oldValue) {
                //    scope.loadData();
                //});
            }
        };
    });
})();