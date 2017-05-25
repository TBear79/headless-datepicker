import { Component, OnInit, Input } from '@angular/core';
import { HeadlessDatepicker } from 'headless-datepicker'

@Component({
  selector: 'app-range-picker',
  templateUrl: './range-picker.component.html',
  styleUrls: ['./range-picker.component.css']
})
export class RangePickerComponent implements OnInit {

  @Input() startDate: Date
  @Input() endDate: Date

  public headlessDatepicker: HeadlessDatepicker.Calendar
  public model: HeadlessDatepicker.DateItem[]

  constructor() { }

  ngOnInit() {
    this.headlessDatepicker = new HeadlessDatepicker.Calendar()

    const currentDate = new Date()
    this.model = this.headlessDatepicker.getRange(this.startDate, this.endDate)
  }

}
