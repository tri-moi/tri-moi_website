import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//This modules is used to create the global functions

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class GlobalFunctionsModule { }

//check if user is logged in
export function getLoggedIn(){
  const isLoggedIn = JSON.parse(localStorage.getItem("user") ?? "{}").isLoggedIn
  if (isLoggedIn === true && localStorage.getItem('user')) {
    return true
  } else {
    return false
  }
}
export function getCurrentUser(){
  if (getLoggedIn()) {
    return JSON.parse(localStorage.getItem('user')||'')
  } else {
    return 'error'
  }
}
