import {TopicDetail, Problem, QuestionLine, AnswerLine, MultipleQuestion} from '../../models/model';
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
  tempQuestionList: any[];
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
  hideTextBox = true;
  imageLine: any;
  showPiPlot: boolean;
  script: any
  

  constructor(private mathDetail: MathdetailService, private elementRef: ElementRef) {
    this.questionList = [];
    this.questionLines = [];
  }

  ngOnInit() {
    this.showAnswerPanel = false;
    this.firstPage = true;
    
    
    //this.testScript= document.createElement('script');
    
    this.invokeMathDetail();
  }


  invokeMathDetail() {
    this.mathDetail.getMathDetail(this.childTopic.topicDetailsId, this.studentGradeinChild).subscribe(
      resultArray => {
        this.problemList = resultArray;
        this.topic = this.problemList[0].questionHeading;
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
    this.showAnswerPanel = false;
    this.userInputs = []
    this.questionLines = [];

    if (this.questionType === 'PIPLOT') {
      this.showPiPlot = true;
    } else {
      this.showPiPlot = false;
    }

    if (this.questionType === 'PIPLOT') {
      this.loadScript();
      this.imageLine = JSON.stringify(this.tempQuestionLines[0].questionLn).replace(/\\/g, '');

      this.tempQuestionLines = this.tempQuestionLines.slice(1, this.tempQuestionLines.length);
      
    }
    this.checkForMultipleQuestions();
  }
  
  loadScript() {

    let imagex = document.getElementById("image")

    if (null != imagex) {
      document.getElementById("image").innerHTML = null
      this.removeImage()
    }
    
    this.script = document.createElement('script');
    this.elementRef.nativeElement.appendChild(this.script);

    this.script.type = 'text/javascript';
    this.script.src = './assets/GeoImage.js';
  }
  
  removeImage() {

  }

  checkAnswer() {
    this.showAnswerPanel = true;

    if (this.selectedAnswer != null) {
      if (this.selectedAnswer === this.answer) {
        this.correctAnswer = true;
      } else {
        this.correctAnswer = false;
      }
    } else if (this.userInput != null && this.userInputs.length == 0) {

      if (parseFloat(this.userInput) === parseFloat(this.answer)) {
        this.correctAnswer = true;
      } else {
        this.correctAnswer = false;
      }
    } else if (this.userInputs.length >0) {
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
  
  keyValueQuestionList (qst) {
    let mp = new MultipleQuestion();
    let input = qst.split('answer');
    let question = input[0]
    let answer = input[1];
    mp.question = question;
    mp.answer = answer;
    this.questionList.push(mp);
  }
  
  isQuestionList () {
    if (this.questionList.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  
  isMultipleQuestionCorrect() {
    console.log('');
    for (let i=0; i< this.questionList.length; i++) {
      if (this.questionList[i].answer.trim() == this.userInputs[i]) {
        this.questionList[i].label = 'Correct';
        this.questionList[i].lookAndFeel = 'label label-success'
      } else {
        this.questionList[i].label = 'Wrong';
        this.questionList[i].lookAndFeel = 'label label-danger'
      }
    }
  }

}
