import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationService } from "../../services/common/communication.service";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    public router: Router,
    private comService: CommunicationService) { }

  ngOnInit() {
  }
  
  contactUs() {
    this.comService.changeCommScreen('<app-contactus></app-contactus>');
    //this.router.navigate(['./contactus']);
  }
  

}
