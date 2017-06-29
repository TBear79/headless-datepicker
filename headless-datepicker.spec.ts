import { expect, assert } from 'chai'
import { HeadlessDatepicker } from './headless-datepicker'
import * as moment from 'moment'

describe('Headless datepicker', () => {
	let sut;

	beforeEach(() => {
		sut = new HeadlessDatepicker.Calendar()
	})

	describe('Initialization', () => {
		it('should be initialized', () => {
			expect(sut).not.to.be.null
		})

		it('should have default options set', () => {
			expect(sut.options.locale).to.equal('en')
			expect(sut.options.disabledDates).to.be.an('array')
			expect(sut.options.extras).to.be.an('array')
		})

		it('should override default options by setting options in contructor', () => {
			const dateFormat = 'DD/MM/YYYY'
			const minimumDate = new Date(2017, 1, 10)
			const maximumDate = new Date(2017, 1, 20)
			const disabledDates = [new Date(2017, 1, 14), new Date(2017, 1, 15)]
			sut = new HeadlessDatepicker.Calendar({
				minimumDate: minimumDate,
				maximumDate: maximumDate,
				disabledDates: disabledDates,
				zeroBasedMonth: true,
				calendarMode: 'exact'
			})

			expect(sut.options.minimumDate).to.deep.equal(minimumDate)
			expect(sut.options.maximumDate).to.deep.equal(maximumDate)
			expect(sut.options.disabledDates).to.deep.equal(disabledDates)
			expect(sut.options.zeroBasedMonth).to.be.true
			expect(sut.options.calendarMode).to.equal('exact')
		})

		it('should support multiple objects', () => {
			const date1 = new Date(2017, 3, 1)
			const date2 = new Date(2017, 4, 1)
			sut = new HeadlessDatepicker.Calendar({ minimumDate: date1 })
			const sut2 = new HeadlessDatepicker.Calendar({ minimumDate: date2 })

			expect(sut.options.minimumDate).to.deep.equal(date1)
			expect(sut2.options.minimumDate).to.deep.equal(date2)
		})

		it('should set zeroBasedMonth to true when not supplied', () => {
			expect(sut.options.zeroBasedMonth).to.be.false
		})

		it('should fill-mode to be default', () => {
			expect(sut.options.calendarMode).to.equal('fill')
		})
	})

	describe('Getting dates for a time span', () => {

		let startDate: Date;
		let endDate: Date;

		beforeEach(() => {
			startDate = new Date(2017, 2, 1)
			endDate = new Date(2017, 3, 30)
		})

		it('should have correct start and end date', () => {
			const dates = sut.getRange(startDate, endDate)

			expect(dates).to.be.an('array')
			expect(dates.length).to.equal(61)
			expect(dates[0].moment.toDate()).to.deep.equal(startDate)
			expect(dates[60].moment.toDate()).to.deep.equal(endDate)
		})

		it('should have todays date selected', () => {
			let today: moment.Moment = moment()
			startDate = moment().clone().subtract(10, 'days').toDate()
    		endDate = moment().clone().add(10, 'days').toDate()
			const dates = sut.getRange(startDate, endDate)

			const todayRange = dates.filter(d => d.isToday)

			expect(todayRange.length).to.equal(1)
			expect(todayRange[0].moment.isSame(today, 'day')).to.be.true
		})

		describe('Selected dates', () => {
			it('should have selected dates marked', () => {
				const testDates = [new Date(2017, 2, 2), new Date(2017, 2, 31), new Date(2017, 3, 29)]
				sut.selectedDates = testDates

				const dates = sut.getRange(startDate, endDate)

				expect(dates[1].isSelected).to.be.true
				expect(dates[30].isSelected).to.be.true
				expect(dates[59].isSelected).to.be.true
				expect(dates.filter((d) => d.isSelected == false).length).to.equal(58)
			})
		})

		describe('Minimum date', () => {
			const minimumDate = new Date(2017, 2, 10)
			let datepickerResult;

			beforeEach(() => {
				sut = new HeadlessDatepicker.Calendar({
					minimumDate: minimumDate
				})

				datepickerResult = sut.getRange(startDate, endDate)
			})

			it('should have minimum date and above marked as active', () => {
				datepickerResult.slice(9).forEach((item) => {
					assert.isFalse(item.isBelowMinimumDate, `Expected isBelowMinimumDate to be false for date ${item.date}`)
					assert.isTrue(item.isActive, `Expected active to be true for date ${item.date}`)
				})
			})

			it('should have dates below minimum marked as inactive', () => {
				datepickerResult.slice(0, 9).forEach((item) => {
					assert.isTrue(item.isBelowMinimumDate, `Expected isBelowMinimumDate to be true for date ${item.date}`)
					assert.isFalse(item.isActive, `Expected active to be false for date ${item.date}`)
				})
			})

		})

		describe('Maximum date', () => {
			const maximumDate = new Date(2017, 2, 10)
			let datepickerResult;

			beforeEach(() => {
				sut = new HeadlessDatepicker.Calendar({
					maximumDate: maximumDate
				})

				datepickerResult = sut.getRange(startDate, endDate)
			})

			it('should have maximum date and dates below marked as active', () => {
				datepickerResult.slice(0, 10).forEach((item) => {
					assert.isFalse(item.isAboveMaximumDate, `Expected isAboveMaximumDate to be false for date ${item.date}`)
					assert.isTrue(item.isActive, `Expected active to be true for date ${item.date}`)
				})
			})

			it('should have dates above maximum marked marked as inactive', () => {
				datepickerResult.slice(10).forEach((item) => {
					assert.isTrue(item.isAboveMaximumDate, `Expected isAboveMaximumDate to be true for date ${item.date}`)
					assert.isFalse(item.isActive, `Expected active to be false for date ${item.date}`)
				})
			})
		})


		it('should have disabled dates marked as inactive', () => {
			const disabledDates = [new Date(2017, 2, 5), new Date(2017, 2, 25), new Date(2017, 3, 15)]
			sut = new HeadlessDatepicker.Calendar({
				disabledDates: disabledDates
			})

			const dates = sut.getRange(startDate, endDate)

			expect(dates[4].moment.toDate()).to.deep.equal(disabledDates[0])
			expect(dates[24].moment.toDate()).to.deep.equal(disabledDates[1])
			expect(dates[45].moment.toDate()).to.deep.equal(disabledDates[2])

			dates.forEach((item, i) => {
				if (i == 4 || i == 24 || i == 45) {
					expect(item.isDisabled).to.true
					expect(item.isActive).to.false
					return
				}

				assert.isFalse(item.isDisabled, `Expected isDisabled to be false for date ${item.date}. Index (${i})`)
				assert.isTrue(item.isActive, `Expected isActive to be true for date ${item.date}. Index (${i})`)
			})
		})

		it('should return the additional information that was provided for specific dates', () => {
			const data1 = { holiday: 'Easter' }
			const data2 = 'The coolest thing'
			const data3 = [1, 2, 3]

			sut = new HeadlessDatepicker.Calendar({
				extras: [
					{ date: new Date(2017, 2, 10), data: data1 },
					{ date: new Date(2017, 2, 20), data: data2 },
					{ date: new Date(2017, 2, 30), data: data3 }
				]
			})

			const dates = sut.getRange(startDate, endDate)

			expect(dates[8].extras).to.be.null
			expect(dates[9].extras).to.deep.equal(data1)
			expect(dates[19].extras).to.equal(data2)
			expect(dates[29].extras).to.deep.equal(data3)
		})
	})

	describe('Getting dates in grid by months', () => {
		let yearMonthPair: HeadlessDatepicker.YearMonthPair
		let calendar;

		beforeEach(() => {
			yearMonthPair = {
				year: 2017,
				month: 4
			}
		})

		describe('"exact"-mode', function () {
			beforeEach(() => {
				sut = new HeadlessDatepicker.Calendar({ calendarMode: 'exact' })
				calendar = sut.getMonth(yearMonthPair)
			})

			it('should return the calendar as an object with dates divided into weeks', () => {
				expect(calendar.weeks.length).to.equal(6)
			})

			it('should return correct week day names in correct order', () => {
				expect(calendar.weekDayName.full).to.deep.equal(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
				expect(calendar.weekDayName.short).to.deep.equal(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
				expect(calendar.weekDayName.min).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
			})

			it('should respect zero based months', () => {
				sut = new HeadlessDatepicker.Calendar({ zeroBasedMonth: true, calendarMode: 'exact' })
				calendar = sut.getMonth(yearMonthPair)
				expect(calendar.monthName.number).to.equal(4)
				expect(calendar.weeks[0].dates[0].moment.format('MMMM')).to.equal('May')
				expect(calendar.monthName.full).to.equal('May')
				expect(calendar.monthName.short).to.equal('May')
			})

			it('should respect one based months', () => {
				expect(calendar.monthName.number).to.equal(4)
				expect(calendar.weeks[0].dates[0].moment.format('MMMM')).to.equal('April')
				expect(calendar.monthName.full).to.equal('April')
				expect(calendar.monthName.short).to.equal('Apr')
				
			})

			it('should return correct number of days for each week', function () {
				expect(calendar.weeks[0].dates.length).to.equal(1)
				expect(calendar.weeks[1].dates.length).to.equal(7)
				expect(calendar.weeks[2].dates.length).to.equal(7)
				expect(calendar.weeks[3].dates.length).to.equal(7)
				expect(calendar.weeks[4].dates.length).to.equal(7)
				expect(calendar.weeks[5].dates.length).to.equal(1)
			})

			it('should return correct week of year', () => {
				expect(calendar.weeks[0].weekOfYear).to.equal(13)
				expect(calendar.weeks[4].weekOfYear).to.equal(17)
			})

			it('should return correct week of month', () => {
				expect(calendar.weeks[0].weekOfMonth).to.equal(1)
				expect(calendar.weeks[4].weekOfMonth).to.equal(4)
			})
		})

		describe('"fill"-mode', function () {
			beforeEach(() => {
				sut = new HeadlessDatepicker.Calendar({ calendarMode: 'fill' })
				calendar = sut.getMonth(yearMonthPair)
			})

			it('should return 7 days in all weeks', () => {
				calendar.weeks.forEach(week => {
					assert.isTrue(week.dates.length == 7, `Expected week to have 7 days: ${week}`)
				})
			})

			it('should not show adjacent months', () => {
				const firstWeekDays = calendar.weeks[0].dates.slice(0, 6)
				const lastWeekDays = calendar.weeks[5].dates.slice(1)

				expect(firstWeekDays).to.deep.equal([null, null, null, null, null, null])
				expect(lastWeekDays).to.deep.equal([null, null, null, null, null, null])
			})
		})

		describe('"adjacent"-mode', function () {
			beforeEach(() => {
				sut = new HeadlessDatepicker.Calendar({ calendarMode: 'adjacent' })
				calendar = sut.getMonth(yearMonthPair)
			})

			it('should show previous adjacent month', () => {
				const days = calendar.weeks[0].dates.slice(0, 6).map(week => week.moment.format('YYYY-MM-DD'))

				expect(calendar.weeks[0].dates[6].moment.format('YYYY-MM-DD')).to.equal('2017-04-01')
				expect(days).to.deep.equal(['2017-03-26', '2017-03-27', '2017-03-28', '2017-03-29', '2017-03-30', '2017-03-31'])
			})

			it('should show next adjacent month', () => {
				const days = calendar.weeks[5].dates.slice(1).map(week => week.moment.format('YYYY-MM-DD'))

				expect(calendar.weeks[5].dates[0].moment.format('YYYY-MM-DD')).to.equal('2017-04-30')
				expect(days).to.deep.equal(['2017-05-01', '2017-05-02', '2017-05-03', '2017-05-04', '2017-05-05', '2017-05-06'])
			})
		})

		describe('"fixed"-mode', function () {
			beforeEach(() => {
				sut = new HeadlessDatepicker.Calendar({ calendarMode: 'fixed' })
				calendar = sut.getMonth(yearMonthPair)
			})

			it('should show 6 weeks for month with 5 weeks', () => {
				yearMonthPair.month = 3
				calendar = sut.getMonth(yearMonthPair)
				expect(calendar.weeks.slice(-1)[0].dates.map(item => item.moment.format('YYYY-MM-DD'))).to.deep.equal(['2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06', '2017-04-07', '2017-04-08'])
			})

			it('should show 6 weeks for month with 6 weeks', () => {
				expect(calendar.weeks.slice(-1)[0].dates.map(item => item.moment.format('YYYY-MM-DD'))).to.deep.equal(['2017-04-30', '2017-05-01', '2017-05-02', '2017-05-03', '2017-05-04', '2017-05-05', '2017-05-06'])
			})
		})
	})

	describe('Multiple grids', () => {
		let months;
		let calendars;

		beforeEach(() => {
			months = [{ year: 2017, month: 1 }, { year: 2017, month: 2 }, { year: 2017, month: 3 }, { year: 2018, month: 3 }]
			calendars = sut.getMonths(months)
		})

		it('should support multiple months', () => {
			expect(calendars.length).to.equal(4)
		})

		it('should return the correct number of days for all month. Including leap year', () => {
			months = [
				{ year: 2016, month: 2 },
				{ year: 2017, month: 1 },
				{ year: 2017, month: 2 },
				{ year: 2017, month: 3 },
				{ year: 2017, month: 4 },
				{ year: 2017, month: 5 },
				{ year: 2017, month: 6 },
				{ year: 2017, month: 7 },
				{ year: 2017, month: 8 },
				{ year: 2017, month: 9 },
				{ year: 2017, month: 10 },
				{ year: 2017, month: 11 },
				{ year: 2017, month: 12 }
			]

			sut = new HeadlessDatepicker.Calendar({ calendarMode: 'exact', zeroBasedMonth: false })
			calendars = sut.getMonths(months)

			expect(calendars[0].weeks.reduce(reduceFn).length).to.equal(29)
			expect(calendars[1].weeks.reduce(reduceFn).length).to.equal(31)
			expect(calendars[2].weeks.reduce(reduceFn).length).to.equal(28)
			expect(calendars[3].weeks.reduce(reduceFn).length).to.equal(31)
			expect(calendars[4].weeks.reduce(reduceFn).length).to.equal(30)
			expect(calendars[5].weeks.reduce(reduceFn).length).to.equal(31)
			expect(calendars[6].weeks.reduce(reduceFn).length).to.equal(30)
			expect(calendars[7].weeks.reduce(reduceFn).length).to.equal(31)
			expect(calendars[8].weeks.reduce(reduceFn).length).to.equal(31)
			expect(calendars[9].weeks.reduce(reduceFn).length).to.equal(30)
			expect(calendars[10].weeks.reduce(reduceFn).length).to.equal(31)
			expect(calendars[11].weeks.reduce(reduceFn).length).to.equal(30)
			expect(calendars[12].weeks.reduce(reduceFn).length).to.equal(31)
		})
	})

	describe('Localization', () => {
		it('should be able to set locale for moment', () => {
			let dates;


			dates = sut.getRange(new Date(), new Date())
			expect(dates[0].moment.fromNow()).to.equal('a few seconds ago')


			sut = new HeadlessDatepicker.Calendar({ locale: 'da', localeSettings: da })

			dates = sut.getRange(new Date(), new Date())
			expect(dates[0].moment.fromNow()).to.equal('få sekunder siden')
		})

		it('should respect first day in week, based on locale', () => {
			let dates;
			let calendar;
			let pair = { year: 2017, month: 3 }

			dates = sut.getRange(new Date(2017, 3, 1), new Date(2017, 3, 3))
			calendar = sut.getMonth(pair)
			expect(dates[0].moment.weekday()).to.equal(6)
			expect(dates[1].moment.weekday()).to.equal(0)
			expect(dates[2].moment.weekday()).to.equal(1)
			expect(calendar.weekDayName.min).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])

			sut = new HeadlessDatepicker.Calendar({ locale: 'da', localeSettings: da })

			dates = sut.getRange(new Date(2017, 3, 1), new Date(2017, 3, 3))
			calendar = sut.getMonth(pair)
			expect(dates[0].moment.weekday()).to.equal(5)
			expect(dates[1].moment.weekday()).to.equal(6)
			expect(dates[2].moment.weekday()).to.equal(0)
			expect(calendar.weekDayName.min).to.deep.equal(['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø'])
		})
	})

	describe('Bug fixes', () => {
		it('should return calendar for December 2018', () => {
			sut = new HeadlessDatepicker.Calendar({ calendarMode: 'exact' })
			const calendar = sut.getMonth({ year: 2018, month: 12 })

			expect(calendar).not.to.be.null
			expect(calendar.monthName.number).to.equal(12)
			expect(calendar.weeks[0].weekOfYear).to.equal(48)
			expect(calendar.weeks[0].weekOfMonth).to.equal(1)
			expect(calendar.weeks.reduce(reduceFn).length).to.equal(31)
		})
	})
})

const reduceFn = (a, b) =>  a.dates? a.dates.concat(b.dates) : a.concat(b.dates)

const da = {
	months: "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),
	monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
	weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
	weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split("_"),
	weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
	longDateFormat: {
		LT: "HH:mm",
		LTS: "HH:mm:ss",
		L: "DD/MM/YYYY",
		LL: "D. MMMM YYYY",
		LLL: "D. MMMM YYYY HH:mm",
		LLLL: "dddd [d.] D. MMMM YYYY [kl.] HH:mm"
	},
	calendar: {
		sameDay: "[i dag kl.] LT",
		nextDay: "[i morgen kl.] LT",
		nextWeek: "på dddd [kl.] LT",
		lastDay: "[i går kl.] LT",
		lastWeek: "[i] dddd[s kl.] LT",
		sameElse: "L"
	},
	relativeTime: {
		future: "om %s",
		past: "%s siden",
		s: "få sekunder",
		m: "et minut",
		mm: "%d minutter",
		h: "en time",
		hh: "%d timer",
		d: "en dag",
		dd: "%d dage",
		M: "en måned",
		MM: "%d måneder",
		y: "et år",
		yy: "%d år"
	},
	dayOfMonthOrdinalParse: /\d{1,2}\./,
	ordinal: "%d.",
	week: {
		dow: 1,
		doy: 4
	}
}