# headless-datepicker
Provides the logic for a datepicker. Apply your own UI on top.

Provides the logic for creating a datepicker. No matter if you are preferring vanilla javascript, JQuery, Angular2, React or something else, you can easily make your own datepicker by applying headless-datepicker to provide the data.


* Easy to use and fast to implement
* Stable
* Very few dependencies
* Releaves you of the bore in programming your own datepicker logic

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
		var headlessDatepicker = new HeadlessDatepicker()
	</script>
```

## Returned objects

### DateItem

The methods getRange, getCalendar and getCalendars all returns the DateItem object, wrapped in arrays or CalendarMonth-object.

``` javascript
	{
	moment: moment.Moment, 	// moment instance of the day
        isActive: boolean,	// true when a date is not below minimumDate, above maximumDate or a disabledDate
        isToday: boolean,	// true when the day is todays date
        isSelected: boolean,	// true when the date is selected	
        isBelowMinimumDate: boolean,	// true when the date is below the minimum date
        isAboveMaximumDate: boolean,	// true when the date is above the maximumDate
        isDisabled: boolean,	// true when the date is disabled
        isAdjacent: boolean,	// true when date date belongs to a surrounding month
        extras: any	// Array of data you wish to attach to the dates
	}
```

### MonthCalendar

## Methods

### getRange

### getMonth

### getMonths

## Options

### locale

### localeSettings

### minimumDate

### maximumDate

### disabledDates

### extras

### calendarMode

### zeroBasedMonth

## Further reading

## Release notes

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


