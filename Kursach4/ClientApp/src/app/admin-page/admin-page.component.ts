import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { OrderModel } from '../interfaces/order-model';
import { UserForRegistration } from '../interfaces/user-for-registration';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styles: []
})
export class AdminPageComponent implements OnInit {
  public ascDesc: boolean = true;
  public parkings: Parking[];
  public users: User[];
  public orders: OrderModel[];
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Parking[]>(baseUrl + 'api/parkings',).subscribe(result => {
      this.parkings = result;
    }, error => console.error(error));
    http.get<User[]>(baseUrl + 'api/users',).subscribe(result => {
      this.users = result;
    }, error => console.error(error));
    http.get<OrderModel[]>(baseUrl + 'api/orders',).subscribe(result => {
      this.orders = result;
    }, error => console.error(error));
    
  }

  ngOnInit() {
  }
  sortByParkingId()
  {
    if (this.ascDesc)
    {
      this.ascDesc = false;
      this.parkings.sort((a,b) => a.id - b.id)
    }
    else
    {
      this.ascDesc = true;
      this.parkings.sort((a,b) => b.id - a.id)
    }
  }
  sortByParkingAddres()
  {
    if (this.ascDesc)
    {
      this.ascDesc = false;
      this.parkings.sort((a,b) => a.address.localeCompare(b.address))
    }
    else
    {
      this.ascDesc = true;
      this.parkings.sort((a,b) => b.address.localeCompare(a.address))
    }
  }

  sortByParkingPriceHour()
  {
    if (this.ascDesc)
    {
      this.ascDesc = false;
      this.parkings.sort((a,b) => a.priceHour - b.priceHour)
    }
    else
    {
      this.ascDesc = true;
      this.parkings.sort((a,b) => b.priceHour - a.priceHour)
    }
  }
  sortByParkingPriceDay()
  {
    if (this.ascDesc)
    {
      this.ascDesc = false;
      this.parkings.sort((a,b) => a.priceDay - b.priceDay)
    }
    else
    {
      this.ascDesc = true;
      this.parkings.sort((a,b) => b.priceDay - a.priceDay)
    }
  }
}

interface Parking {
  id: number;
  address: string;
  priceHour: number;
  priceDay: number;
}
interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}
