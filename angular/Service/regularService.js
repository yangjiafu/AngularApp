(function() {
    angular.module("app")
    .service("regularService", [
        function () {
            // 是否是手机号码
            this.isMobilePhone = function (text) {
                var reg = /^1[3,5,8]\d{9}$/;
                var t = text.match(reg);
                return t != null;
            }

            // 是否是固定电话
            this.isPhone = function (text) {
                var reg = /^(^0\d{2}-?\d{8}$)|(^0\d{3}-?\d{7}$)|(^0\d2-?\d{8}$)|(^0\d3-?\d{7}$)$/;
                var t = text.match(reg);
                return t != null;
            }

            // 是否是Email
            this.isEmail = function (text) {
                var reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/;
                var t = text.match(reg);
                return t != null;
            }
            
            // 是否是身份证号
            this.isIdCard = function (idCard) {
                //15位和18位身份证号码的正则表达式
                var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

                //如果通过该验证，说明身份证格式正确，但准确性还需计算
                if (regIdCard.test(idCard)) {
                    if (idCard.length == 18) {
                        var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                        var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                        var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                        for (var i = 0; i < 17; i++) {
                            idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                        }

                        var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
                        var idCardLast = idCard.substring(17);//得到最后一位身份证号码

                        //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                        if (idCardMod == 2) {
                            if (idCardLast == "X" || idCardLast == "x") {
                                //alert("恭喜通过验证啦！");
                                return true;
                            } else {
                                //alert("身份证号码错误！");
                                return false;
                            }
                        } else {
                            //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                            if (idCardLast == idCardY[idCardMod]) {
                                //alert("恭喜通过验证啦！");
                                return true;
                            } else {
                                //alert("身份证号码错误！");
                                return false;
                            }
                        }
                    }
                } else {
                    //alert("身份证格式不正确!");
                    return false;
                }
            }

            // 从身份证号码中提取身份证号码
            this.getBirthdayFromIdCard = function (idCard) {
                var birthday = "";
                if (idCard != null && idCard != "") {
                    if (idCard.length == 15) {
                        birthday = "19" + idCard.substr(6, 6);
                    } else if (idCard.length == 18) {
                        birthday = idCard.substr(6, 8);
                    }

                    birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
                }

                return birthday;
            };

            // 从身份证号码中提取性别
            this.getSexFromIdCard = function (idCard) {
                var sexno, sex
                if (psidno.length == 18) {
                    sexno = psidno.substring(16, 17)
                } else if (psidno.length == 15) {
                    sexno = psidno.substring(14, 15)
                } else {
                    alert("错误的身份证号码，请核对！")
                    return false
                }
                var tempid = sexno % 2;
                if (tempid == 0) {
                    sex = '男'
                } else {
                    sex = '女'
                }
                return sex
            };
        }]);
})();