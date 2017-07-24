(function () {
    angular.module("app")
    .service("storeService", ["$window", "$cacheFactory", function ($window, $cacheFactory) {
        this.storeType = "session";     //session|local|angularCache
        var angularCache = $cacheFactory('angularCache');

        this.getValue = function (key) {
            var obj = null;
            if (this.storeType === "session")
            {
                obj = this.getSessionValue(key);
            } 
            else if (this.storeType == "local") {
                obj = this.getLocalValue(key);
            }
            return obj;
        };

        this.setValue = function (key, value) {
            if (this.storeType == "session") {
                this.setSessionValue(key, value);
            }
            else if (this.storeType == "local") {
                this.setLocalValue(key, value);
            }
        };

        this.getSessionValue = function (key) {
            var obj = sessionStorage.getItem(key);
            return obj;
        };

        this.setSessionValue = function (key, value) {
            sessionStorage.setItem(key, value);
        };

        this.getLocalValue = function (key) {
            var obj = localStorage.getItem(key);
            return obj;
        };

        this.setLocalValue = function (key, value) {
            localStorage.setItem(key, value);
        };

        this.getAngularCacheValue = function (key) {
            var obj = angularCache.get(key);
        };

        this.setAngularCacheValue = function (key, value) {
            angularCache.put(key, value);
        };
    }]);
})();