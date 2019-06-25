import { User, MessageReturned, Grade} from "../../models/model";
import { CommunicationService } from "../../services/common/communication.service";
import { UsernameService } from "../../services/common/username.service";
import { LoginService } from "../../services/login/login.service";
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  
  user: User;
  isUserRegistered: boolean = false;
  userName: string;
  userPassword: string;
  userNameRegister: string;
  userPasswordRegister: string
  userPasswordRegister1: string
  wantToRegister: boolean= false;
  msgRtn: MessageReturned;
  msg: string;
  userType:string;
  tutorGradeList: Grade[];
  userPostalCode: string;
 

  constructor(private loginService: LoginService,
    private userService: UsernameService,
    private comService: CommunicationService) 
  {
    this.tutorGradeList=[]; 
    this.setlectTutorGrades();
   }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.msgRtn= null;
    this.msg = null;
    //registration page will be hidden when user clicks on login from header component
    this.comService.changeLoginParameter.subscribe(status=>{
      this.wantToRegister= status;
    });
    
  }
  
  //user logs in
  userLogin() {
        
    this.user = new User();
    this.user.username = this.userName; //get from ui
    this.user.password = this.userPassword; // get value from ui

    //invoke rest service
    this.loginService.login(this.user).subscribe(
      checkUser => {
        this.msgRtn = checkUser;
        this.setMessageReturned ();

        //if user found save to localstorage
        if (this.isUserRegistered  === true){
          this.saveToLocalStorage();
        }

      },
      error => {
        // TODO
      }
    )
    
  }
   
  //saves/ registers new users
  userRegister(){
    
    this.validateRegistrationInput();
    
    this.user = new User();
    this.user.username = this.userNameRegister; //get from ui
    this.user.password = this.userPasswordRegister; // get value from ui
    this.user.userPostalCode = this.userPostalCode;
    this.user.gradeTutor = this.tutorGradeList;
    this.user.userRole = this.userType;

    

    if (this.userPasswordRegister === this.userPasswordRegister1) {

        //this.passwordMismatch = null;
        this.msg = null;
        //invoke rest service
        this.loginService.registerUser(this.user).subscribe(
          register => {
            this.msgRtn = register;
            this.setMessageReturned();

            //if user found save to localstorage
            if (this.isUserRegistered === true) {
              this.saveToLocalStorage();
            }


          },
          error => {
            // TODO
          }
        )

    } else {
      //this.passwordMismatch = "Password mismatces. Please reenter your password.";
      this.msg = "Password mismatches. Please reenter your password.";
    }


  }
  
  //save to local storage
  saveToLocalStorage() {
    let key = 'userName';
    localStorage.setItem(key, this.userName);
    //show username to UI
    this.userService.changeUserName(this.userName);
  }
  
  saveToLocalStorageRegister() {
    let key = 'userName';
    localStorage.setItem(key, this.userNameRegister);
    //show username to UI
    this.userService.changeUserName(this.userNameRegister);
  }
  
  //user wants to register
  newRegister() {
    this.wantToRegister = true;
  }
  
  //set return value from RestfulAPI
  setMessageReturned (){
    this.isUserRegistered = this.msgRtn.success;
    this.msg = this.msgRtn.msg;
  }
  
  validateRegistrationInput() {
    if (this.userNameRegister === undefined) {
      this.msg= "Mandatory Input Data Missing";
      return;
    }
  }
  
  setlectTutorGrades() {
    this.tutorGradeList = JSON.parse(localStorage.getItem("gradeList"));
  }
  
  onToggle(id){
    for (let i=0; i < this.tutorGradeList.length; i++) {
      if (this.tutorGradeList[i].gradeId === id){
        let check = this.tutorGradeList[i].selected;
        this.tutorGradeList[i].selected = !check;
      }

    }
  }
  
}
