import { Component, OnInit } from '@angular/core';
import {MathdetailService} from '../../../services/mathdetail/mathdetail.service';

@Component({
  selector: 'app-mathbot',
  templateUrl: './mathbot.component.html',
  styleUrls: ['./mathbot.component.css'],
  providers: [MathdetailService]
})
export class MathbotComponent implements OnInit {

  userInput: string;
  botAnswer: string;
  
  constructor(private mathDetail: MathdetailService) { }

  ngOnInit() {
  }
  
  callMathAssistant(){
  /*  this.mathDetail.getMathbot(this.userInput).subscribe(
      answer => {
        this.botAnswer = answer;
        console.log('Got answer: ' + this.botAnswer);
      },
      error => {
        console.log('Error in Rest Call');
        
      }
    )*/
  }

}
