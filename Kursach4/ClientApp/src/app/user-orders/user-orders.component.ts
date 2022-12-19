import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { OrderModel } from '../interfaces/order-model';
import { UserForRegistration } from '../interfaces/user-for-registration';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styles: []
})
export class UserOrdersComponent implements OnInit {

  public orders: OrderModel[];
  public user: UserForRegistration;
  public BaseUrl: string;
  public sum:number;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.BaseUrl = baseUrl;
    this.reload()
    this.http.get<UserForRegistration>(this.BaseUrl + 'api/users/' + localStorage.getItem("userID"),).subscribe(result => {
      this.user = result;
    }, error => console.error(error));
  }
  onCloseOrder( id: number) {
    Swal.fire({
      title: 'Вы действительно хотите закрыть данный заказ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    }).then((result) =>{
      if (result.value)
      {
        this.http.post(this.BaseUrl + 'api/orders/close', id).subscribe(result => {
          Swal.fire('Успех', 'Ваш заказ закрыт', 'success');
        this.reload()

        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Ой...',
            text: 'Что-то пошло не так!'});
          console.error(error)});
      }}
    )   
    }

    reload ()
    {
      this.http.get<OrderModel[]>(this.BaseUrl + 'api/orders/active?Id=' + localStorage.getItem("userID"),).subscribe(result => {
        this.orders = result;
        this.sum = 0;
      this.orders.forEach(element => {
        this.sum += element.price;
      });
      }, error => console.error(error));
      
    }
  
  ngOnInit() {
  }

}
