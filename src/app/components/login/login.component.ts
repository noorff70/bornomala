import { User, MessageReturned, Grade, LoggedUser} from "../../models/model";
import { CommunicationService } from "../../services/common/communication.service";
import { UsernameService } from "../../services/common/username.service";
import { LoginService } from "../../services/login/login.service";
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn, ReactiveFormsModule, FormsModule  } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  
  registerForm: FormGroup;
  user: User;
  loggedUser: LoggedUser;
  isUserRegistered: boolean = false;
  userName: string;
  userPassword: string= "";
  userNameRegister: string;
  userPasswordRegister: string
  userPasswordRegister1: string
  wantToRegister: boolean= false;
  msgRtn: MessageReturned;
  msg: string[];
  userType:string;
  userGradeList: Grade[];
  userPostalCode: string;
  
  update:boolean = false;
  userPasswordUpdate: string;
  userNameUpdate:string;
  updateGradeList: Grade[];
  userPostalCodeUpdate:string;
  update_userType:string;
  userCity: string;
  userProvince: string;

  constructor(private loginService: LoginService,
    private userService: UsernameService,
    private comService: CommunicationService) 
  {
    this.userGradeList=[]; 
    this.setlectTutorGrades();
   }

  ngOnInit() {
    
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    
    if (this.loggedUser !== null ) {
      this.userName = JSON.parse(this.loggedUser.username);
    }
    
    this.msgRtn= null;
    this.msg = [];
    //registration page will be hidden when user clicks on login from header component
    this.comService.changeLoginParameter.subscribe(status=>{
      this.update=false;
      this.wantToRegister= status;
      this.msg=[];
      this.updateGradeList=[];
    });
    
  }
  
  //user logs in
  userLogin() {
   
    this.msg = [];  
    this.msgRtn = new MessageReturned(); 
    this.user = new User();
    this.user.username = this.userName; //get from ui
    this.user.password = this.userPassword; // get value from ui
    
    this.validateLogin();

    //invoke rest service
    this.loginService.login(this.user).subscribe(
      loggedUser => {
        this.loggedUser = loggedUser;

        //if user found save to localstorage
        if (null !== this.loggedUser.username){
          this.msgRtn.msg= "Successfully Logged in";
          this.setMessageReturned ();
          this.isUserRegistered = true;
          this.saveToLocalStorage();
        }
        else {
          this.msg.push("User not exists in System")
        }

      },
      error => {
        // TODO
      }
    )
    
  }
   
  //saves/ registers new users
  userRegister(){
    
    this.msg= [];
    
    this.user = new User();
    this.user.username = this.userNameRegister; //get from ui
    this.user.password = this.userPasswordRegister; // get value from ui
    this.user.postalCode = this.userPostalCode;
    this.user.gradeUser = this.userGradeList;
    this.user.userRole = this.userType;
    
    if (this.userGradeList.length > 0) {
      for (let i = 0; i < this.userGradeList.length; i++) {
        if (this.userGradeList[i].selected !== true) {
          this.user.gradeUser.pop();
        }
      }
    }

   
    if (this.validateRegistrationInput()) {

        //this.passwordMismatch = null;
        this.msg = null;
        //invoke rest service
        this.loginService.registerUser(this.user).subscribe(
          register => {
            this.msgRtn = register;
            this.setMessageReturned();
            this.loggedUser = new LoggedUser();
            this.loggedUser.username = this.user.username;
            this.saveToLocalStorage();

          },
          error => {
            // TODO
          }
        )

    } else {
      //this.passwordMismatch = "Password mismatces. Please reenter your password.";
      //this.msg = "Password mismatches. Please reenter your password.";
    }


  }
  
  //save to local storage
  saveToLocalStorage() {
    
    let key = 'user';
    localStorage.setItem(key, JSON.stringify(this.loggedUser));
    this.userService.changeUserName(this.loggedUser.username);
  }
  
  
  //user wants to register
  newRegister() {
    this.msg=[];
    this.wantToRegister = true;
  }
  
  //set return value from RestfulAPI
  setMessageReturned (){
    this.msg = [];
    this.isUserRegistered = true;
    this.msg.push(this.msgRtn.msg);
  }
  
  validateRegistrationInput() {
    
    
    if (this.user.username === undefined || this.user.username.length === 0) {
      this.msg.push("User Name Missing") ;
    }
    if (this.user.userRole === undefined){
      this.msg.push("User Type Selection Missing") ;
    }
    if (this.user.password === undefined) {
      this.msg.push("User Password Missing") ;
    }
    if (this.user.postalCode === undefined || this.user.postalCode.length === 0) {
      this.msg.push("User Postal Code Missing") ;
    }
    if (null === this.user.gradeUser){
      this.msg.push("User Grade Selection Missing") ;
    }
    if (this.userPasswordRegister !== this.userPasswordRegister1) {
      this.msg.push("Password mismatch");
    }
    
    if (this.msg.length === 0){
      return true;
    } else {
      return false;
    }

  }
  
  validateLogin() {
    if (null === this.userName || this.userName.length === 0) {
      this.msg.push("User Name Missing") ;
    }
    if (null === this.userPassword || this.userPassword.length === 0){
      this.msg.push("User Password Missing") ;
    }
    
    if (this.msg.length === 0){
      return true;
    } else {
      return false;
    }
  }
  
  setlectTutorGrades() {
    this.userGradeList = JSON.parse(localStorage.getItem("gradeList"));
  }
  
  onToggle(id){
    for (let i=0; i < this.userGradeList.length; i++) {
      if (this.userGradeList[i].gradeId === id){
        let check = this.userGradeList[i].selected;
        this.userGradeList[i].selected = check;
        console.log();
      }

    }
  }
  
    onToggleUpdate(id){
    for (let i=0; i < this.updateGradeList.length; i++) {
      if (this.updateGradeList[i].gradeId === id){
        let check = this.updateGradeList[i].selected;
        this.updateGradeList[i].selected = !check;
      }

    }
  }
  
  updateUser(){
    this.wantToRegister= undefined;
    this.update = true;
    this.updateGradeList = JSON.parse(localStorage.getItem("gradeList"));
  }
  
  userUpdateBtn(){
     
    this.user = new User();
    this.user.password= this.userPasswordUpdate;
    this.user.username= this.userNameUpdate;
    this.user.postalCode= this.userPostalCodeUpdate;
    this.user.userRole= this.update_userType;
    this.user.gradeUser=this.userGradeList;
    
        //invoke rest service
    this.loginService.updateUser(this.user).subscribe(
      checkUser => {
        this.msgRtn = checkUser;
        this.setMessageReturned ();

        //if user found save to localstorage
          this.userService.changeUserName(this.user.username);
          //this.saveToLocalStorage();
      },
      error => {
        // TODO
      }
    )
    
  }
  
}
