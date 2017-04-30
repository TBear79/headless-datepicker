
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
				expect(dates.map(d => (d.monthNameShort))).to.deep.equal([ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ])
			})
		})
	})

	describe('Getting date grid', () => {
		it.skip('should return grid for a given month', () => {
		})

		it.skip('should show adjacent months', () => {
		})

		it.skip('should not show adjacent months', () => {
		})

		it.skip('should have selected dates marked', () => {
		})

		it.skip('should have minimum date marked', () => {
		})

		it.skip('should have minimum date included', () => {
		})

		it.skip('should have dates below minimum as disabled', () => {
		})

		it.skip('should have maximum date marked', () => {
		})

		it.skip('should have maximum date included', () => {
		})

		it.skip('should have dates above maximum as disabled', () => {
		})

		it.skip('should have disabled dates marked', () => {
		})

		it.skip('should respect zero based months', () => {
		})

		it.skip('should respect non-zero based months', () => {
		})

		it.skip('should respect first day of week', () => {
		})
	})
})

