import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import Swal from 'sweetalert2';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './helpers/auth-guard';
import { RegisterUserComponent } from './register-user/register-user.component';

import { JwtInterceptor} from './helpers/jwt.interceptor';
import { UserPageComponent } from './user-page/user-page.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { AddParkingComponent } from './add-parking/add-parking.component';
import { AdminPageComponent } from './admin-page/admin-page.component'
import { AuthGuardAdminGuard } from './helpers/auth-guard-admin.guard';

export function tokenGetter() { 
  return localStorage.getItem("jwt"); 
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterUserComponent,
    UserPageComponent,
    UserOrdersComponent,
    CreateOrderComponent,
    AddParkingComponent,
    AdminPageComponent,
    
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    NumericTextBoxModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent},
      { path: 'register', component: RegisterUserComponent },
      { path: 'user-page', component: UserPageComponent,canActivate: [AuthGuard] },
      { path: 'user-orders', component: UserOrdersComponent,canActivate: [AuthGuard] },
      { path: 'create-order', component: CreateOrderComponent,canActivate: [AuthGuard] },
      { path: 'add-parking', component: AddParkingComponent,canActivate: [AuthGuardAdminGuard] },
      { path: 'admin-page', component: AdminPageComponent,canActivate: [AuthGuardAdminGuard] }
    ])
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
