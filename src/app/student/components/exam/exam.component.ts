import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DoctorService } from 'src/app/doctor/services/doctor.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  id:any
  subject:any
  user:any
  total:number=0
  studentInfo:any
  showResult:boolean=false
  validExam:boolean=true
  userSubjects:any[]=[]
  constructor(private route:ActivatedRoute, private service:DoctorService, private tosatr:ToastrService, private auth:AuthService) {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getSubjects()
    this.getloggedInUser()

   }

  ngOnInit(): void {
  }

  getloggedInUser(){
    this.auth.getRole().subscribe(res=>{
      this.user = res
      this.getUserData()
    })
  }

  getUserData(){
    this.auth.getStudents(this.user.userId).subscribe((res:any)=>{
      this.studentInfo = res
      this.userSubjects = res?.subjects ? res?.subjects : []
      this.validateExam()
    })
  }

  getSubjects(){
    this.service.getsubject(this.id).subscribe(res =>{
      this.subject = res
    })
  }

  validateExam(){
    for (let x in this.userSubjects){
      if (this.userSubjects[x].id == this.id){
        this.total = this.userSubjects[x].degree
        this.validExam = false
        this.tosatr.warning("لقد أنجزت هذا الاختبار مسبقا")
      }
    }
  }

  delete(index:any){
    this.subject.questions.splice(index, 1)
    const model = {
      name:this.subject.name,
      questions:this.subject.questions
    }
    this.service.updateSubject(model, this.id).subscribe(res=>{
      this.tosatr.success("تم حذف السؤال بنجاح")
    })
  }

  getAnswer(event:any){
    let value = event.value,
    questionIndex = event.source.name;
    this.subject.questions[questionIndex].studentAnswer = value
    console.log(this.subject.questions)
  }

  getResult(){
    this.total = 0
    for(let x in this.subject.questions){
      if(this.subject.questions[x].studentAnswer == this.subject.questions[x].correctAnswer){
        this.total++
      }
    }
    this.showResult = true
    this.userSubjects.push({
      name:this.subject.name,
      id: this.id,
      degree: this.total
    })
    const model={
      username:this.studentInfo.username,
      email:this.studentInfo.email,
      password:this.studentInfo.password,
      subjects:this.userSubjects
    }
    this.auth.updateStudents(this.user.userId, model).subscribe(res =>{
      this.tosatr.success("تم تسجيل النتيجة بنجاح")
    })
  }


}
