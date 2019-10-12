import {TopicDetail, Problem, QuestionLine, AnswerLine, MultipleQuestion, Score, Lesson, LessonBody, TopicList, LoggedUser, MessageReturned} from '../../models/model';
import { CommunicationService } from "../../services/common/communication.service";
import {MathdetailService} from '../../services/mathdetail/mathdetail.service';
import {PagerService} from "../../services/pagerservice/pager.service";
import {Component, OnInit, Input, ElementRef, OnDestroy, ViewChild, NgZone, ChangeDetectorRef} from '@angular/core';



@Component({
  selector: 'app-mathhistorydetail',
  templateUrl: './mathhistorydetail.component.html',
  styleUrls: ['./mathhistorydetail.component.css'],
  providers: [MathdetailService]
})
export class MathhistorydetailComponent implements OnInit {
  //MathJax: any;

  @Input() childTopic: TopicDetail;
  problemList: Problem[];
  currentIndexToShow;
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


  startPracticeClicked: boolean;
  timeTaken: any
  timeTakenToRecord: number;

  loggedUser: LoggedUser;
  cacheProblem: Problem;
  cacheTopic: TopicList; // for caching
  cacheProblemList: Problem[];
  userInputEnabled: boolean;
  time: number= 0;
  
  mReturned: MessageReturned;
 // buttonDisabled: boolean= false;
  checkButton: boolean;
  saveButton: boolean;
  nextButton: boolean;
  
  historicalTestFound: boolean= false;
  msg: boolean;
  topicDetailId: any;
  currentTopic: TopicList;

  constructor(
    private mathDetail: MathdetailService,
    private elementRef: ElementRef, 
    private pagerService: PagerService,
    private comService: CommunicationService) 
  {
    this.questionList = [];
    this.questionLines = [];
    this.answerLines = [];
    this.score = new Score();
    this.score.correct = 0;
    this.score.wrong = 0;
    this.questionAnswered = false;
    this.cacheTopic = new TopicList();
    this.cacheTopic.problemList = [];
    this.cacheProblemList = [];
    this.msg = false;
  }

  ngOnInit() {

    this.showAnswerPanel = false;
    this.questionAnswered = false;
    this.invokeMathDetail();

  }


  invokeMathDetail() {
    
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    
    this.mReturned = new MessageReturned();
    
    if (null === this.loggedUser) {
        this.mReturned.msg = 'Please login to Retrieve Historical ';
        this.msg= true;
        return;
    }
       
    if (null !== this.loggedUser) {
      this.topicDetailId = this.loggedUser.currentTopic;
      this.populateProblemList();
      
      if (this.historicalTestFound === true) {
        this.topic = this.problemList[0].questionHeading;
     //   this.setNumberOfQuestionsInTest();
        this.startPractice();
      }
      
    }
      
  }

  nextButtonOnClick() {
    
    this.mReturned = new MessageReturned();
    this.buttonStatus();
    
    if (this.currentIndexToShow >= this.problemList.length) {
        this.mReturned.msg = 'Test Complete';
        this.clearTime();
        this.msg = true;
    //    this.buttonDisabled = true;
        return; 
    }
      

    if (typeof this.problemList[this.currentIndexToShow].answer !== undefined && this.problemList[this.currentIndexToShow].answer.didAnswered === true) {
      this.userInputEnabled = false;
      this.userInput = this.problemList[this.currentIndexToShow].answer.userTextBoxAnswer;
      this.userInputs = this.problemList[this.currentIndexToShow].answer.userTextBoxAnswerList;
      if (typeof this.userInputs === 'undefined') {
        this.userInputs = [];
      }
      this.selectedAnswer = this.problemList[this.currentIndexToShow].answer.userRadioButtonAnswer;
    } else {
      this.userInputEnabled = true;
      this.userInput = '';
      this.userInputs = [];
    }
    
    this.clearTime();

    // cache current questions
    this.cacheProblem = new Problem();

    this.cacheTopic.topicId = this.topicDetailId;
    this.cacheProblem.questionLines = this.problemList[this.currentIndexToShow].questionLines;
    this.cacheProblem.answer = this.problemList[this.currentIndexToShow].answer;
    this.cacheProblem.answer.displayableAnswer = this.problemList[this.currentIndexToShow].answer.displayableAnswer;
    this.cacheProblem.answer.didAnswered = true;
    this.cacheProblem.answer.answerList = this.problemList[this.currentIndexToShow].answer.answerList;
    this.cacheProblem.questionType = this.problemList[this.currentIndexToShow].questionType;
    this.cacheProblem.problemNumber = this.problemList[this.currentIndexToShow].problemNumber;
    this.cacheTopic.problemList.push(this.cacheProblem);

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
   // this.currentIndexToShow++;

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

    this.currentIndexToShow++;
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

      this.showAnswerPanel = true;

      // Radio Button
      if (this.selectedAnswer != null) {
        if (this.selectedAnswer === this.answer) {
          this.correctAnswer = true;
          this.score.correct++;
        } else {
          this.score.wrong++;
          this.correctAnswer = false;
        }
        this.cacheProblem.answer.userRadioButtonAnswer = this.selectedAnswer;
      } // Single Text Box
      else if ((this.userInputs.length == 0) && this.userInput != null) {

        let userAnswer = this.removeLeadingZeros(this.userInput.trim().replace(/\s+/g, ''));
        //it has a single answer
        if (null != this.answer) {
          let answer = this.removeLeadingZeros(this.answer.trim().replace(/\s+/g, ''));

          if (answer.toUpperCase() === userAnswer.toUpperCase()) {
            this.score.correct++;
            this.correctAnswer = true;
          } else {
            this.score.wrong++;
            this.correctAnswer = false;
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
            this.score.correct++;
            this.correctAnswer = true;
          } else {
            this.score.wrong++;
            this.correctAnswer = false;
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
        this.score.wrong++;
        this.correctAnswer = false;
        this.cacheProblem.answer.userTextBoxAnswerList = this.userInputs;
      }

      if (this.correctAnswer) {
        this.borderColor = 'correct';
        this.cacheProblem.answer.isAnswerCorrect = 1;
   //     this.cacheProblem.score++;
        this.currentTopic.correct++;
      } else {
        this.borderColor = 'wrong';
        this.cacheProblem.answer.isAnswerCorrect = 0;
      }
      this.questionAnswered = true;
    
    if ( undefined === this.problemList[this.currentIndexToShow].answer.timeTaken) {
      this.cacheProblem.answer.timeTaken = this.timeTakenToRecord;
    }
    
    this.checkButton = true;
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


  saveButtonOnClick() {

    if (!this.checkButton) {
      this.checkAnswer();
    }
    
    
    this.mReturned = new MessageReturned();
    
    if (null === this.loggedUser) {
      this.mReturned.msg = 'Please login to Save';
      this.msg= true;
      return;
    }

    let key = 'user';


  /*  for (let i = 0; i < this.loggedUser.topicList.length; i++) {
      let topicNumber = this.loggedUser.topicList[i].topicId; //get topic number

      if (topicNumber === this.topicDetailId) { //if topic saved in local storage

        let tListFromLocal = this.loggedUser.topicList[i]; // find list of problems for that topic number from localstorage
        let pListFromLocal = tListFromLocal.problemList;

        let pListFromCache = this.cacheTopic.problemList;

        // now put the cache problems to local storageList
        for (let j = 0; j < pListFromCache.length; j++) { // retrieve from cache. this is saved when next button pressed
          for (let k = 0; k < pListFromLocal.length; k++) {
            if (pListFromCache[j].problemNumber === pListFromLocal[k].problemNumber) {
              pListFromLocal[k] = pListFromCache[j];
              break;
            }
          }
        }
      }
    } */
    
    if (this.problemList.length === this.currentIndexToShow)
      this.currentTopic.completedTopic = true;

    localStorage.setItem(key, JSON.stringify(this.loggedUser));
    this.mReturned.msg = 'Test Saved';
    this.msg= true;
  }

  startPractice() {
    this.currentIndexToShow =0;
    this.startPracticeClicked = true;
    this.userInputEnabled = true;
    this.calculateTime();
    this.nextButtonOnClick();

  }

  
  calculateTime( ){
   
    this.timeTaken = setInterval(()=> {
      this.time++;
      this.timeTakenToRecord = this.time;
    }, 1000);
    
  }
  
  clearTime() {
    
    clearInterval(this.timeTaken);
    this.time=0;
  }
  
  populateProblemList () {

    if (null !== this.loggedUser.topicList && this.loggedUser.topicList !== undefined) {
      
      for (let i=0; i< this.loggedUser.topicList.length; i++) {
        if (this.loggedUser.topicList[i].topicId === this.topicDetailId) {
          this.problemList = this.loggedUser.topicList[i].problemList;
          this.historicalTestFound = true;
          this.currentTopic = this.loggedUser.topicList[i];
          break;
        }
      }
    }
    
    if (this.historicalTestFound === false) {
        this.mReturned.msg = 'This test never saved ';
        this.msg= true;
        return;
    }
    
  }
  
  getAnswerFmMultipleQuestions(qst) {

      if (qst == undefined && null !== qst) {
        let answer = this.removeLeadingZeros(qst.answer.trim().replace(/\s+/g, ''));
        return answer;
    }
  }
  
  buttonStatus() {
    
    if (this.currentIndexToShow === this.problemList.length) {
      this.nextButton = true;
      this.checkButton = true;
      return;
    } else if (this.problemList[this.currentIndexToShow].answer.didAnswered === true) {
      this.checkButton = true;
    } else if (this.problemList[this.currentIndexToShow].answer.didAnswered === null ||
        this.problemList[this.currentIndexToShow].answer.didAnswered === undefined) {
      this.checkButton = false;
    }
    
  
  }

}
