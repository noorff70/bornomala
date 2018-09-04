import {TopicDetail, Problem, QuestionLine, AnswerLine} from '../../models/model';
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
  questionLines: QuestionLine[];
  answerLines: any[];
  selectedAnswer: string;
  answer: string;
  showAnswerPanel: boolean;
  correctAnswer: boolean; // correct/wrong answer
  firstPage: boolean; // blank page with description of test and a next button.
  topic: string;
  questionType: string;
  userInput: string;
  borderColor: string;
  hideTextBox = true;
  imageLine: any;
  @ViewChild('image') image: ElementRef;
  showPiPlot: boolean;
  script: any

  constructor(private mathDetail: MathdetailService, private elementRef: ElementRef) {
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

    this.firstPage = false;
    this.questionLines = this.problemList[this.currentIndexToShow].questionLines;
    this.answer = this.problemList[this.currentIndexToShow].answer.answer;
    this.answerLines = this.problemList[this.currentIndexToShow].answer.answerList;
    this.questionType = this.problemList[this.currentIndexToShow].questionType;
    this.currentIndexToShow++;
    this.userInput = '';
    this.showAnswerPanel = false;


    if (this.questionType === 'PIPLOT') {
      this.showPiPlot = true;
    } else {
      this.showPiPlot = false;
    }

    if (this.questionType === 'PIPLOT') {

      for (let i = 0; i < this.questionLines.length; i++) {

        this.loadScript()

        this.imageLine = JSON.stringify(this.questionLines[i].questionLn).replace(/\\/g, '');
        this.questionLines = this.questionLines.slice(1, this.questionLines.length);

      }

    }
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
    } else if (this.userInput != null) {

      if (parseFloat(this.userInput) === parseFloat(this.answer)) {
        this.correctAnswer = true;
      } else {
        this.correctAnswer = false;
      }


      /*   if (this.userInput === this.answer) {
           this.correctAnswer = true;
         } else {
           this.correctAnswer = false;
         }*/
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

}
