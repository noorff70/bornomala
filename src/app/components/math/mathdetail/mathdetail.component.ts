import {TopicDetail, Problem, QuestionLine, AnswerLine, MultipleQuestion, Score, Lesson, LessonBody, TopicList, LoggedUser, MessageReturned} from '../../../models/model';
import {CommunicationService} from "../../../services/common/communication.service";
import {MathdetailService} from '../../../services/mathdetail/mathdetail.service';
import {PagerService} from "../../../services/pagerservice/pager.service";
import {Component, OnInit, Input, ElementRef, OnDestroy, ViewChild, NgZone, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
//import * as $ from 'jquery';

@Component({
  selector: 'app-mathdetail',
  templateUrl: './mathdetail.component.html',
  styleUrls: ['./mathdetail.component.css'],
  providers: [MathdetailService]
})
export class MathdetailComponent implements OnInit {

  @Input() childTopic: TopicDetail;
  @Input() studentGradeinChild: any;
  problemList: Problem[];
  currentIndexToShow = 0;
  tempQuestionLines: QuestionLine[];
  questionLines: QuestionLine[];
  questionList: MultipleQuestion[];
  answerLines: any[];
  selectedAnswer: string;
  userSelectedAnswer: string;
  answer: string;
  displayableAnswer: string;
  showAnswerPanel: boolean;
  correctAnswer: boolean; // correct/wrong answer
  questionAnswered: boolean;
  topic: string;
  questionType: string;
  userInput: string;
  userInputs: string[];
  borderColor: string;
  imageLine: any;
  showPiPlot: boolean;
  script: any;
  score: Score;
  lessonList: any[];
  allItems: any //Lesson[];
  pagedItems: Lesson[];
  pager: any = {};

  startPracticeClicked: boolean;
  chapterReviewClicked: boolean;
  firstPageClicked: boolean; // blank page with description of test and a next button.
  timeTaken: any
  timeTakenToRecord: number;

  loggedUser: LoggedUser;
  cacheProblem: Problem;
  cacheTopic: TopicList; // for caching
  cacheProblemList: Problem[];
  userInputEnabled: boolean;
  time: number = 0;

  mReturned: MessageReturned;
  buttonDisabled: boolean = false;
  historicalTestFound: boolean = false;
  
 // chatbotModal: boolean;
  askBot: any;
  answerBot: any;
  chatBotMsgs: string[];

  constructor(private mathDetail: MathdetailService,
    private elementRef: ElementRef,
    private pagerService: PagerService,
    private comService: CommunicationService,
    public router: Router) {
    this.questionList = [];
    this.questionLines = [];
    this.pagedItems = [];
    this.allItems = [];
    this.lessonList = [];
    this.answerLines = [];
    this.score = new Score();
    this.score.correct = 0;
    this.score.wrong = 0;
    this.questionAnswered = false;
    this.cacheTopic = new TopicList();
    this.cacheTopic.problemList = [];
    this.cacheProblemList = [];
  //  this.chatbotModal = false;
    this.chatBotMsgs = [];
    this.askBot = '';
    this.answerBot = 'How can I help you?';
  }

  ngOnInit() {
    // initialize the first page which consists on description and a next button, 
    // so the panel is set false and first page true
    this.showAnswerPanel = false;
    this.firstPageClicked = true;
    this.questionAnswered = false;
    this.problemList = null;
    this.invokeMathDetail();
    this.chatBotMsgs.push(this.answerBot);
  }


  invokeMathDetail() {

    this.mathDetail.getMathDetail(this.childTopic.topicDetailsId, this.studentGradeinChild).subscribe(
      resultArray => {
        this.problemList = resultArray.problemList;
        this.allItems = resultArray.lessonList;
        this.topic = this.problemList[0].questionHeading;
        this.setNumberOfQuestionsInTest();
        this.saveTopicId();
        this.saveTopicListToLocalStorage();
      },
      error => {
        console.log('Error in Rest Call');
        this.problemList = null;
      }
    )
  }

  nextButtonOnClick() {

    this.mReturned = new MessageReturned();

    if (this.currentIndexToShow >= this.problemList.length) {
      this.mReturned.msg = 'Test Complete';
      this.clearTime();
      this.mReturned.success = true;
      this.buttonDisabled = true;
      return;
    }

    this.clearTime();

    // cache current questions
    this.cacheProblem = new Problem();

    this.cacheTopic.topicId = this.childTopic.topicDetailsId;
    this.cacheProblem.questionLines = this.problemList[this.currentIndexToShow].questionLines;
    this.cacheProblem.answer = this.problemList[this.currentIndexToShow].answer;
    this.cacheProblem.answer.displayableAnswer = this.problemList[this.currentIndexToShow].answer.displayableAnswer;
    this.cacheProblem.answer.didAnswered = true;
    this.cacheProblem.answer.answerList = this.problemList[this.currentIndexToShow].answer.answerList;
    this.cacheProblem.questionType = this.problemList[this.currentIndexToShow].questionType;
    this.cacheProblem.problemNumber = this.problemList[this.currentIndexToShow].problemNumber;
    this.cacheTopic.problemList.push(this.cacheProblem);
  
    this.userInput = '';
    this.userInputs = []
    this.questionList = [];
    this.questionLines = [];


    this.questionAnswered = false

    this.tempQuestionLines = this.problemList[this.currentIndexToShow].questionLines;
    this.answer = this.problemList[this.currentIndexToShow].answer.answer;
    this.displayableAnswer = this.problemList[this.currentIndexToShow].answer.displayableAnswer;
    if (null === this.displayableAnswer) {
      this.displayableAnswer = this.answer;
    }
    this.answerLines = this.problemList[this.currentIndexToShow].answer.answerList;
    this.questionType = this.problemList[this.currentIndexToShow].questionType;
    this.currentIndexToShow++;

    this.showAnswerPanel = false; // will only appear when the check button is clicked


    if (this.questionType === 'PIPLOT') {
      this.showPiPlot = true;
      this.loadScript();
      this.imageLine = JSON.stringify(this.tempQuestionLines[0].questionLn).replace(/\\/g, '');

      this.tempQuestionLines = this.tempQuestionLines.slice(1, this.tempQuestionLines.length);
    } else {
      this.tempQuestionLines = this.tempQuestionLines.slice(0, this.tempQuestionLines.length);
      this.showPiPlot = false;
    }

    this.checkForMultipleQuestions();
    this.calculateTime();
  }

  loadScript() {

    let imagex = document.getElementById("image")

    if (null != imagex) {
      document.getElementById("image").innerHTML = null
    }

    this.script = document.createElement('script');
    this.elementRef.nativeElement.appendChild(this.script);

    this.script.type = 'text/javascript';
    this.script.src = './assets/GeoImage.js';
  }


  checkAnswer() {
    if (this.questionAnswered != true) {

      this.showAnswerPanel = true;

      // Radio Button
      if (this.selectedAnswer != null) {
        if (this.selectedAnswer === this.answer) {
          this.recordCorrectScore();
        } else {
          this.recordIncorrectScore();
        }
        this.cacheProblem.answer.userRadioButtonAnswer = this.selectedAnswer;
      } // Single Text Box
      else if ((this.userInputs.length == 0) && this.userInput != null) {

        let userAnswer = this.removeLeadingZeros(this.userInput.trim().replace(/\s+/g, ''));
        //it has a single answer
        if (null != this.answer) {
          let answer = this.removeLeadingZeros(this.answer.trim().replace(/\s+/g, ''));

          if (answer.toUpperCase() === userAnswer.toUpperCase()) {
            this.recordCorrectScore();
          } else {
            this.recordIncorrectScore();
          }
        } else if (null != this.answerLines) {
          let correctAnswer = false;

          for (let m = 0; m < this.answerLines.length; m++) {
            let answer = this.answerLines[m].answerLn;
            answer = this.removeLeadingZeros(answer.replace(/\s+/g, ''));

            if (userAnswer.toUpperCase() === answer.toUpperCase()) {
              correctAnswer = true;
            }
          }
          if (correctAnswer) {
            this.recordCorrectScore();
          } else {
            this.recordIncorrectScore()
          }
        }
        this.cacheProblem.answer.userTextBoxAnswer = this.userInput;

      } // else block for multiple questions
      else if (this.userInputs.length > 0) {
        this.showAnswerPanel = false;
        this.isMultipleQuestionCorrect();
        this.cacheProblem.answer.userTextBoxAnswerList = this.userInputs;
      }
      else {
        this.recordIncorrectScore();
        this.cacheProblem.answer.userTextBoxAnswerList = this.userInputs;
      }
/*
      if (this.correctAnswer) {
       // this.borderColor = 'correct';
      } else {
       // this.borderColor = 'wrong';
      }*/
      this.questionAnswered = true;
      this.cacheTopic.correct = this.score.correct;
      this.cacheTopic.wrong = this.score.wrong;
      this.cacheTopic.unAnswered = this.score.wrong;
    }
    this.cacheProblem.answer.timeTaken = this.timeTakenToRecord;
    this.clearTime();
  }


  onSelectionChange(selectedItem) {
    this.selectedAnswer = selectedItem;
  }

  /*
   * if multiple questions then save that in a questionList, otherwise save that to questionlines
   */
  checkForMultipleQuestions() {
    for (let i = 0; i < this.tempQuestionLines.length; i++) {
      if (this.tempQuestionLines[i].latexFormat === 'MULTIPLE_QUESTION') {
        let question = this.tempQuestionLines[i].questionLn;
        this.keyValueQuestionList(question);
      } else {
        let question = this.tempQuestionLines[i];
        this.questionLines.push(question);
      }
    }
  }

  /*
   * split the question with delimeter 'answer' with first part as question and second part as answer
   * create a new object and push that to questionlist
   */
  keyValueQuestionList(qst) {
    let mp = new MultipleQuestion();
    let input = qst.split('answer');
    let question = input[0]
    let answer = input[1];
    mp.question = question;
    mp.answer = answer;
    this.questionList.push(mp);
  }

  /*
   * does the list holds a list of questions?
   */
  isQuestionList() {
    if (this.questionList.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /*
   * check user input for multiple questions
   */
  isMultipleQuestionCorrect() {

    for (let i = 0; i < this.questionList.length; i++) {

      if (this.userInputs[i] !== undefined && null !== this.userInputs[i]) {

        let answer = this.removeLeadingZeros(this.questionList[i].answer.trim().replace(/\s+/g, ''));
        let userAnswer = this.removeLeadingZeros(this.userInputs[i].trim().replace(/\s+/g, ''));

        if (answer.toUpperCase() === userAnswer.toUpperCase()) {
          this.questionList[i].label = 'Correct';
          this.score.correct++;
          this.questionList[i].lookAndFeel = 'label label-success'
        } else {
          this.score.wrong++;
          this.questionList[i].label = 'Wrong';
          this.questionList[i].lookAndFeel = 'label label-danger'
        }
      }
      else {
        this.score.wrong++;
        this.questionList[i].label = 'Wrong';
        this.questionList[i].lookAndFeel = 'label label-danger'
      }
    }
  }

  /*
   * sets the number of total questions
   */
  setNumberOfQuestionsInTest() {
    this.score.total = this.problemList.length;

    for (let i = 0; i < this.problemList.length; i++) {

      const question = this.problemList[i].questionLines;
      // look for multiple questions in one question. The main question is included in the list. Therefore, we loop the questionlines length-1 times.
      for (let j = 0; j < question.length - 1; j++) {
        const qline = question[j].questionLn;
        if (question[j].latexFormat !== null && question[j].latexFormat === 'MULTIPLE_QUESTION') {
          this.score.total++;
        }
      }
    }
  }


  setPage(page: number) {

    this.pager = this.pagerService.getPager(this.allItems.length, page);
    this.pagedItems = this.allItems.slice(this.pager.currentPage - 1, this.pager.currentPage);
  }

  startReview() {

    if (null === this.allItems) {
      this.buttonDisabled = true;

    } else {
      this.startPracticeClicked = false;
      this.chapterReviewClicked = true;
     // this.historicalTestClicked = false;
      this.firstPageClicked = false;

      this.setPage(1);
    }


    //    this.reviewPage = tr    
  }

  ifEmptyPicturePath(obj) {

    const val = (obj && (Object.keys(obj).length) === 0);

    if (val === false) {
      return false
    }
    return true;
  }

  removeLeadingZeros(str) {
    //if there is no decimal or contains a character
    if (str.indexOf(".") === -1 || isNaN(str) === true) {
      return str;
    }
    //copied from stack over flow that removes leading and trailing 0s
    return eval(str).toPrecision(10).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1")
    // return str.replace(/^0+/, '');
  }

  saveTopicListToLocalStorage() {

    let found: boolean = false;
    let key = 'user';
    this.loggedUser = JSON.parse(localStorage.getItem(key));

    if (null !== this.loggedUser) {

      if ((typeof (this.loggedUser.topicList) !== 'undefined')) {
        this.loggedUser.currentTopic = this.childTopic.topicDetailsId;

        for (let i = 0; i < this.loggedUser.topicList.length; i++) {
          let topicNumber = this.loggedUser.topicList[i].topicId;

          // if found don't save unless user clicks save button
          if (topicNumber === this.childTopic.topicDetailsId) {
            this.loggedUser.topicList[i].problemList = this.problemList;
            found = true;
            break;
          }
        }
        if (!found) { // if not found 
          let newTopicList = new TopicList();

          newTopicList.topicId = this.childTopic.topicDetailsId;
          newTopicList.problemList = this.problemList;
          this.loggedUser.topicList.push(newTopicList);

        }
      }
      else {
        this.loggedUser.topicList = [];
        let newTopicList = new TopicList();

        newTopicList.topicId = this.childTopic.topicDetailsId;
        newTopicList.problemList = this.problemList;
        this.loggedUser.topicList.push(newTopicList);
      }

      //   localStorage.setItem(key, JSON.stringify(this.loggedUser));

    }

  }

  nextReview() {

    this.questionAnswered = false
    // this.reviewPage = false;
    this.questionList = [];
    //  this.firstPage = false;
    this.tempQuestionLines = this.problemList[this.currentIndexToShow].questionLines;
    this.answer = this.problemList[this.currentIndexToShow].answer.answer;
    this.displayableAnswer = this.problemList[this.currentIndexToShow].answer.displayableAnswer;
    if (null === this.displayableAnswer) {
      this.displayableAnswer = this.answer;
    }
    this.answerLines = this.problemList[this.currentIndexToShow].answer.answerList;
    this.questionType = this.problemList[this.currentIndexToShow].questionType;
    this.currentIndexToShow++;
    this.userInput = '';
    this.showAnswerPanel = false; // will only appear when the check button is clicked
    this.userInputs = []
    this.questionLines = [];

    if (this.questionType === 'PIPLOT') {
      this.showPiPlot = true;
      this.loadScript();
      this.imageLine = JSON.stringify(this.tempQuestionLines[0].questionLn).replace(/\\/g, '');

      this.tempQuestionLines = this.tempQuestionLines.slice(1, this.tempQuestionLines.length);
    } else {
      this.tempQuestionLines = this.tempQuestionLines.slice(0, this.tempQuestionLines.length);
      this.showPiPlot = false;
    }
  }

  saveButtonOnClick() {

    this.checkAnswer();

    this.mReturned = new MessageReturned();

    if (null === this.loggedUser) {
      this.mReturned.msg = 'Please login to Save';
      this.mReturned.success = true;
      return;
    }

    // save if the problem list is finished
      if (this.currentIndexToShow >= this.problemList.length) {
        for (let i = 0; i < this.loggedUser.topicList.length; i++) {
          let topicNumber = this.loggedUser.topicList[i].topicId;

          // if found don't save unless user clicks save button
          if (topicNumber === this.childTopic.topicDetailsId) {
            this.loggedUser.topicList[i].completedTopic = true;
            break;
          }
        }
        
      }
    else {
          for (let i = 0; i < this.loggedUser.topicList.length; i++) {
            let topicNumber = this.loggedUser.topicList[i].topicId;

            // if found don't save unless user clicks save button
            if (topicNumber === this.childTopic.topicDetailsId) {
              this.loggedUser.topicList[i].completedTopic = false;
              this.loggedUser.topicList[i].correct = this.score.correct;
              this.loggedUser.topicList[i].wrong = this.score.wrong;
              this.loggedUser.topicList[i].unAnswered = this.problemList.length 
                - this.score.correct - this.score.wrong;
              break;
            }
        }
      }

    let key = 'user';
    localStorage.setItem(key, JSON.stringify(this.loggedUser));
    this.mReturned.msg = 'Test Saved';
    this.mReturned.success = true;
  }

  retrieveHistory() {
    let key = 'user';
    this.loggedUser = JSON.parse(localStorage.getItem(key));

    if (null !== this.loggedUser) {
      if ((typeof (this.loggedUser.topicList) !== 'undefined')) {
        {

          for (let i = 0; i < this.loggedUser.topicList.length; i++) {
            let topicNumber = this.loggedUser.topicList[i].topicId;

            // if found don't save unless user clicks save button
            if (topicNumber === this.childTopic.topicDetailsId) {
              this.cacheProblemList = this.loggedUser.topicList[i].problemList;
              // this.saveButtonDIsabled = false;
              this.historicalTestFound = true;
              break;
            }
          }

        }

      }

    }

  }

  startPractice() {

    this.startPracticeClicked = true;
    this.chapterReviewClicked = false;
    this.firstPageClicked = false;

    this.userInputEnabled = true;
    this.calculateTime();
    this.nextButtonOnClick();

  }

  startHistoryPractice() {

    this.comService.changeCommScreen('<app-mathhistorydetail></app-mathhistorydetail>');

    this.startPracticeClicked = false;
    this.chapterReviewClicked = false;
  //  this.historicalTestClicked = true;
    this.firstPageClicked = false;

    this.nextButtonOnClick();

  }

  calculateTime() {

    this.timeTaken = setInterval(() => {
      this.time++;
      this.timeTakenToRecord = this.time;
    }, 1000);

  }

  clearTime() {

    clearInterval(this.timeTaken);
    this.time = 0;
  }

  saveTopicId() {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));

    if (null !== this.loggedUser) {
      this.loggedUser.currentTopic = this.childTopic.topicDetailsId;
      localStorage.setItem('user', JSON.stringify(this.loggedUser));

    }
  }
  
  recordCorrectScore() {
    this.correctAnswer = true;
    this.score.correct++;
    this.cacheProblem.answer.isAnswerCorrect = 1;
    this.borderColor = 'correct';
  }
  
  recordIncorrectScore() {
    this.score.wrong++;
    this.correctAnswer = false;
    this.cacheProblem.answer.isAnswerCorrect = 0;
    this.borderColor = 'wrong';
  }
  
  callMathbot() {
   
    this.mathDetail.getMathbotAnswer(this.askBot).subscribe(
      answer => {
        this.chatBotMsgs.push(this.askBot);
        this.chatBotMsgs.push(JSON.stringify(answer));
      },
      error => {
        console.log('Error in Rest Call');
      }
    )
    console.log('returned from chat');
  }
  
  cancelMathbot() {
   // this.chatBotMsgs = null;
  }

}
