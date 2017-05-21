import { Component, OnInit } from '@angular/core';
import { HeadlessDatepicker, HdpMonth } from '../../../../headless-datepicker'
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  headlessDatepicker: HeadlessDatepicker
  selectedDate: string
  
  model: HdpMonth

  ngOnInit(): void {
    this.headlessDatepicker = new HeadlessDatepicker()

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

