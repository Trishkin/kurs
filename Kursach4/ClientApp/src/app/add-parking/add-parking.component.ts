import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Parking } from '../interfaces/parking';

@Component({
  selector: 'app-add-parking',
  templateUrl: './add-parking.component.html',
  styles: []
})
export class AddParkingComponent implements OnInit {
  public ascDesc: boolean = true;
  public orderForm: FormGroup;
  public parkings: Parking[];
  public url: string;

  constructor(public http: HttpClient, @Inject('BASE_URL') baseUrl: string,private fb: FormBuilder) {
    this.url = baseUrl;
    this.reload();
    this.orderForm = this.createSignupForm();
  }
  reload()
  {
    this.http.get<Parking[]>(this.url + 'api/parkings',).subscribe(result => {
      this.parkings = result;
    }, error => console.error(error));
  }
  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        countHours: [
          1,
          Validators.compose([Validators.min(0), Validators.required] )
        ],
        countDays: [
          0,
          Validators.compose([Validators.min(0), Validators.required])
        ],
        parkingAddress: [
          '',
          Validators.required
        ],
        countSlots: [
          0,
          Validators.compose([Validators.min(0), Validators.required])
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


  public createParking = (orderFormValue) => {
    const formValues = { ...orderFormValue };

    var hours = formValues.countHours;
    var days = formValues.countDays;
    var address = formValues.parkingAddress;
    var slots = formValues.countSlots;

    var park = this.parkings.find(a => a.address == address)
      if (park)
      {
        Swal.fire({
          icon: 'error',
          title: 'Парковка существует',
          text: 'Данный адресс парковки уже сужествует'})
      }
      else{
      Swal.fire({
        title: 'Вы действительно хотите добавить парковку?',
        text: '\nПарковка=' + address + '\n Цена за день=' + days.toFixed(2)
        + '\n Цена за час=' + hours.toFixed(2) + '\n Количество мест=' + slots.toFixed(0),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Да создать',
        cancelButtonText: 'Нет'
      }).then((result) =>{
      if (result.value)
      {
        this.http.post(this.url + 'api/parkings/create', {address:address, 
          priceHour:hours.toFixed(2), 
          priceDay:days.toFixed(2),
          slots:slots.toFixed(0)})
          .subscribe(result => {
          Swal.fire('Success', 'Парковка успешно добавлена', 'success')
            
            this.reload()
          
        },error => Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Что-то пошло не так!'}));
      }
    })
  }
  }
}

