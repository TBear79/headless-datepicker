import { Component, OnInit } from '@angular/core';
import { HeadlessDatepicker } from '../../../../../headless-datepicker'
import * as moment from 'moment'

@Component({
  selector: 'app-basic-calendar',
  templateUrl: './basic-calendar.component.html',
  styleUrls: ['./basic-calendar.component.css']
})
export class BasicCalendarComponent implements OnInit {
  headlessDatepicker: HeadlessDatepicker.Calendar
  selectedDate: string
  
  model: HeadlessDatepicker.CalendarMonth

  constructor() { }

  ngOnInit() {
    this.headlessDatepicker = new HeadlessDatepicker.Calendar()

    const currentDate = new Date()

    this.model = this.headlessDatepicker.getMonth(currentDate.getFullYear(), currentDate.getMonth())
  }

  selectDate(date: string) {
      this.selectedDate = date
  }

  previousMonth(year: number, month: number) {
    const momentDate = moment(new Date(year, month, 1))
    momentDate.subtract(1, 'month')
    this.model = this.headlessDatepicker.getMonth(momentDate.year(), momentDate.month())
  }

  nextMonth(year: number, month: number) {
    const momentDate = moment(new Date(year, month, 1))
    momentDate.add(1, 'month')
    this.model = this.headlessDatepicker.getMonth(momentDate.year(), momentDate.month())
  }

}
