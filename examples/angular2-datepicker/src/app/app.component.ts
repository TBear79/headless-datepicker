import { Component, OnInit } from '@angular/core';
import { HeadlessDatepicker } from '../../../../headless-datepicker'
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  private startDate: Date
  private endDate: Date

  ngOnInit(): void {
    this.startDate = moment().subtract(10, 'days').toDate()
    this.endDate = moment().add(10, 'days').toDate()
  }
}

