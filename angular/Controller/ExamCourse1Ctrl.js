(function () {
    angular.module("app")
    .controller("ExamCourse1Ctrl", ["$scope", "$interval", "$stateParams", "dataService",
        "convertService", "$state", "myConfig", "utilityService", "$log", "courseService1", "$q", "$timeout",
    function ($scope, $interval, $stateParams, dataService, convertService, $state, myConfig, utilityService, $log, courseService1, $q, $timeout) {
        var scope = $scope;
        $scope.m = {
            params: {
                courseId: $stateParams.courseId,
                courseName: $stateParams.courseName,
                difficulty: $stateParams.difficulty
            },
            exam: courseService1.exam,
            examInfo: {
                courseId: $stateParams.courseId,
                learnMode: "测试",
                questionNumber: 0,
                answerNumber: 0,
                answerRightNumber: 0,
                score: 0,
                startTime: new Date(),
                endTime: new Date(),
                useTime: ""
            },
            isShowExamInfo: false,
            isDoAllQuestion:false
        };

        $scope.loadData = function () {
            dataService.getCourseContent({
                courseId: $scope.m.params.courseId
            }).then(function (args) {
                courseService1.loadExamInfo(args[0], false);
                $scope.m.exam.curQuestion = $scope.m.exam.questions[0];
                
                $timeout(createSwiper, 500);

            }, function (args) {
            });
        };

        // 退出的时候显示本次学习信息
        $scope.showExamCompleteInfo = function () {
            $scope.m.isShowExamInfo = true;
            var score = courseService1.getExamScore();
            $scope.m.examInfo.questionNumber = score.questionCount;
            $scope.m.examInfo.answerNumber = score.doQuestionCount;
            $scope.m.examInfo.answerRightNumber = score.doRightQuestionCount;
            $scope.m.examInfo.score = score.score;
            $scope.m.examInfo.endTime = new Date();
            //$scope.m.examInfo.startTime = $scope.modal.startTime;
            //$scope.m.examInfo.useTime = $scope.modal.useTime;
        };

        // 退出课程
        $scope.examCompleted = function () {
            $scope.m.examInfo.startTime = utilityService.getDateDbString($scope.m.examInfo.startTime);
            $scope.m.examInfo.endTime = utilityService.getDateDbString($scope.m.examInfo.endTime);

            dataService.saveLearnInfo($scope.m.examInfo)
            .then(function (args) {
                //$scope.m.isShowExamInfo = false;
                //$scope.loadData();
                $state.go("tab.allCourseList");
            }, function (args) {
                utilityService.alert(args);
            });
        };

        $scope.closeTimer = function () {
            $interval.cancel($scope.timer);
        };



        $scope.next = function () {
            var tempIndex = $scope.m.exam.index;
            courseService1.nextExam();
            m_swiper.slideNext();
            $scope.m.isDoAllQuestion = tempIndex == $scope.m.exam.index;
        };

        $scope.prior = function () {
            courseService1.priorExam();
            m_swiper.slidePrev();
            $scope.m.isDoAllQuestion = false;
        };

        var t1 = moment().unix();
        $scope.timer = $interval(function () {

            $scope.m.examInfo.endTime = new Date();
            var t2 = moment().unix();
            var t3 = t2 - t1;
            $scope.m.examInfo.useTime = moment(t3 * 1000).utc().utcOffset(0).format('HH:mm:ss');
        }, 1000);

        

        var setLockSwipe = function (swiper) {
            var temp = swiper.activeIndex ? $scope.m.exam.questions[swiper.activeIndex] : $scope.m.exam.questions[0];
            if (temp.answerStatus == 0)
                swiper.lockSwipeToNext();
            else
                swiper.unlockSwipeToNext();

            scope.m.exam.curQuestion = scope.m.exam.questions[swiper.activeIndex];
        }
       
        var m_swiper = null;
        var createSwiper = function () {
            m_swiper = new Swiper('.swiper-container', {
                speed: 300,
                shortSwipes: true,
                threshold: 40,
                onSlideChangeEnd: function (swiper) {
                    //alert(swiper.activeIndex);
                    var item = scope.m.exam.questions[swiper.activeIndex];
                    setLockSwipe(swiper);
                    addSwiper(swiper);
                },
                onInit: function (swiper) {
                    
                }
            });
            
            addSwiper(m_swiper);
            addSwiper(m_swiper);
            setLockSwipe(m_swiper);
        }

        var addSwiper = function (swiper) {
            if (!swiper) {
                return;
            }
            var tempIndex = swiper.slides ? swiper.slides.length : 0;
            var item = scope.m.exam.questions[tempIndex];

            if (scope.m.exam.questions.length > tempIndex) {
                var html = "";
                html += '<div class="swiper-slide">';
                html += getQuestionHtml(scope.m.exam.questions[tempIndex], tempIndex);
                html += '</div>';
                swiper.appendSlide(html);
                setEventListenerEx(swiper.slides.length - 2);
                setEventListenerEx(swiper.slides.length - 1);
            }
        };

        var setEventListenerEx = function (index) {
            $("div[id*='questionDiv" + index + "']").unbind("click").click(function () {
                
                var id = this.id;
                var tt = id.split("_");
                var answerIndex = parseInt(tt[tt.length - 1]);

                var checkId = "#" + id.replace("questionDiv", "questionCheck");
                if ($(checkId).length > 0) {
                    var check = $(checkId)[0].checked;
                    if (check) {
                        $(checkId)[0].checked = false;
                        $scope.m.exam.curQuestion.items[answerIndex].isUserChoice = false;
                    }
                    else {
                        $(checkId)[0].checked = true;
                        $scope.m.exam.curQuestion.items[answerIndex].isUserChoice = true;
                    }
                }
                

                var radioId = "#" + id.replace("questionDiv", "questionRadio");
                if ($(radioId).length > 0) {
                    for (var i = 0; i < $scope.m.exam.curQuestion.items.length; i++) {
                        $scope.m.exam.curQuestion.items[i].isUserChoice = false;
                    }
                    $(radioId)[0].checked = true;
                    $scope.m.exam.curQuestion.items[answerIndex].isUserChoice = true;
                }
                

                courseService1.checkExamQuestionAnswer($scope.m.exam.curQuestion);
                setLockSwipe(m_swiper);
            });
        };

        var getQuestionHtml = function (item, index) {
            var html = "";

            if (item.rightAnswerCount > 1) {
                // 处理多选题

                // 处理题目
                html = '<div class="padding">';
                html += '<strong>';
                html += '<h5 style="margin-top:8px;">' + (index +1)  + '、' + item.title + '<span style="float:right;"  class="assertive">(' + item.rightAnswerCount + ')</span></h5>';
                html += '</strong>';
                html += '</div>';
            }
            else {
                // 处理单选题

                // 处理题目
                html = '<div class="padding">';
                html += '<strong>';
                html += '<h5 style="margin-top:8px;">' + (index + 1) + '、' + item.title + '</h5>';
                html += '</strong>';
                html += '</div>';
            }
            

            // 处理内容
            html += getQuestionContentHtml(item, index);
            return html;
        };

        var getQuestionContentHtml = function (item, index) {
            var html = "";

            if (item.rightAnswerCount > 1) {
                // 处理多选题
                for (var i = 0; i < item.items.length; i++) {
                    html += '<div class="leftIndentation padding stable-border" id="questionDiv' + index + "_" + i + '"/div>';
                    html += '<input type="checkbox" id="questionCheck' + index + "_" + i + '"/>';
                    html += '<span id="questionSpan' + index + "_" + i + '">' + item.items[i].title + '</span>';
                    html += '</div>';
                }
            }
            else {
                // 处理单选题
                for (var i = 0; i < item.items.length; i++) {
                    html += '<div class="leftIndentation padding stable-border" id="questionDiv' + index + "_" + i + '"/div>';
                    html += '<input type="radio" name="questionRadio' + index + '" id="questionRadio' + index + "_" + i + '"/>';
                    html += '<span id="questionSpan' + index + "_" + i + '">' + item.items[i].title + '</span>';
                    html += '</div>';
                }
                
            }
            return html;
        }


        $scope.m.isShowExamInfo = false;
        $scope.loadData();
    }]);
})();