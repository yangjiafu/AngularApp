(function() {
    angular.module("app")
    .service("courseService1", ["$window", function ($window) {
        this.learn = {
            questions: [],
            index: 0,
            curQuestion: {}
        };

        this.exam = {
            questions: [],
            index: 0,
            curQuestion: {}
        };
        $window.learn = this.learn;
        $window.exam = this.exam;

        var _findNode = function (node, reg) {
            if (node.title.search(reg) >= 0) {
                return node;
            }
            for (var i = 0; i < node.nodes.length; i++) {
                var subNode = arguments.callee(node.nodes[i], reg);
                if (subNode)
                    return subNode;
            }
            return null;
        }

        this._dealLearnQuestion = function (node, courseMode) {
            //var titleList = [];
            //if (courseMode == "1") {
            //    var tempTitle = node.title.split("。");
            //    for (var ii = 0; ii < tempTitle.length; ii++) {
            //        titleList.push({ title: tempTitle[ii] });
            //    }
            //}
            var tempQuestion = {
                title: courseMode == "1" ? node.title.split("。") : node.title,
                //isTitleList: courseMode == "1",
                type: "question",
                file: node.File,
                fileType: $window.getFileType(node.File),
                items: [],
                answerStatus: 0     // 0 没有回答，  1 回答正确  ，  -1 回答错误
            }

            var rightAnswer = [];
            var errorAnswer = [];

            for (var i = 0; i < node.nodes.length; i++) {
                if (node.nodes[i].IsRightAnswer == false) {
                    errorAnswer.push({
                        title: node.nodes[i].title,
                        type: "errorAnswer",
                        isUserChoice: false
                    })
                }
                else {
                    rightAnswer.push({
                        title: node.nodes[i].title,
                        type: "rightAnswer",
                        isUserChoice:false
                    })
                }
            }
            tempQuestion.rightAnswerCount = rightAnswer.length;

            
            var insertNumber = rightAnswer.length < 3 ? 3 : rightAnswer.length;
            if (insertNumber > errorAnswer.length)
                insertNumber = errorAnswer.length;

            for (var i = 0; i < insertNumber; i++) {
                var e = parseInt(Math.random() * 1000000) % errorAnswer.length;
                var v = parseInt(Math.random() * 1000000) % (rightAnswer.length + 1);
                rightAnswer.splice(v, 0, errorAnswer[e]);
                errorAnswer.splice(e, 1);
            }
            tempQuestion.items = rightAnswer;
            $window.learn.questions.push(tempQuestion);
        };

        $window._dealLearnQuestion = this._dealLearnQuestion;

        this.loadLearnInfo = function (node, courseMode) {
            $window.learn.questions = [];

            if (courseMode != "0") {
                reg = new RegExp("@test[0-9]{2}" + courseMode + "@");
                var tempNode = _findNode(node, reg);
                _loadLearnInfo(tempNode.nodes[0], courseMode);
            }
            else {
                _loadLearnInfo(node, courseMode);
            }
            
        };
        var _loadLearnInfo = function (node, courseMode) {
            var type = ""
            if (node.Check.toLowerCase() == "true") {
                type = "question";
            }
            else {
                type = "catalog";
            }

            if (node.Check.toLowerCase() == "true") {
                $window._dealLearnQuestion(node, courseMode);
            }
            else {
                var tempQuestion = {
                    title: node.title,
                    type: type,
                    file: node.File,
                    fileType: $window.getFileType(node.File),
                    items: []
                }
                $window.learn.questions.push(tempQuestion);
                for (var i = 0; i < node.nodes.length; i++) {
                    if (node.nodes[i].title.indexOf("$$") < 0 &&
                        node.nodes[i].title.indexOf("%%") < 0 &&
                        node.nodes[i].title.indexOf("@word@") < 0 &&
                        node.nodes[i].title.indexOf("@check@") < 0 &&
                        node.nodes[i].title.indexOf("@test@")) {
                        tempQuestion.items.push({
                            title: node.nodes[i].title,
                            type: node.nodes[i].Check.toLowerCase() == "true" ? "question" : "catalog"
                        });
                    }
                    arguments.callee(node.nodes[i], courseMode)
                }
            }
        }

        this.getLearnScore = function () {
            result = {
                score: 0,
                questionCount: 0,
                doQuestionCount: 0,
                doRightQuestionCount: 0
            };

            for (var i = 0; i < this.learn.questions.length; i++) {
                if (this.learn.questions[i].type == "question") {
                    result.questionCount++;

                    if (this.learn.questions[i].answerStatus == -1 ||
                        this.learn.questions[i].answerStatus == 1)
                        result.doQuestionCount++;

                    if (this.learn.questions[i].answerStatus == 1)
                        result.doRightQuestionCount++;
                }
            }
            result.score = parseInt((result.doRightQuestionCount / result.questionCount) * 100);
            return result;
        };

        this.checkLearnQuestionAnswer = function (question) {
            //question.answerStatus = 
            var result = true;
            var rightCount = 0;
            var answerCount = 0;
            for (var i = 0; i < question.items.length; i++) {
                if (question.items[i].type == "rightAnswer") {
                    rightCount++;
                }
                if (question.items[i].isUserChoice == true) {
                    answerCount++;
                }
                if ((question.items[i].type == "rightAnswer" && question.items[i].isUserChoice == false)||
                    (question.items[i].type == "errorAnswer" && question.items[i].isUserChoice == true)) {
                    result = false;
                }
            }
            result ? question.answerStatus = 1 : question.answerStatus = -1;
        }

        this.getFileType = function (file) {
            if (file.indexOf(".mp4") > 0) {
                return "video";
            }
            else if (file.indexOf(".jpg") > 0 ||
                file.indexOf(".png") > 0) {
                return "img";
            }
            else if (file.indexOf(".txt") > 0 ||
                file.indexOf(".rtf") > 0) {
                return "text";
            }
            else {
                return "";
            }
        }
        $window.getFileType = this.getFileType;

        this.nextLearn = function () {
            if (this.learn.index < this.learn.questions.length - 1)
            {
                this.learn.index++;
                this.learn.curQuestion = this.learn.questions[this.learn.index];
            }
                
        };

        this.priorLearn = function () {
            if (this.learn.index > 0)
            {
                this.learn.index--;
                this.learn.curQuestion = this.learn.questions[this.learn.index];
            }
        }


        this._dealExamQuestion = function (node, index) {
            var tempQuestion = {
                title: node.title,
                type: "question",
                file: node.File,
                fileType: $window.getFileType(node.File),
                items: [],
                answerStatus: 0     // 0 没有回答，  1 回答正确  ，  -1 回答错误
            }

            var rightAnswer = [];
            var errorAnswer = [];

            for (var i = 0; i < node.nodes.length; i++) {
                if (node.nodes[i].IsRightAnswer == false) {
                    errorAnswer.push({
                        title: node.nodes[i].title,
                        type: "errorAnswer",
                        isUserChoice: false
                    })
                }
                else {
                    rightAnswer.push({
                        title: node.nodes[i].title,
                        type: "rightAnswer",
                        isUserChoice: false
                    })
                }
            }
            tempQuestion.rightAnswerCount = rightAnswer.length;


            var insertNumber = 3;
            if (insertNumber > errorAnswer.length)
                insertNumber = errorAnswer.length;

            for (var i = 0; i < insertNumber; i++) {
                var e = parseInt(Math.random() * 1000000) % errorAnswer.length;
                var v = parseInt(Math.random() * 1000000) % (rightAnswer.length + 1);
                
                rightAnswer.splice(v, 0, errorAnswer[e]);
                errorAnswer.splice(e, 1);
            }
            tempQuestion.items = rightAnswer;
            $window.exam.questions.splice(index, 0, tempQuestion);
        };
        $window._dealExamQuestion = this._dealExamQuestion;

        this.loadExamInfo = function (node) {
            $window.exam.questions = [];
            var count = 0;
            var tempList = [];
            for (var i = 0; i < node.nodes.length; i++) {
                if (node.nodes[i].title.indexOf("%%") >= 0 ||
                    node.nodes[i].title.indexOf("@test@") >= 0 ||
                    node.nodes[i].title.indexOf("@test999@") >= 0 ) {
                    // 测试题区域
                    if (node.nodes[i].title.indexOf("@test999@") >= 0) {
                        count = parseInt(node.nodes[i].nodes[0].nodes.length / 3);
                        tempList = node.nodes[i].nodes[0].nodes.concat();
                    }
                    else {
                        count = parseInt(node.nodes[i].nodes.length / 3);
                        tempList = node.nodes[i].nodes.concat();
                    }
                    
                }
                
            }

            for (var i = 0; i < count; i++) {
                var e = parseInt(Math.random() * 1000000) % tempList.length;
                var v = this.exam.questions.length == 0 ? 0 : parseInt(Math.random() * 1000000) % this.exam.questions.length;
                $window._dealExamQuestion(tempList[e], v);
                tempList.splice(e, 1);
            }

            this.exam.curQuestion = this.exam.questions[0];
            this.exam.index = 0;
        };
        
        this.nextExam = function () {
            if (this.exam.index < this.exam.questions.length - 1) {
                this.exam.index++;
                this.exam.curQuestion = this.exam.questions[this.exam.index];
            }
        };

        this.priorExam = function () {
            if (this.exam.index > 0) {
                this.exam.index--;
                this.exam.curQuestion = this.exam.questions[this.exam.index];
            }
        };

        this.checkExamQuestionAnswer = function (question) {
            var result = true;
            var rightCount = 0;
            var answerCount = 0;
            for (var i = 0; i < question.items.length; i++) {
                if (question.items[i].type == "rightAnswer") {
                    rightCount++;
                }
                if (question.items[i].isUserChoice == true) {
                    answerCount++;
                }
                if ((question.items[i].type == "rightAnswer" && question.items[i].isUserChoice == false) ||
                    (question.items[i].type == "errorAnswer" && question.items[i].isUserChoice == true)) {
                    result = false;
                }
            }
            result ? question.answerStatus = 1 : question.answerStatus = -1;
        }

        this.getExamScore = function () {
            result = {
                score: 0,
                questionCount: 0,
                doQuestionCount: 0,
                doRightQuestionCount: 0
            };
            for (var i = 0; i < this.exam.questions.length; i++) {
                result.questionCount++;

                if (this.exam.questions[i].answerStatus == -1 ||
                    this.exam.questions[i].answerStatus == 1)
                    result.doQuestionCount++;

                if (this.exam.questions[i].answerStatus == 1)
                    result.doRightQuestionCount++;
            }
            
            result.score = parseInt((result.doRightQuestionCount / result.questionCount) * 100);
            return result;
        };
    }]);
})();