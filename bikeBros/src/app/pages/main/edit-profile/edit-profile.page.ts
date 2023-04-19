import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {

  editForm: FormGroup;
  public profileUser:any;
  

  constructor(private auth:AuthService, public fb: FormBuilder,private router:Router) { 
    this.editForm = this.fb.group({
      'nick': new FormControl('',Validators.required),
      'email': new FormControl('',Validators.required),
      'password': new FormControl('', Validators.required),
      // 'confirmedPassword': new FormControl('', Validators.required),
      'age': new FormControl('', Validators.required),
      'description': new FormControl('',Validators.nullValidator),
      'imageURL': new FormControl('', Validators.required)


    })
  }

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: response => {
        console.log(response)
        // guardo el objeto entero en profileUser para poder mostrarlo en la vista
        this.profileUser = response;
        this.editForm.patchValue({
          id:this.profileUser.id,
          nick: this.profileUser.nick,
          email:this.profileUser.email,
          age: this.profileUser.age,
          description: this.profileUser.description,
          imageURL: this.profileUser.imageURL

        })
      },

      error: err => {
        console.log(err)
      }
    })
  }

  editProfile(){
    
    const id = this.profileUser.id
    const nick = this.editForm.controls['nick'].value;
    const email = this.editForm.get('email')?.value
    const age = this.editForm.get('age')?.value;
    const description = this.editForm.get('description')?.value;
    const imageURL = this.editForm.get('imageURL')?.value;

    this.auth.editUserProfile(id, nick, email,age, description, imageURL).subscribe({
      
      next:res =>{
        // console.log(res)
        // this.router.navigate(['/profile'], {replaceUrl:true});
        // this.auth.loginUser(nick, password);
        // De esta forma forzamos a que la página recarge y aparezcan refrescados los datos del perfil
        this.router.navigateByUrl('main/profile', { skipLocationChange: false}).then(() => {
          this.router.navigate(['main/profile']);
        });
      },
      
      error:err =>{console.error(err)}
      
    })
  }
}
