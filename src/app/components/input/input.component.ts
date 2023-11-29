import { Component, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { IonInput } from '@ionic/angular';
// https://angular.io/api/forms/ControlValueAccessor
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:InputComponent,
      multi:true
    }
  ]
})
export class InputComponent  implements ControlValueAccessor{
  @ViewChild('input') myInput: IonInput;
  @Input() label: string;
  @Input() name: string;
  @Input() ngModel: any;
  @Input() type: string = 'text';
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() pattern: string;
  showPass:boolean = true;
  focused: boolean = false;
  showError: boolean = false;
  error: string;
public onChange!: Function;
  constructor(){

  }
 
  onBlur(event: any) {
 
    this.focused = false;
    this.showError = false;
    this.error = '';
    this.ngModel = event.target.value;
    if(event.target.value.length > 0){
      this.focused = true;
    }
    if (this.required && !this.ngModel) {
      this.showError = true;
      this.error = 'This field is required';
    } else if (this.minLength && this.ngModel.length < this.minLength) {
      this.showError = true;
      this.error = `This field must be at least ${this.minLength} characters long`;
    } else if (this.maxLength && this.ngModel.length > this.maxLength) {
      this.showError = true;
      this.error = `This field must be no more than ${this.maxLength} characters long`;
    } else if (this.pattern && !new RegExp(this.pattern).test(this.ngModel)) {
      this.showError = true;
      this.error = 'This field is invalid';
    }
   
  }

  changeText($event:any):void{
    
this.onChange($event.target.value)
  }
  writeValue(value: any): void {
    if(value){
      this.focused = true;
    }else{
      this.focused = false;
    }
    this.ngModel  = value;
 
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
 
  }
}
