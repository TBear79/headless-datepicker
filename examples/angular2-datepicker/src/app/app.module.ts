import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BasicCalendarComponent } from './basic-calendar/basic-calendar.component';
import { RangePickerComponent } from './range-picker/range-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    BasicCalendarComponent,
    RangePickerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
