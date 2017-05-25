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
  }
}

