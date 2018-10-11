import {TopicDetail, Problem, QuestionLine, AnswerLine, MultipleQuestion, Score} from '../../models/model';
import {MathdetailService} from '../../services/mathdetail/mathdetail.service';
import {Component, OnInit, Input, ElementRef, OnDestroy, ViewChild, NgZone, ChangeDetectorRef} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-mathdetail',
  templateUrl: './mathdetail.component.html',
  styleUrls: ['./mathdetail.component.css'],
  providers: [MathdetailService]
})
export class MathdetailComponent implements OnInit {

  MathJax: any;

  @Input() childTopic: TopicDetail;
  @Input() studentGradeinChild: any;
  problemList: Problem[];
  currentIndexToShow = 0;
  tempQuestionLines: QuestionLine[];
  questionLines: QuestionLine[];
  questionList: MultipleQuestion[];
  answerLines: any[];
  selectedAnswer: string;
  answer: string;
  showAnswerPanel: boolean;
  correctAnswer: boolean; // correct/wrong answer
  firstPage: boolean; // blank page with description of test and a next button.
  topic: string;
  questionType: string;
  userInput: string;
  userInputs: string[];
  borderColor: string;
  imageLine: any;
  showPiPlot: boolean;
  script: any;
  score: Score;
  

  constructor(private mathDetail: MathdetailService, private elementRef: ElementRef) {
    this.questionList = [];
    this.questionLines = [];
    this.score = new Score();
    this.score.correct = 0;
    this.score.wrong = 0;
  }

  ngOnInit() {
    // initialize the first page which consists on description and a next button, 
    // so the panel is set false and first page true
    this.showAnswerPanel = false;
    this.firstPage = true;
  
    this.invokeMathDetail();
  }


  invokeMathDetail() {
    this.mathDetail.getMathDetail(this.childTopic.topicDetailsId, this.studentGradeinChild).subscribe(
      resultArray => {
        this.problemList = resultArray.problem;
        this.topic = this.problemList[0].questionHeading;
        this.setNumberOfQuestionsInTest();
      },
      error => {
        // TODO
      }
    )
  }

  nextButtonOnClick() {
    this.questionList = [];
    this.firstPage = false;
    this.tempQuestionLines = this.problemList[this.currentIndexToShow].questionLines;
    this.answer = this.problemList[this.currentIndexToShow].answer.answer;
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
      this.showPiPlot = false;
    }

    this.checkForMultipleQuestions();
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

    // if block for text box
    if (this.selectedAnswer != null) {
      if (this.selectedAnswer === this.answer) {
        this.correctAnswer = true;
        this.score.correct++;
      } else {
        this.score.wrong ++;
        this.correctAnswer = false;
      }
    } // else block for radio button
    else if (this.userInput != null && this.userInputs.length == 0) {

      if (parseFloat(this.userInput) === parseFloat(this.answer)) {
        this.score.correct ++;
        this.correctAnswer = true;
      } else {
        this.score.wrong ++;
        this.correctAnswer = false;
      }
    } // else block for multiple questions
    else if (this.userInputs.length >0) {
      this.showAnswerPanel = false;
      this.isMultipleQuestionCorrect();
    }

    if (this.correctAnswer) {
      this.borderColor = 'correct';
    } else {
      this.borderColor = 'wrong';
    }
    
  }


  onSelectionChange(selectedItem) {
    this.selectedAnswer = selectedItem;
  }
  
  /*
   * if multiple questions then save that in a questionList, otherwise save that to questionlines
   */
  checkForMultipleQuestions () {
    for (let i=0; i< this.tempQuestionLines.length; i++) {
      if (this.tempQuestionLines[i].latexFormat === 'MULTIPLE_QUESTION'){
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
  keyValueQuestionList (qst) {
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
  isQuestionList () {
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

    for (let i=0; i< this.questionList.length; i++) {
      if (parseFloat(this.questionList[i].answer.trim()) == parseFloat(this.userInputs[i])) {
        this.questionList[i].label = 'Correct';
        this.score.correct ++;
        this.questionList[i].lookAndFeel = 'label label-success'
      } else {
        this.score.wrong ++;
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
    
    for (let i=0; i<this.problemList.length; i++) {
      
      const question = this.problemList[i].questionLines;
      // look for multiple questions in one question. The main question is included in the list. Therefore, we loop the questionlines length-1 times.
      for (let j =0; j< question.length-1; j++) {
        const qline = question[j].questionLn;
        if (question[j].latexFormat !== null && question[j].latexFormat === 'MULTIPLE_QUESTION') {
          this.score.total++;
        }
      }
    }


  }
  
}
