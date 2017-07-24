(function () {
    angular.module("app")
    .controller("ExamCourseCtrl", ["$scope", "$interval", "$stateParams", "dataService", "examService",
        "convertService", "$state", "myConfig", "utilityService", "$log",
        function ($scope, $interval, $stateParams, dataService, examService, convertService, $state, myConfig, utilityService, $log) {
            $scope.modal = {};
            $scope.modal.courseId = $stateParams.courseId;
            $scope.modal.courseName = $stateParams.courseName;
            $scope.modal.difficulty = $stateParams.difficulty;

            $scope.modal.isShowLearnInfo = false;
            $scope.items = null;
            $scope.modal.startTime = new Date();
            $scope.modal.endTime = null;
            $scope.modal.useTime = "";
            $scope.learnRecordInfo = {
                courseId: $scope.modal.courseId,
                courseName: $scope.modal.courseName,
                personId: dataService.userInfo.personId,
                learnMode: "测试",
                difficulty: convertService.getDifficultyName($scope.difficulty),
                startTime: $scope.modal.startTime,
                endTime: $scope.modal.endTime,
                useTime: $scope.modal.useTime,
                questionNumber: 0,
                answerNumber: 0,
                answerRightNumber: 0,
                score: 0
            };

            $scope.questionCount = 0;
            $scope.modal.currentQuestionNumber = 0;

            $scope.loadData = function () {
                dataService.getCourseContent({
                    courseId: $scope.modal.courseId
                }).then(function (args) {
                    $scope.items = args;
                    $scope.loadQuestion();
                }, function (args) {
                });
            };

            $scope.getTextContent = function () {
                dataService.getTextContent({
                    courseName: $scope.modal.courseName,
                    fileName: $scope.questionItem.node.Text
                }).then(function (args) {
                    //fileName: $scope.questionItem.node.TextContent;
                }, function (args) {
                });
            };

            // 退出的时候显示本次学习信息
            $scope.showLearnCompleteInfo = function () {
                var score = examService.getScore();
                $scope.learnRecordInfo.questionNumber = score.questionCount;
                $scope.learnRecordInfo.answerNumber = score.doQuestionCount;
                $scope.learnRecordInfo.answerRightNumber = score.doRightQuestionCount;
                $scope.learnRecordInfo.score = score.score;
                $scope.learnRecordInfo.endTime = new Date();
                $scope.learnRecordInfo.startTime = $scope.modal.startTime;
                $scope.learnRecordInfo.useTime = $scope.modal.useTime;
            };

            // 退出课程
            $scope.learnCompleted = function () {
                $scope.learnRecordInfo.startTime = utilityService.getDateDbString($scope.learnRecordInfo.startTime);
                $scope.learnRecordInfo.endTime = utilityService.getDateDbString($scope.learnRecordInfo.endTime);

                dataService.saveLearnInfo($scope.learnRecordInfo)
                .then(function (args) {
                    $scope.modal.isShowLearnInfo = false;
                    $scope.loadQuestion();
                    $state.go("tab.allCourseList");
                    
                }, function (args) {
                    utilityService.alert(args);
                });
            };

            $scope.closeTimer = function () {
                $interval.cancel($scope.timer);
            };

            $scope.selectTreeNode = function (node) {
                if (node.IsQuestion) {
                    $scope.questionItem.node = node;

                    $scope.moveToQuestionById(node.id);
                }
            };

            $scope.currentQuestion = null;
            $scope.loadQuestion = function () {
                examService.loadData($scope.items, {
                    enableDisorder: true,          // 是否允许无序做题
                    isAllQuestionUse: false,        // 如果是true 的话，课程中的所有题目都将是题目。  如果是 false 的话， 题目数量由 questionNumber 决定
                    questionNumber: 50,
                    questionSore: 1,
                    difficulty: $scope.difficulty
                });
                $scope.modal.questionCount = examService.getQuestionCount();
                $scope.currentQuestion = examService.getQuestionItem();
                $scope.modal.currentQuestionNumber = 1;
            };

            $scope.submitQuestion = function () {
                examService.checkQuestionAnswer($scope.currentQuestion);
                $scope.currentQuestion.rightAnswers = examService.getRightAnswerResult($scope.currentQuestion);
                $scope.nextQuestion();
            };
            $scope.nextQuestion = function () {
                if (examService.nextQuestion()) {
                    $scope.currentQuestion = examService.getQuestionItem();
                    $scope.modal.currentQuestionNumber++;
                }
                else {
                    $scope.showLearnCompleteInfo();
                    angular.element('#learnInfo').modal('show');
                }
            };

            $scope.selectAnswer = function (item) {
                if (item.enableAnswer) {
                    item.isUserSelect = !item.isUserSelect;
                    $scope.currentQuestion.isUserAnswer = false;
                }
            };


            $scope.treeNodeFilter = function (node) {
                return node.IsAnswer === false;
            };

            $scope.$on("$ionicView.enter", function () {
                $log.debug("enter exam course");
                $scope.modal.isShowLearnInfo = false;
            });

            var t1 = moment().unix();
            $scope.timer = $interval(function () {

                $scope.endTime = new Date();
                var t2 = moment().unix();
                var t3 = t2 - t1;
                $scope.modal.useTime = moment(t3 * 1000).utc().utcOffset(0).format('HH:mm:ss');
            }, 1000);

            $scope.$emit("hiddenLogin");

            
            $scope.loadData();
        }]);
})();