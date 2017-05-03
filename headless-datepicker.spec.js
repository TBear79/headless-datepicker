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
			expect(sut.dateFormat).to.equal('YYYY-MM-DD')
			expect(sut.zeroBased).to.be.true
			expect(sut.minimumDate).to.be.null
			expect(sut.maximumDate).to.be.null
			expect(sut.disabledDates).to.be.an('array')
			expect(sut.localeSettings).to.deep.equal({
				firstDayOfWeek: 0,
				dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			})
		})

		it('should override default options by setting options in contructor', () => {
			var dateFormat = 'DD/MM/YYYY'
			var minimumDate = new Date(2017, 1, 10)
			var maximumDate = new Date(2017, 1, 20)
			var disabledDates = [new Date(2017, 1, 14), new Date(2017, 1, 15)]
			var localeSettings = {
				firstDayOfWeek: 1,
				dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
				dayNamesShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
				dayNamesMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"],
				monthNames: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
				monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
			}
			sut = new HeadlessDatepicker({
				dateFormat: dateFormat,
				zeroBased: false,
				minimumDate: minimumDate,
				maximumDate: maximumDate,
				localeSettings: localeSettings,
				disabledDates: disabledDates
			})

			expect(sut.dateFormat).to.equal(dateFormat)
			expect(sut.zeroBased).to.be.false
			expect(sut.minimumDate).to.deep.equal(minimumDate)
			expect(sut.maximumDate).to.deep.equal(maximumDate)
			expect(sut.disabledDates).to.deep.equal(disabledDates)
			expect(sut.localeSettings).to.deep.equal(localeSettings)
		})

		it('should support multiple objects', () => {
			var sut2 = new HeadlessDatepicker({
				zeroBased: false
			})

			expect(sut.zeroBased).to.be.true
			expect(sut2.zeroBased).to.be.false
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
			expect(selectedDate.date).to.deep.equal(testDate)
		})

		it('should get array of selected dates after setting multiple dates', () => {
			var testDates = [new Date(2017, 5, 15), new Date(2017, 5, 16), new Date(2017, 5, 17)]
			sut.setSelectedDates(testDates)
			var selectedDates = sut.getSelectedDates()

			expect(selectedDates).not.to.be.null
			expect(selectedDates).to.be.an('array')
			expect(selectedDates.length).to.equal(3)
			expect(selectedDates.map((s) => { return s.date })).to.deep.equal(testDates)
		})

		it('should return latest selected date in getDate after setting multiple dates', () => {
			var lastDate = new Date(2017, 5, 17)
			var testDates = [new Date(2017, 5, 15), new Date(2017, 5, 16), lastDate]
			sut.setSelectedDates(testDates)
			var selectedDate = sut.getSelectedDate()

			expect(selectedDate).not.to.be.null
			expect(selectedDate.date).to.deep.equal(lastDate)
		})
	})

	describe('The returned date object', () => {

		it('should get date-string in correct moment-format', () => {
			sut.setSelectedDate(new Date(2017, 3, 15))
			var date = sut.getSelectedDate()
			expect(date.formatted).to.equal('2017-04-15')
		})

		describe('Day names', () => {
			var weekDays = [new Date(2017, 0, 1), new Date(2017, 0, 2), new Date(2017, 0, 3), new Date(2017, 0, 4), new Date(2017, 0, 5), new Date(2017, 0, 6), new Date(2017, 0, 7)]
			var dates;

			beforeEach(() => {
				sut.setSelectedDates(weekDays)
				dates = sut.getSelectedDates()
			})

			it('should get correct day names', () => {
				expect(dates.map(d => (d.dayName))).to.deep.equal(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
			})

			it('should get correct day names in short', () => {
				expect(dates.map(d => (d.dayNameShort))).to.deep.equal(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
			})

			it('should get correct day names in mini', () => {
				expect(dates.map(d => (d.dayNameMin))).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
			})
		})

		describe('Month names', () => {
			var months = [new Date(2017, 0, 1), new Date(2017, 1, 1), new Date(2017, 2, 1), new Date(2017, 3, 1), new Date(2017, 4, 1), new Date(2017, 5, 1), new Date(2017, 6, 1), new Date(2017, 7, 1), new Date(2017, 8, 1), new Date(2017, 9, 1), new Date(2017, 10, 1), new Date(2017, 11, 1)]

			var dates;

			beforeEach(() => {
				sut.setSelectedDates(months)
				dates = sut.getSelectedDates()
			})

			it('should get correct month names', () => {
				expect(dates.map(d => (d.monthName))).to.deep.equal(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
			})

			it('should get correct month names in short', () => {
				expect(dates.map(d => (d.monthNameShort))).to.deep.equal(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
			})
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
			var dates = sut.getDatepicker(startDate, endDate)

			expect(dates).to.be.an('array')
			expect(dates.length).to.equal(61)
			expect(dates[0].date).to.deep.equal(startDate)
			expect(dates[60].date).to.deep.equal(endDate)
		})

		describe('Selected dates', () => {
			it('should have selected dates marked', () => {
				var testDates = [new Date(2017, 2, 2), new Date(2017, 2, 31), new Date(2017, 3, 29)]
				sut.setSelectedDates(testDates)

				var dates = sut.getDatepicker(startDate, endDate)

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

				datepickerResult = sut.getDatepicker(startDate, endDate)
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

				datepickerResult = sut.getDatepicker(startDate, endDate)
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
			sut = new HeadlessDatepicker({
				disabledDates: [new Date(2017, 2, 5), new Date(2017, 2, 25), new Date(2017, 3, 15)]
			})

			var dates = sut.getDatepicker(startDate, endDate)

			expect(dates[4].formatted).to.equal('2017-03-05')
			expect(dates[24].formatted).to.equal('2017-03-25')
			expect(dates[45].formatted).to.equal('2017-04-15')

			dates.forEach((item, i) => {
				if(i == 4 || i == 24 || i == 45) {
					expect(item.isDisabled).to.true
					expect(item.isActive).to.false
					return
				}

				assert.isFalse(item.isDisabled, `Expected isDisabled to be false for date ${item.date}. Index (${i})`)
				assert.isTrue(item.isActive, `Expected isActive to be true for date ${item.date}. Index (${i})`)
			})
		})

		it('should return correct week number', () => {
			var dates = sut.getDatepicker(new Date(2016, 11, 25), new Date(2018, 0, 8))

			dates.forEach((item, i) => {
				var momentWeek = moment(item.date).format('W')
				assert.isTrue (item.weekNumber == momentWeek, `Expected ${item.weekNumber} equal ${momentWeek} for date ${item.date}. Index (${i})`)
			})
		})


		it.skip('should respect first day of week', () => {
		})

	})

	describe('Getting dates in grid by months', () => {
		it.skip('should respect zero based months', () => {
		})

		it.skip('should respect non-zero based months', () => {
		})

		it.skip('should not show adjacent months', () => {
		})

		it.skip('should show adjacent months', () => {
		})
	})
})

