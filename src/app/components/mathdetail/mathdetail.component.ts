import { TopicDetail } from '../../models/model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mathdetail',
  templateUrl: './mathdetail.component.html',
  styleUrls: ['./mathdetail.component.css']
})
export class MathdetailComponent implements OnInit {

  @Input() childTopic: TopicDetail;

  constructor() { }

  ngOnInit() {
  }

}
