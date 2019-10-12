import {Common} from '../../common/Common';
import {GradeSubject, Topic, TopicDetail, LoggedUser, TopicList} from '../../models/model';
import { CommunicationService } from "../../services/common/communication.service";
import {ParentComponent} from '../parent/parent.component';
import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {

//  gradeSubject: any;
  @Input() childTopicList: Topic[];
  @Output() topicDetail = new EventEmitter<TopicDetail>(); // child to Parent
  tDetail: TopicDetail;
  loggedUser: LoggedUser;
  topicList: TopicList[];

  constructor(
    private comService: CommunicationService) {
  }

  ngOnInit() {
    this.updateTopics();
  }

  openMathDetail(name, id) {

    this.tDetail = new TopicDetail();
    this.tDetail.topicDetailsId = id;
    this.tDetail.topicDetailName = name;
    
    this.comService.changeCommScreen('<app-mathdetail></app-mathdetail>');

    this.topicDetail.emit(this.tDetail);
  }
  
  updateTopics() {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    
    if (this.loggedUser !== null ) {
      this.topicList = this.loggedUser.topicList;
    }
  }
  
  checkTopicCompleted(topicId) {
    if (this.topicList != undefined) {
      for (let i = 0; i < this.topicList.length; i++) {
        if (this.topicList[i].topicId === topicId) {
          if (this.topicList[i].completedTopic === true) {
            return true;
          } else if (this.topicList[i].completedTopic === false) {
            return false;
          }

        }
      }
    }
    else {
      return null;
    }
  }
  
  


}
