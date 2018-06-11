import {TopicDetail, Problem, QuestionLine, AnswerLine} from '../../models/model';
import { MathdetailService } from '../../services/mathdetail/mathdetail.service';
import {Component, OnInit, Input, AfterViewInit, ElementRef} from '@angular/core';

@Component({
  selector: 'app-mathdetail',
  templateUrl: './mathdetail.component.html',
  styleUrls: ['./mathdetail.component.css'],
  providers: [MathdetailService]
})
export class MathdetailComponent implements OnInit, AfterViewInit {

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


  constructor(private mathDetail: MathdetailService, private elementRef: ElementRef
     ) {}

  ngOnInit() {
    this.showAnswerPanel = false;
    this.firstPage = true;
    this.invokeMathDetail();

  /*  const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = './assets/GeoImage.js';
    this.elementRef.nativeElement.getAttribute('jsonImage');
    this.elementRef.nativeElement.appendChild(s); */
  }

  ngAfterViewInit(): void {

   /* const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = './assets/GeoImage.js';
    this.elementRef.nativeElement.getAttribute('jsonImage');
    this.elementRef.nativeElement.appendChild(s); */
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

    this.imageLine = JSON.stringify(this.questionLines[0].questionLn).replace(/\\/g, '');
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = './assets/GeoImage.js';
   // this.elementRef.nativeElement.getAttribute('jsonImage');
    this.elementRef.nativeElement.appendChild(s);


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
      if (this.userInput === this.answer) {
        this.correctAnswer = true;
      } else {
        this.correctAnswer = false;
      }
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
