import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private service:AuthService) { }

  user:any = null;
  ngOnInit(): void {
    this.service.user.subscribe((res:any) =>{
      if(res.role){
        this.user =res;
      }
        })

  }

  logOut(){
    const model ={}
    this.user = null;
    this.service.login(model).subscribe(res =>{
      this.service.user.next(res);
    })
  }
}
