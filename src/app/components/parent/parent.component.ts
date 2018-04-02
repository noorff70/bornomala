import {Topic, TopicDetail} from '../../models/model';
import { CommunicationService } from '../../services/common/communication.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
  providers: [CommunicationService]
})
export class ParentComponent implements OnInit {

  topicList: Topic[];
  currentscreen: string;
  parentTopic: TopicDetail;

  constructor() {
  }

  ngOnInit() {
    this.currentscreen = '<app-body></app-body>';
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

}
