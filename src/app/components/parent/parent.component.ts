import {Topic, TopicDetail} from '../../models/model';
import { CommunicationService } from "../../services/common/communication.service";
import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
})
export class ParentComponent implements OnInit {

  topicList: Topic[];
  currentscreen: string;
  parentTopic: TopicDetail;
  studentGrade: any;
  screen: any;

  constructor(private commService: CommunicationService) {
  }

  ngOnInit() {
   // this.currentscreen = '<app-body></app-body>';
     this.commService.changeScreenService.subscribe(screen => {
     this.currentscreen = screen;
    });
  }

  // user select main menu and list of sub menu will be displayed in body
  displayChangeToBody(list: any) {
    this.topicList = list;
  }

  // user pressed from any of the submenu and wants to go back to main menu
  changeToNewScreen (screen) {
    this.currentscreen = screen;
  }

  displayTopic (tDetail) {
    this.parentTopic = tDetail;
  }

  setStudentGrade (grade) {
    this.studentGrade = grade;
  }

}
