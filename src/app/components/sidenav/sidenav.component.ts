import {Common} from '../../common/Common';
import {Grade, GradeSubject, Topic, TopicDetail} from '../../models/model';
import { CommunicationService } from "../../services/common/communication.service";
import {MenuService} from '../../services/menuservice/menu.service';
import {TopicService} from '../../services/topicservice/topic.service';
import {ParentComponent} from '../parent/parent.component';
import {Component, OnInit, EventEmitter, Output} from '@angular/core';

import {HttpModule} from '@angular/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [MenuService, TopicService]
})
export class SidenavComponent implements OnInit {

  gradeList: Grade[];
  selectedGradeSubject: GradeSubject;
  subscription: Subscription;
  topicList: Topic[];
  topicDetailList: TopicDetail[];
  topics: any[];
  @Output() displayBody = new EventEmitter();
  //@Output() changeScreen = new EventEmitter<string>();
  @Output() studentGrade = new EventEmitter<any>();

  constructor(
    private menuService: MenuService,
    private topicService: TopicService,
    private comService: CommunicationService,
  ) {  }

  ngOnInit() {

    this.initializeGrades();
  }

  initializeGrades(): void {

    this.menuService.getLeftMenu().subscribe(
      resultArray => {
        this.gradeList = resultArray;
        this.saveGradetoLocalStorage();
      },
      error => {
        console.log('Error :: ' + error)
      }
    )
  }

  openSubject(gradeId, subjectId): void {

    this.selectedGradeSubject = new GradeSubject();
    this.selectedGradeSubject.gradeId = gradeId;
    this.selectedGradeSubject.subjectId = subjectId;

    this.invokeSubmenu(this.selectedGradeSubject);
    this.studentGrade.emit(this.selectedGradeSubject.gradeId);

   // this.changeScreens.emit('<app-body></app-body>');

  }

  invokeSubmenu(gradeSubject: GradeSubject) {
    this.topicService.getSubMenu(gradeSubject).subscribe(
      resultArray => {
        this.topics = resultArray.topicList;
        this.populateTopicDetails();
      },
      error => {
        // TODO
      }
    )
  }

  populateTopicDetails() {

    this.topicList = [];

    for (let i = 0; i < this.topics.length; i++) {

      const topic: Topic = new Topic();

      topic.topicName = this.topics[i].topicName;
      topic.topicDetail = this.topics[i].topicDetail;

      this.topicList.push(topic);
    }
    // emit this to parent-component
    //this.changeScreen.emit('<app-body></app-body>');
    this.comService.changeCommScreen('<app-body></app-body>');
    this.displayBody.emit(this.topicList);
  }
  
  saveGradetoLocalStorage(){
    localStorage.setItem("gradeList", JSON.stringify(this.gradeList));
  }
}
