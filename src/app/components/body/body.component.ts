import {Common} from '../../common/Common';
import {GradeSubject, Topic} from '../../models/model';
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

  constructor(private comService: CommunicationService) {
  }

  ngOnInit() {
  }

  openMathDetail() {
    this.changeScreen.emit('<app-mathdetail></app-mathdetail>');
  }


}
