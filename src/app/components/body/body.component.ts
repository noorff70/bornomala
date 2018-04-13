import {Common} from '../../common/Common';
import {GradeSubject, Topic, TopicDetail} from '../../models/model';
import {CommunicationService} from '../../services/common/communication.service';
import {ParentComponent} from '../parent/parent.component';
import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
  providers: [CommunicationService]
})
export class BodyComponent implements OnInit {

  gradeSubject: any;
  private subscriber: Subscription;
  @Input() childTopicList: Topic[];
  @Output() changeScreen = new EventEmitter<string>();
  @Output() topicDetail = new EventEmitter<TopicDetail>(); // child to Parent
  tDetail: TopicDetail;

  constructor(private comService: CommunicationService) {
  }

  ngOnInit() {
  }

  openMathDetail(name, id) {

    this.tDetail = new TopicDetail();
    this.tDetail.topicDetailsId = id;
    this.tDetail.topicDetailName = name;

    this.changeScreen.emit('<app-mathdetail></app-mathdetail>');

    this.topicDetail.emit(this.tDetail);
  }


}
