import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const primeNG = [
  ButtonModule,
  TableModule
]

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ...primeNG
  ],
  exports: [
    ...primeNG
  ]
})
export class PrimeNGModule { }
