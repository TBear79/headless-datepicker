import { Component, OnInit, Input } from '@angular/core';
import { HeadlessDatepicker } from 'headless-datepicker'
import * as moment from 'moment'

@Component({
  selector: 'app-basic-calendar',
  templateUrl: './basic-calendar.component.html',
  styleUrls: ['./basic-calendar.component.css']
})
export class BasicCalendarComponent implements OnInit {
  calendar: HeadlessDatepicker.Calendar
    
  @Input() mode: HeadlessDatepicker.CalendarMode

  @Input() selectedDates: Date[] = []
  @Input() disabledDates: Date[] = []
  @Input() minimumDate: Date
  @Input() maximumDate: Date
  @Input() extras: HeadlessDatepicker.ExtraInfo[] = []

  model: HeadlessDatepicker.CalendarMonth

  constructor() { }

  ngOnInit() {
    this.calendar = new HeadlessDatepicker.Calendar({ calendarMode: this.mode, minimumDate: this.minimumDate, maximumDate: this.maximumDate, disabledDates: this.disabledDates, extras: this.extras })

    this.calendar.selectedDates = this.selectedDates

    const currentDate = new Date()
    this.model = this.calendar.getMonth({ year: currentDate.getFullYear(), month: currentDate.getMonth() })
  }

  selectDate(selectedDate: moment.Moment) {
      this.selectedDates.push(selectedDate.toDate()) 
  }

  previousMonth(year: number, month: number) {
    const momentDate = moment(new Date(year, month, 1))
    momentDate.subtract(1, 'month')
    this.model = this.calendar.getMonth({ year: momentDate.year(), month: momentDate.month() })
  }

  nextMonth(year: number, month: number) {
    const momentDate = moment(new Date(year, month, 1))
    momentDate.add(1, 'month')
    this.model = this.calendar.getMonth({ year: momentDate.year(), month: momentDate.month() })
  }

  formattedDates(dates: Date[]) {
    return dates.map(date => moment(date).format('YYYY-MM-DD')).toString() 
  }

}
