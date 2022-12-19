import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { OrderModel } from '../interfaces/order-model';
import { UserForRegistration } from '../interfaces/user-for-registration';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styles: []
})

export class UserPageComponent implements OnInit {
  public orders: OrderModel[];
  public user: user;
  public BaseUrl: string;
  public img: string;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.BaseUrl = baseUrl;
    this.reload()
    this.http.get<user>(this.BaseUrl + 'api/users/' + localStorage.getItem("userID"),).subscribe(result => {
      this.user = result;
      const reader = new FileReader();
      var byteArray;
      const preview = document.getElementById('preview') as HTMLImageElement | null;
      reader.addEventListener("loadend", function () {
        preview.src = reader.result as string;
        return reader.result;
      }, false);
    
        reader.readAsDataURL(this.b64toBlob(this.user.image));
    }, error => console.error(error));
    
  }
  onCloseOrder( id: number) {
    Swal.fire({
      title: 'Вы действительно хотите закрыть данный заказ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Да',
      cancelButtonText: 'Не'
    }).then((result) =>{
      if (result.value)
      {
        this.http.post(this.BaseUrl + 'api/orders/close', id).subscribe(result => {
          Swal.fire('Успех', 'Ваш заказ закрыт', 'success')
        this.reload()
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Ой...',
            text: 'Что-то пошло не так!'});
          console.error(error)});
      }}
    )}

    reload ()
    {
      this.http.get<OrderModel[]>(this.BaseUrl + 'api/orders/active?Id=' + localStorage.getItem("userID"),).subscribe(result => {
        this.orders = result;
      }, error => console.error(error));
      
    }
    
  ngOnInit() {
  }
  upload() {
    
    const input = document.querySelector('input[type=file]') as HTMLInputElement | null;
    const file = input.files[0]
    const fileData = new FormData()
    var ser : string;
    fileData.append('image', file, file.name)
    this.http.put(this.BaseUrl + 'api/users/' + localStorage.getItem("userID"), fileData).subscribe({
      next:
      (response) => {ser = response as string
        const preview = document.getElementById('preview') as HTMLImageElement | null;
        const reader = new FileReader();
        var byteArray;
        
        reader.addEventListener("loadend", function () {
          // convert image file to base64 string
    
    
          console.log('base64', reader.result);
          preview.src = reader.result as string;
          byteArray = convertDataURIToBinary(reader.result);
          console.log('byte array', byteArray);
          return reader.result;
          //reader.readAsDataURL(new Blob(byteArray));
        }, false);
      
        if (file) {
          reader.readAsDataURL(this.b64toBlob(ser));
        }
      }
  })

  
    
  }
  public b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

interface user
{
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  image: string;
}
