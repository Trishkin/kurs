import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  public user = '';

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }


  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("jwt");
    if (token){
      this.user = localStorage.getItem("user");
      return true;
    }
    return false;
  }

  isAdmin = (): boolean => {
    const token = localStorage.getItem("jwt");
    const role = localStorage.getItem("role")
    if (token && role == "Admin"){
      this.user = localStorage.getItem("user");
      return true;
    }
    return false;
  }

  public logOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("userID");
    localStorage.removeItem("role");
    this.user = '';
  }
}
