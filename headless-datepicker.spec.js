
const chai = require('chai')
const assert = chai.assert
const expect = chai.expect

const HeadlessDatepicker = require('./headless-datepicker')

describe('Headless datepicker', function () {
	var headlessDatepicker;

	before(function () {
		headlessDatepicker = new HeadlessDatepicker()
	})
	after(function () {
	})

	describe('Initialization', function () {
		it('should be initialized', function () {
			expect(headlessDatepicker).not.to.be.null
		})

		it.skip('should have zero-based months as default', function () {
		})

		it.skip('should override zero-based months by setting property', function () {
		})
	})

	describe('Setting and getting dates', function () {
		it.skip('should get selected date after setting a selected date', function () {
		})

		it.skip('should get array of selected dates after setting multiple dates', function () {
		})

		it.skip('should return latest selected date in getDate after setting multiple dates', function () {
		})

		it.skip('should get minimum date after setting a minimum date', function () {
		})

		it.skip('should get maximum date after setting a maximum date', function () {
		})

		it.skip('should get array of disabled dates after setting disabled date', function () {
		})
	})

	describe('Localization and formatting', function () {
		it.skip('should get default localization', function () {
		})
		
		it.skip('should set and get localization options', function () {
			/*
			{
				firstDayOfWeek: 0,
				dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
				monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
				monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
			}
			*/
		})

		
		it.skip('should get date-string in correct moment-format', function () {
		})

		it.skip('should get array of date-strings in correct moment-format', function () {
		})
	})

	describe('Getting date grid', function () {
		it.skip('should return grid for a given month', function () {
		})

		it.skip('should show adjacent months', function () {
		})

		it.skip('should not show adjacent months', function () {
		})

		it.skip('should have selected dates marked', function () {
		})

		it.skip('should have minimum date marked', function () {
		})

		it.skip('should have maximum date marked', function () {
		})

		it.skip('should have disabled dates marked', function () {
		})

		it.skip('should respect zero based months', function () {
		})

		it.skip('should respect non-zero based months', function () {
		})

		it.skip('should respect first day of week', function () {
		})
	})	
})

