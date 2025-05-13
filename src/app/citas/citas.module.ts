import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioCitasComponent } from './calendario-citas/calendario-citas.component';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FullCalendarModule,
    CalendarioCitasComponent
  ]
})
export class CitasModule { }
