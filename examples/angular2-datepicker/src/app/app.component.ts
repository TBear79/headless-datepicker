import { Component, OnInit } from '@angular/core';
import { HeadlessDatepicker } from '../../../../headless-datepicker'
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  startDate: Date
  endDate: Date

  selectedDates: Date[]

  minimumDate: Date
  maximumDate: Date

  disabledDates: Date[]

  extras: HeadlessDatepicker.ExtraInfo[] = []

  ngOnInit(): void {
    this.startDate = moment().subtract(10, 'days').toDate()
    this.endDate = moment().add(10, 'days').toDate()
    this.selectedDates = [
      moment().subtract(5, 'days').toDate(),
      moment().add(6, 'days').toDate(),
      moment().add(5, 'days').toDate()
    ]

    this.minimumDate = moment().subtract(5, 'days').toDate()
    this.maximumDate = moment().add(5, 'days').toDate()

    this.disabledDates = [
      moment().subtract(5, 'days').toDate(),
      moment().subtract(2, 'days').toDate(),
      moment().add(1, 'day').toDate(),
      moment().add(7, 'days').toDate()
    ]

    this.extras = [
      { 
        date: moment().subtract(3, 'days').toDate(),
        data: 'Family picnic'
      },
      {
        date: moment().add(4, 'days').toDate(),
        data: 'My favorite day of the year'
      }
    ]
  }
}

