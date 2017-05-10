var moment = require('moment')
var chai = require('chai')
var assert = chai.assert
var expect = chai.expect

var HeadlessDatepicker = require('./headless-datepicker')

describe('Headless datepicker', () => {
	var sut;

	beforeEach(() => {
		sut = new HeadlessDatepicker()
	})

	describe('Initialization', () => {
		it('should be initialized', () => {
			expect(sut).not.to.be.null
		})

		it('should have default options set', () => {
			expect(sut.minimumDate).to.be.null
			expect(sut.maximumDate).to.be.null
			expect(sut.disabledDates).to.be.an('array')
		})

		it('should override default options by setting options in contructor', () => {
			var dateFormat = 'DD/MM/YYYY'
			var minimumDate = new Date(2017, 1, 10)
			var maximumDate = new Date(2017, 1, 20)
			var disabledDates = [new Date(2017, 1, 14), new Date(2017, 1, 15)]
			sut = new HeadlessDatepicker({
				zeroBased: false,
				minimumDate: minimumDate,
				maximumDate: maximumDate,
				disabledDates: disabledDates
			})

			expect(sut.minimumDate).to.deep.equal(minimumDate)
			expect(sut.maximumDate).to.deep.equal(maximumDate)
			expect(sut.disabledDates).to.deep.equal(disabledDates)
		})

		it('should support multiple objects', () => {
			var date1 = new Date(2017, 3, 1)
			var date2 = new Date(2017, 4, 1)
			sut = new HeadlessDatepicker({ minimumDate: date1 })
			var sut2 = new HeadlessDatepicker({ minimumDate: date2 })

			expect(sut.minimumDate).to.deep.equal(date1)
			expect(sut2.minimumDate).to.deep.equal(date2)
		})

		it('should not pollute the global namespace', () => {
			expect(() => { zeroBased }).to.throw()
		})
	})

	describe('Setting and getting dates', () => {
		it('should get selected date after setting a selected date', () => {
			var testDate = new Date(2017, 5, 15)
			sut.setSelectedDate(testDate)
			var selectedDate = sut.getSelectedDate()

			expect(selectedDate).not.to.be.null
			expect(selectedDate.moment.toDate()).to.deep.equal(testDate)
		})

		it('should get array of selected dates after setting multiple dates', () => {
			var testDates = [new Date(2017, 5, 15), new Date(2017, 5, 16), new Date(2017, 5, 17)]
			sut.setSelectedDates(testDates)
			var selectedDates = sut.getSelectedDates()

			expect(selectedDates).not.to.be.null
			expect(selectedDates).to.be.an('array')
			expect(selectedDates.length).to.equal(3)
			expect(selectedDates.map((s) => { return s.moment.toDate() })).to.deep.equal(testDates)
		})

		it('should return latest selected date in getDate after setting multiple dates', () => {
			var lastDate = new Date(2017, 5, 17)
			var testDates = [new Date(2017, 5, 15), new Date(2017, 5, 16), lastDate]
			sut.setSelectedDates(testDates)
			var selectedDate = sut.getSelectedDate()

			expect(selectedDate).not.to.be.null
			expect(selectedDate.moment.toDate()).to.deep.equal(lastDate)
		})
	})

	describe('Getting dates for a time span', () => {

		var startDate;
		var endDate;

		beforeEach(() => {
			startDate = new Date(2017, 2, 1)
			endDate = new Date(2017, 3, 30)
		})

		it('should have correct start and end date', () => {
			var dates = sut.getRange(startDate, endDate)

			expect(dates).to.be.an('array')
			expect(dates.length).to.equal(61)
			expect(dates[0].moment.toDate()).to.deep.equal(startDate)
			expect(dates[60].moment.toDate()).to.deep.equal(endDate)
		})

		describe('Selected dates', () => {
			it('should have selected dates marked', () => {
				var testDates = [new Date(2017, 2, 2), new Date(2017, 2, 31), new Date(2017, 3, 29)]
				sut.setSelectedDates(testDates)

				var dates = sut.getRange(startDate, endDate)

				expect(dates[1].isSelected).to.be.true
				expect(dates[30].isSelected).to.be.true
				expect(dates[59].isSelected).to.be.true
				expect(dates.filter((d) => d.isSelected == false).length).to.equal(58)
			})
		})

		describe('Minimum date', () => {
			var minimumDate = new Date(2017, 2, 10)
			var datepickerResult;

			beforeEach(() => {
				sut = new HeadlessDatepicker({
					minimumDate: minimumDate
				})

				datepickerResult = sut.getRange(startDate, endDate)
			})

			it('should have minimum date and above marked as active', () => {
				datepickerResult.slice(9).forEach((item) => {
					assert.isFalse(item.isMinimumDate, `Expected isMinimumDate to be false for date ${item.date}`)
					assert.isTrue(item.isActive, `Expected active to be true for date ${item.date}`)
				})
			})

			it('should have dates below minimum marked as inactive', () => {
				datepickerResult.slice(0, 9).forEach((item) => {
					assert.isTrue(item.isMinimumDate, `Expected isMinimumDate to be true for date ${item.date}`)
					assert.isFalse(item.isActive, `Expected active to be false for date ${item.date}`)
				})
			})

		})

		describe('Maximum date', () => {
			var maximumDate = new Date(2017, 2, 10)
			var datepickerResult;

			beforeEach(() => {
				sut = new HeadlessDatepicker({
					maximumDate: maximumDate
				})

				datepickerResult = sut.getRange(startDate, endDate)
			})

			it('should have maximum date and dates below marked as active', () => {
				datepickerResult.slice(0, 10).forEach((item) => {
					assert.isFalse(item.isMaximumDate, `Expected isMaximumDate to be false for date ${item.date}`)
					assert.isTrue(item.isActive, `Expected active to be true for date ${item.date}`)
				})
			})

			it('should have dates above maximum marked marked as inactive', () => {
				datepickerResult.slice(10).forEach((item) => {
					assert.isTrue(item.isMaximumDate, `Expected isMaximumDate to be true for date ${item.date}`)
					assert.isFalse(item.isActive, `Expected active to be false for date ${item.date}`)
				})
			})
		})


		it('should have disabled dates marked as inactive', () => {
			var disabledDates = [new Date(2017, 2, 5), new Date(2017, 2, 25), new Date(2017, 3, 15)]
			sut = new HeadlessDatepicker({
				disabledDates: disabledDates
			})

			var dates = sut.getRange(startDate, endDate)

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
	})

	describe('Additional data', () => {
		it.skip('should return the additional data that was provided for specific dates', () => {

		})
	})

	describe('Getting dates in grid by months', () => {
		var year;
		var month;
		var calendar;

		beforeEach(() => {
			year = 2017
			month = 3
			calendar = sut.getCalendar(year, month, false)
		})

		it('should return the calendar as an object with dates divided into weeks', () => {
			expect(calendar.weeks.length).to.equal(6)
		})

		it('should return 7 days in all weeks', () => {
			calendar.weeks.forEach(week => {
				assert.isTrue(week.length == 7, `Expected week to have 7 days: ${week}`)
			})
		})

		it('should return correct week day names in correct order', () => {
			expect(calendar.weekDays.full).to.deep.equal(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
			expect(calendar.weekDays.short).to.deep.equal(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
			expect(calendar.weekDays.min).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
		})

		it('should respect zero based months', () => {
			expect(calendar.month.full).to.equal('April')
			expect(calendar.month.short).to.equal('Apr')
		})

		it('should respect one based months', () => {
			calendar = sut.getCalendar(year, month, false, true)

			expect(calendar.month.full).to.equal('March')
			expect(calendar.month.short).to.equal('Mar')
		})

		it('should not show adjacent months', () => {
			var firstWeekDays = calendar.weeks[0].slice(0, 6)
			var lastWeekDays = calendar.weeks[5].slice(1)

			expect(firstWeekDays).to.deep.equal([ null, null, null, null, null, null ])
			expect(lastWeekDays).to.deep.equal([ null, null, null, null, null, null ])
		})

		it('should show previous adjacent month', () => {
			calendar = sut.getCalendar(year, month, true)

			var days = calendar.weeks[0].slice(0, 6).map(week => week.moment.format('YYYY-MM-DD'))

			expect(calendar.weeks[0][6].moment.format('YYYY-MM-DD')).to.equal('2017-04-01')
			expect(days).to.deep.equal([ '2017-03-26', '2017-03-27', '2017-03-28', '2017-03-29', '2017-03-30', '2017-03-31' ])
		})

		it('should show next adjacent month', () => {
			calendar = sut.getCalendar(year, month, true)

			var days = calendar.weeks[5].slice(1).map(week => week.moment.format('YYYY-MM-DD'))

			expect(calendar.weeks[5][0].moment.format('YYYY-MM-DD')).to.equal('2017-04-30')
			expect(days).to.deep.equal([ '2017-05-01', '2017-05-02', '2017-05-03', '2017-05-04', '2017-05-05', '2017-05-06' ])
		})
	})

	describe('Multiple grids', () => {
		var months;
		var calendars;

		beforeEach(() => {
			months = [{ year: 2017, month: 1 }, { year: 2017, month: 2 }, { year: 2017, month: 3 }, { year: 2018, month: 3 }]
			calendars = sut.getCalendars(months, true)
		})

		it('should support multiple months', () => {
			expect(calendars.length).to.equal(4)
		})
	})

	describe('Localization', () => {

		it.skip('should be able to set locale for moment', () => {
			var dates;
			sut = new HeadlessDatepicker({ locale: false })

			dates = sut.getRange(new Date(), new Date())
			expect(dates[0].moment.fromNow()).to.equal('a few seconds ago')

			sut = new HeadlessDatepicker({ locale: 'da', localeSettings: da })

			dates = sut.getRange(new Date(), new Date())
			expect(dates[0].moment.fromNow()).to.equal('få sekunder siden')
		})
	})
})


var da = {
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
	dayOfMonthOrdinalParse: /\d{1,2}\./, ordinal: "%d.",
	ordinal: "%d.",
	week: {
		dow: 1,
		doy: 4
	}
}