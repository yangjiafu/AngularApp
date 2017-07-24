(function() {
    angular.module("app")
    .service("convertService", function () {
        this.getDifficultyCode = function (name) {
            if (name === "无难度")
                return 0;
            else if (name === "容易")
                return 1;
            else if (name === "一般")
                return 2;
            else if (name === "困难")
                return 3;
            else
                return -1;
        };

        this.getDifficultyName = function (code) {
            if (code === 0 || code === "0") {
                return "无难度";
            }
            else if (code === 1 || code === "1") {
                return "容易";
            }
            else if (code === 2 || code === "2") {
                return "一般";
            }
            else if (code === 3 || code === "3") {
                return "困难";
            }
            else {
                return "未知";
            }
        };
    });
})();