import { Component, OnInit, Input } from '@angular/core';
import { HeadlessDatepicker } from 'headless-datepicker'
import * as moment from 'moment'

@Component({
  selector: 'app-basic-calendar',
  templateUrl: './basic-calendar.component.html',
  styleUrls: ['./basic-calendar.component.css']
})
export class BasicCalendarComponent implements OnInit {
  headlessDatepicker: HeadlessDatepicker.Calendar
  selectedDate: string
  
  @Input() mode: HeadlessDatepicker.CalendarMode

  model: HeadlessDatepicker.CalendarMonth

  constructor() { }

  ngOnInit() {
    this.headlessDatepicker = new HeadlessDatepicker.Calendar()

    const currentDate = new Date()
    this.model = this.headlessDatepicker.getMonth(currentDate.getFullYear(), currentDate.getMonth(), this.mode)
  }

  selectDate(date: string) {
      this.selectedDate = date
  }

  previousMonth(year: number, month: number) {
    const momentDate = moment(new Date(year, month, 1))
    momentDate.subtract(1, 'month')
    this.model = this.headlessDatepicker.getMonth(momentDate.year(), momentDate.month(), this.mode)
  }

  nextMonth(year: number, month: number) {
    const momentDate = moment(new Date(year, month, 1))
    momentDate.add(1, 'month')
    this.model = this.headlessDatepicker.getMonth(momentDate.year(), momentDate.month(), this.mode)
  }

}
