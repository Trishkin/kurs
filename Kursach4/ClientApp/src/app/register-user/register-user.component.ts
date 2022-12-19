import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserForRegistration } from '../interfaces/user-for-registration';
import { AuthenticationService } from '../helpers/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { CustomValidators } from '../helpers/custom-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent  {
  invalidRegister: boolean;
  registerForm: FormGroup;

  constructor(private authService: AuthenticationService, private fb: FormBuilder,private router: Router) {
    this.registerForm = this.createSignupForm();
   }

  // ngOnInit(): void {
  //   this.registerForm = new FormGroup({
  //     firstName: new FormControl(''),
  //     lastName: new FormControl(''),
  //     email: new FormControl('', [Validators.required, Validators.email]),
  //     password: new FormControl('', [Validators.required]),
  //     confirm: new FormControl('', Validators.compose([Validators.required]))
  //   }
  //   );
  // }

  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8)
          ])
        ],
        confirm: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  public validateControl = (controlName: string) => {
    return this.registerForm.get(controlName).invalid && this.registerForm.get(controlName).touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName).hasError(errorName)
  }

  public registerUser = (registerFormValue) => {
    const formValues = { ...registerFormValue };

    const user: UserForRegistration = {
      firstname: formValues.firstName,
      lastname: formValues.lastName,
      email: formValues.email,
      password: formValues.password
    };

    this.authService.registerUser("api/users/registration", user)      
    .subscribe({
      next: (_) => {console.log("Successful registration")
      this.router.navigate(["login"]);
    },
      error: (err: HttpErrorResponse) => {console.log(err.error.errors),
        this.invalidRegister = true}
    })
  }
}