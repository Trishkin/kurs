import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { OrderModel } from '../interfaces/order-model';
import { Parking } from '../interfaces/parking';
import { Slot } from '../interfaces/slot';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styles: []
})
export class CreateOrderComponent implements OnInit {
  public ascDesc:boolean = true;
  private url: string;
  @Output() public address: string = '';
  public orderForm: FormGroup;
  public parkings: Parking[];
  public slots: Slot[];
  public freeSlots: number[];
  public parkingSlots: Slot[];
  constructor(private http: HttpClient,@Inject('BASE_URL') baseUrl: string,private fb: FormBuilder) {
    this.url = baseUrl;
    this.reload();
    this.orderForm = this.createSignupForm();
  }
  reload()
  {
    this.http.get<Parking[]>(this.url + 'api/parkings',).subscribe(result => {
      this.parkings = result;
      this.http.get<Slot[]>(this.url + 'api/slots',).subscribe(result => {
        this.slots = result;
        this.countSlots();
        
      }, error => console.error(error));
    }, error => console.error(error));
  }
  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        countHours: [
          1,
          Validators.compose([Validators.min(0), Validators.max(24), Validators.required] )
        ],
        countDays: [
          0,
          Validators.compose([Validators.min(0), Validators.required])
        ],
        parkingAddress: [
          this.address,
          Validators.required
        ]
      },
      {
        // check whether our password and confirm password match
        //validator: CustomValidators.passwordMatchValidator
      }
    );
  }
  public validateControl = (controlName: string) => {
    return this.orderForm.get(controlName).invalid && this.orderForm.get(controlName).touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.orderForm.get(controlName).hasError(errorName)
  }
  countSlots()
  {
    this.parkings.forEach(element => {
      element.numberOfSlots = this.slots.filter(a => a.parkingId == element.id).length
      element.freeSlots = this.slots.filter(a => a.parkingId == element.id).filter(a => a.isOccupied == false).length
    });
  }
  selectedParking(Id: number)
  {
    this.address = this.parkings.find(a => a.id == Id).address
    this.orderForm.controls["parkingAddress"].setValue(this.address)
    this.orderForm.updateValueAndValidity()
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
  sortByParkingFreeSlots()
  {
    if (this.ascDesc)
    {
      this.ascDesc = false;
      this.parkings.sort((a,b) => a.freeSlots - b.freeSlots)
    }
    else
    {
      this.ascDesc = true;
      this.parkings.sort((a,b) => b.freeSlots - a.freeSlots)
    }
  }

  sortByParkingNumberOfSlots()
  {
    if (this.ascDesc)
    {
      this.ascDesc = false;
      this.parkings.sort((a,b) => a.numberOfSlots - b.numberOfSlots)
    }
    else
    {
      this.ascDesc = true;
      this.parkings.sort((a,b) => b.numberOfSlots - a.numberOfSlots)
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

  ngOnInit() {
  }
  public createOrder = (orderFormValue) => {
    const formValues = { ...orderFormValue };

    var hours = formValues.countHours;
    var days = formValues.countDays;
    var address = this.address;

    var park = this.parkings.find(a => a.address == address);
    if ( park && park.freeSlots != 0)
    {
      if (hours + days ==0)
      {Swal.fire('Введите время')}
      else{
      var price = (park.priceHour * hours.toFixed(0)) + (park.priceDay * days.toFixed(0))
      Swal.fire({
        title: 'Вы уверены что хотите сделать это заказ?',
        html: 'Парковка=' + address + '<br>Дней=' + days.toFixed(0)
        + '<br>Часов=' + hours.toFixed(0) + '<br><b>Цена<b>=' + price.toFixed(2),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Да я уверен',
        cancelButtonText: 'Нет не хочу'
      }).then((result) =>{
      if (result.value)
      {
        this.http.post(this.url + 'api/orders/create', {parkingId:park.id, 
          userId:localStorage.getItem('userID'), days:days.toFixed(0), hours:hours.toFixed(0)})
          .subscribe(result => {
          Swal.fire('Успех', 'Ваше парковочное место ' + result, 'success')
            
            this.reload()
          
        },error => Swal.fire({
          icon: 'error',
          title: 'Ой...',
          text: 'Что-то пошло не так!'}));
      }
    })}
    }
    else{
      Swal.fire('Парковка не существует, либо не имеет свободных мест')
      
    }
  }
}
