# headless-datepicker
Provides the logic for a datepicker. Apply your own UI on top.

Provides the logic for creating a datepicker. No matter if you are preferring vanilla javascript, JQuery, Angular2, React or something else, you can easily make your own datepicker by applying headless-datepicker to provide the data.


* Easy to use and fast to implement
* Releaves you of the bore in programming your own datepicker logic
* Relies on [moment.js](https://momentjs.com/)

## Installation

### ES6 / Typescript

Use [npm](https://www.npmjs.com/) to install the module:

```
	npm install headless-datepicker
```

Then use it like this
``` javascript
	import { HeadlessDatepicker } from 'headless-datepicker'
```

### Vanilla

``` html
	<script type="javascript" src="headless-datepicker.js"></script>

	<script>
		// You must install momentjs in order to use headless-datepicker
		// It seems like you have to use require.js or similar to use moment.js
		var calendar = new HeadlessDatepicker.Calendar()
	</script>
```

## Methods

### getRange

Returns an array of DateItems within a given date-span.

``` javascript
	var startDate = new Date(2017, 2, 15)
	var endDate = new Date(2017, 2, 30)

	var calendar = new HeadlessDatepicker.Calendar()

	var range = calendar.getRange(startDate, endDate)

	// range contains an array of DateItems from startDate to endDate.
	// Both dates inclusive
```

### getMonth

``` javascript
	var calendar = new HeadlessDatepicker.Calendar()

	var calendarMonth = calendar.getMonth({ year: 2017, month: 3})

	// calendarMonth contains an array of WeekItem objects
```

### getMonths

``` javascript
	var calendar = new HeadlessDatepicker.Calendar()

	var calendarMonths = calendar.getMonths([{ year: 2017, month: 3}, { year: 2017, month: 4}, { year: 2018, month: 1}])

	// calendarMonths contains an array of MonthItem objects
```

## Returned objects

### DateItem

The methods getRange and getCalendar both returns the DateItem object, wrapped in array or WeekItem-objects.

``` javascript
{
	moment: Moment, 	// moment instance of the day
	isActive: boolean,	// true when a date is not below minimumDate, above maximumDate or a disabledDate
	isToday: boolean,	// true when the day is todays date
	isSelected: boolean,	// true when the date is selected	
	isBelowMinimumDate: boolean,	// true when the date is below the minimum date
	isAboveMaximumDate: boolean,	// true when the date is above the maximumDate
	isDisabled: boolean,	// true when the date is disabled
	isAdjacent: boolean,	// true when date date belongs to a surrounding month
	extras: any		// any additional data that you have attached to a specific date
}
```
### WeekItem

Returned from getCalendar in an array

``` javascript
{
	weekOfYear: number,
	weekOfMonth: number,
	dates: DateItem[]
}
	
```

### MonthItem

The methods getCalendar and getCalendars both returns the MonthItem object. 

``` javascript
{
	weekDayInfo: WeekDayInfo // Use this to display week day names.
	year: number // The year that the month belongs to
	number: number	// The month number of the year
	monthName: MonthName // Use this to display the name of the month and the month number
	weeks: DateItem[][] // DateItems in array for each week.
}
```

### WeekDayInfo

The week day names presented in different forms. The object is localized from the moment locale.

``` javascript
{ 
	full: string[] 		// Sunday, Monday, Tuesday etc.
	short: string[] 	// Sun, Mon, Tues etc.
	min: string[]  		// S, M, T etc. 
}
```

### MonthName

``` javascript
{
	full: string	// January, February, March etc.
	short: string	// Jan, Feb, Mar etc.
}
```


## Options

Options can be on initialization or at any point afterwards

### locale

Default: 'en'

Type: String

Locale to be used locally for the moment object. [Locales in moment.js](https://momentjs.com/docs/#/i18n/)

### localeSettings

Default: -

Type: Any

Locale settings to be used locally for the moment object. Also use this to determine the first day of the week. By default the week start on sunday. [Locales in moment.js](https://momentjs.com/docs/#/i18n/)


### minimumDate
Default: -

Type: Date

DateItems with date before minimumDate will have isBelowMinimumDate set to true

### maximumDate
Default: -

Type: Date

DateItems with date after maximumDate will have isAboveMaximumDate set to true

### disabledDates
Default: []

Type: Date[]

DateItems with dates equal to dates in the disabledDates array will have isDisabled set to true

### extras
Default: -

Type: ExtraInfo

DateItems with dates equal to the date in ExtraInfo will get the data attached to the extras property

``` javascript
{
	date: Date, // The date that the extra data should be attached to
	data: any   // Any data you wish to attach
}
```

### calendarMode
Default: 'fill'

Type: 'exact' | 'adjacent' | 'fill' | 'fixed'

Defines the returned mode of the calendar. See the calendar modes section of this documentation.


### zeroBasedMonth
Default: false

Type: Boolean

Determines if the month that is provided to getMonth is zero based. It also affects the number-property in MonthItem.


## Calendar modes

As an example we use April 2017. 
Asuming we use the Javascript default, then the first week starts Sunday the 2 and the last week ends Friday the 30. This can be adjusted by setting locales for moment.js.

### exact-mode

Doesn't return entries for dates of the adjecent months. This means that the returned dates in the WeekInfo object look like this:

||||||||
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|1|
|2|3|4|5|6|7|8|
|9|10|11|12|13|14|15|
|16|17|18|19|20|21|22|
|23|24|25|26|27|28|29|
|30|

It doesn't make sence to have week day names on the top, because the first week only have one day entry


### adjacent-mode

Puts dates of the adjacent months into the first and the last week of the array

|Sunday|Monday|Tueday|Wednesday|Thursday|Friday|Saturday|
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|26|27|28|29|30|31|1|
|2|3|4|5|6|7|8|
|9|10|11|12|13|14|15|
|16|17|18|19|20|21|22|
|23|24|25|26|27|28|29|
|30|1|2|3|4|5|6|

### fill-mode

Fills empty (null) entries into the array for first and last week. This is the default mode.

|Sunday|Monday|Tueday|Wednesday|Thursday|Friday|Saturday|
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|||||||1|
|2|3|4|5|6|7|8|
|9|10|11|12|13|14|15|
|16|17|18|19|20|21|22|
|23|24|25|26|27|28|29|
|30|||||||

### fixed-mode

Like adjecent mode but it always returns 6 weeks. Kind of silly, but it's just like the calendar in Windows 10 :-)

|Sunday|Monday|Tueday|Wednesday|Thursday|Friday|Saturday|
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|26|27|28|29|30|31|1|
|2|3|4|5|6|7|8|
|9|10|11|12|13|14|15|
|16|17|18|19|20|21|22|
|23|24|25|26|27|28|29|
|30|1|2|3|4|5|6|
|7|8|9|10|11|12|13|

## Further reading

[momentjs](https://momentjs.com/)

## Release notes

1.0.0 Genesis

# License

The MIT License (MIT)

Copyright (c) 2016 Thorbjørn Gliese Jelgren (The Right Foot, www.therightfoot.dk)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


