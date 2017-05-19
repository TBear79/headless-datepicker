"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var headless_datepicker_1 = require("./headless-datepicker");
describe('Headless datepicker', function () {
    var sut;
    beforeEach(function () {
        sut = new headless_datepicker_1.HeadlessDatepicker();
    });
    describe('Initialization', function () {
        it('should be initialized', function () {
            chai_1.expect(sut).not.to.be.null;
        });
        it('should have default options set', function () {
            chai_1.expect(sut.minimumDate).to.be.null;
            chai_1.expect(sut.maximumDate).to.be.null;
            chai_1.expect(sut.disabledDates).to.be.an('array');
        });
        it('should override default options by setting options in contructor', function () {
            var dateFormat = 'DD/MM/YYYY';
            var minimumDate = new Date(2017, 1, 10);
            var maximumDate = new Date(2017, 1, 20);
            var disabledDates = [new Date(2017, 1, 14), new Date(2017, 1, 15)];
            sut = new headless_datepicker_1.HeadlessDatepicker({
                minimumDate: minimumDate,
                maximumDate: maximumDate,
                disabledDates: disabledDates
            });
            chai_1.expect(sut.minimumDate).to.deep.equal(minimumDate);
            chai_1.expect(sut.maximumDate).to.deep.equal(maximumDate);
            chai_1.expect(sut.disabledDates).to.deep.equal(disabledDates);
        });
        it('should support multiple objects', function () {
            var date1 = new Date(2017, 3, 1);
            var date2 = new Date(2017, 4, 1);
            sut = new headless_datepicker_1.HeadlessDatepicker({ minimumDate: date1 });
            var sut2 = new headless_datepicker_1.HeadlessDatepicker({ minimumDate: date2 });
            chai_1.expect(sut.options.minimumDate).to.deep.equal(date1);
            chai_1.expect(sut2.options.minimumDate).to.deep.equal(date2);
        });
    });
    describe('Setting and getting dates', function () {
        it('should get selected date after setting a selected date', function () {
            var testDate = new Date(2017, 5, 15);
            sut.setSelectedDate(testDate);
            var selectedDate = sut.getSelectedDate();
            chai_1.expect(selectedDate).not.to.be.null;
            chai_1.expect(selectedDate.day.toDate()).to.deep.equal(testDate);
        });
        it('should get array of selected dates after setting multiple dates', function () {
            var testDates = [new Date(2017, 5, 15), new Date(2017, 5, 16), new Date(2017, 5, 17)];
            sut.setSelectedDates(testDates);
            var selectedDates = sut.getSelectedDates();
            chai_1.expect(selectedDates).not.to.be.null;
            chai_1.expect(selectedDates).to.be.an('array');
            chai_1.expect(selectedDates.length).to.equal(3);
            chai_1.expect(selectedDates.map(function (s) { return s.day.toDate(); })).to.deep.equal(testDates);
        });
        it('should return latest selected date in getDate after setting multiple dates', function () {
            var lastDate = new Date(2017, 5, 17);
            var testDates = [new Date(2017, 5, 15), new Date(2017, 5, 16), lastDate];
            sut.setSelectedDates(testDates);
            var selectedDate = sut.getSelectedDate();
            chai_1.expect(selectedDate).not.to.be.null;
            chai_1.expect(selectedDate.day.toDate()).to.deep.equal(lastDate);
        });
    });
    describe('Getting dates for a time span', function () {
        var startDate;
        var endDate;
        beforeEach(function () {
            startDate = new Date(2017, 2, 1);
            endDate = new Date(2017, 3, 30);
        });
        it('should have correct start and end date', function () {
            var dates = sut.getRange(startDate, endDate);
            chai_1.expect(dates).to.be.an('array');
            chai_1.expect(dates.length).to.equal(61);
            chai_1.expect(dates[0].day.toDate()).to.deep.equal(startDate);
            chai_1.expect(dates[60].day.toDate()).to.deep.equal(endDate);
        });
        describe('Selected dates', function () {
            it('should have selected dates marked', function () {
                var testDates = [new Date(2017, 2, 2), new Date(2017, 2, 31), new Date(2017, 3, 29)];
                sut.setSelectedDates(testDates);
                var dates = sut.getRange(startDate, endDate);
                chai_1.expect(dates[1].isSelected).to.be.true;
                chai_1.expect(dates[30].isSelected).to.be.true;
                chai_1.expect(dates[59].isSelected).to.be.true;
                chai_1.expect(dates.filter(function (d) { return d.isSelected == false; }).length).to.equal(58);
            });
        });
        describe('Minimum date', function () {
            var minimumDate = new Date(2017, 2, 10);
            var datepickerResult;
            beforeEach(function () {
                sut = new headless_datepicker_1.HeadlessDatepicker({
                    minimumDate: minimumDate
                });
                datepickerResult = sut.getRange(startDate, endDate);
            });
            it('should have minimum date and above marked as active', function () {
                datepickerResult.slice(9).forEach(function (item) {
                    chai_1.assert.isFalse(item.isMinimumDate, "Expected isMinimumDate to be false for date " + item.date);
                    chai_1.assert.isTrue(item.isActive, "Expected active to be true for date " + item.date);
                });
            });
            it('should have dates below minimum marked as inactive', function () {
                datepickerResult.slice(0, 9).forEach(function (item) {
                    chai_1.assert.isTrue(item.isMinimumDate, "Expected isMinimumDate to be true for date " + item.date);
                    chai_1.assert.isFalse(item.isActive, "Expected active to be false for date " + item.date);
                });
            });
        });
        describe('Maximum date', function () {
            var maximumDate = new Date(2017, 2, 10);
            var datepickerResult;
            beforeEach(function () {
                sut = new headless_datepicker_1.HeadlessDatepicker({
                    maximumDate: maximumDate
                });
                datepickerResult = sut.getRange(startDate, endDate);
            });
            it('should have maximum date and dates below marked as active', function () {
                datepickerResult.slice(0, 10).forEach(function (item) {
                    chai_1.assert.isFalse(item.isMaximumDate, "Expected isMaximumDate to be false for date " + item.date);
                    chai_1.assert.isTrue(item.isActive, "Expected active to be true for date " + item.date);
                });
            });
            it('should have dates above maximum marked marked as inactive', function () {
                datepickerResult.slice(10).forEach(function (item) {
                    chai_1.assert.isTrue(item.isMaximumDate, "Expected isMaximumDate to be true for date " + item.date);
                    chai_1.assert.isFalse(item.isActive, "Expected active to be false for date " + item.date);
                });
            });
        });
        it('should have disabled dates marked as inactive', function () {
            var disabledDates = [new Date(2017, 2, 5), new Date(2017, 2, 25), new Date(2017, 3, 15)];
            sut = new headless_datepicker_1.HeadlessDatepicker({
                disabledDates: disabledDates
            });
            var dates = sut.getRange(startDate, endDate);
            chai_1.expect(dates[4].day.toDate()).to.deep.equal(disabledDates[0]);
            chai_1.expect(dates[24].day.toDate()).to.deep.equal(disabledDates[1]);
            chai_1.expect(dates[45].day.toDate()).to.deep.equal(disabledDates[2]);
            dates.forEach(function (item, i) {
                if (i == 4 || i == 24 || i == 45) {
                    chai_1.expect(item.isDisabled).to.true;
                    chai_1.expect(item.isActive).to.false;
                    return;
                }
                chai_1.assert.isFalse(item.isDisabled, "Expected isDisabled to be false for date " + item.date + ". Index (" + i + ")");
                chai_1.assert.isTrue(item.isActive, "Expected isActive to be true for date " + item.date + ". Index (" + i + ")");
            });
        });
        it('should return the additional information that was provided for specific dates', function () {
            var data1 = { holiday: 'Easter' };
            var data2 = 'The coolest thing';
            var data3 = [1, 2, 3];
            sut = new headless_datepicker_1.HeadlessDatepicker({
                extras: [
                    { date: new Date(2017, 2, 10), data: data1 },
                    { date: new Date(2017, 2, 20), data: data2 },
                    { date: new Date(2017, 2, 30), data: data3 }
                ]
            });
            var dates = sut.getRange(startDate, endDate);
            chai_1.expect(dates[8].extras).to.be.null;
            chai_1.expect(dates[9].extras).to.deep.equal(data1);
            chai_1.expect(dates[19].extras).to.equal(data2);
            chai_1.expect(dates[29].extras).to.deep.equal(data3);
        });
    });
    describe('Getting dates in grid by months', function () {
        var year;
        var month;
        var calendar;
        beforeEach(function () {
            year = 2017;
            month = 3;
        });
        describe('"exact"-mode', function () {
            beforeEach(function () {
                calendar = sut.getMonth(year, month, 'exact');
            });
            it('should return the calendar as an object with dates divided into weeks', function () {
                chai_1.expect(calendar.weeks.length).to.equal(6);
            });
            it('should return correct week day names in correct order', function () {
                chai_1.expect(calendar.weekDays.full).to.deep.equal(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
                chai_1.expect(calendar.weekDays.short).to.deep.equal(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
                chai_1.expect(calendar.weekDays.min).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
            });
            it('should respect zero based months', function () {
                chai_1.expect(calendar.month.number).to.equal(3);
                chai_1.expect(calendar.weeks[0][0].day.format('MMMM')).to.equal('April');
                chai_1.expect(calendar.month.full).to.equal('April');
                chai_1.expect(calendar.month.short).to.equal('Apr');
            });
            it('should respect one based months', function () {
                calendar = sut.getMonth(year, month, 'exact', true);
                chai_1.expect(calendar.month.number).to.equal(3);
                chai_1.expect(calendar.weeks[0][0].day.format('MMMM')).to.equal('March');
                chai_1.expect(calendar.month.full).to.equal('March');
                chai_1.expect(calendar.month.short).to.equal('Mar');
            });
            it('should return correct number of days for each week', function () {
                chai_1.expect(calendar.weeks[0].length).to.equal(1);
                chai_1.expect(calendar.weeks[1].length).to.equal(7);
                chai_1.expect(calendar.weeks[2].length).to.equal(7);
                chai_1.expect(calendar.weeks[3].length).to.equal(7);
                chai_1.expect(calendar.weeks[4].length).to.equal(7);
                chai_1.expect(calendar.weeks[5].length).to.equal(1);
            });
        });
        describe('"fill"-mode', function () {
            beforeEach(function () {
                calendar = sut.getMonth(year, month, 'fill');
            });
            it('should return 7 days in all weeks', function () {
                calendar.weeks.forEach(function (week) {
                    chai_1.assert.isTrue(week.length == 7, "Expected week to have 7 days: " + week);
                });
            });
            it('should not show adjacent months', function () {
                var firstWeekDays = calendar.weeks[0].slice(0, 6);
                var lastWeekDays = calendar.weeks[5].slice(1);
                chai_1.expect(firstWeekDays).to.deep.equal([null, null, null, null, null, null]);
                chai_1.expect(lastWeekDays).to.deep.equal([null, null, null, null, null, null]);
            });
        });
        describe('"adjacent"-mode', function () {
            beforeEach(function () {
                calendar = sut.getMonth(year, month, 'adjacent');
            });
            it('should show previous adjacent month', function () {
                var days = calendar.weeks[0].slice(0, 6).map(function (week) { return week.day.format('YYYY-MM-DD'); });
                chai_1.expect(calendar.weeks[0][6].day.format('YYYY-MM-DD')).to.equal('2017-04-01');
                chai_1.expect(days).to.deep.equal(['2017-03-26', '2017-03-27', '2017-03-28', '2017-03-29', '2017-03-30', '2017-03-31']);
            });
            it('should show next adjacent month', function () {
                var days = calendar.weeks[5].slice(1).map(function (week) { return week.day.format('YYYY-MM-DD'); });
                chai_1.expect(calendar.weeks[5][0].day.format('YYYY-MM-DD')).to.equal('2017-04-30');
                chai_1.expect(days).to.deep.equal(['2017-05-01', '2017-05-02', '2017-05-03', '2017-05-04', '2017-05-05', '2017-05-06']);
            });
        });
        describe('"fixed"-mode', function () {
            it('should show 6 weeks for month with 5 weeks', function () {
                calendar = sut.getMonth(year, 2, 'fixed');
                chai_1.expect(calendar.weeks.slice(-1)[0].map(function (item) { return item.day.format('YYYY-MM-DD'); })).to.deep.equal(['2017-04-02', '2017-04-03', '2017-04-04', '2017-04-05', '2017-04-06', '2017-04-07', '2017-04-08']);
            });
            it('should show 6 weeks for month with 6 weeks', function () {
                calendar = sut.getMonth(year, month, 'fixed');
                chai_1.expect(calendar.weeks.slice(-1)[0].map(function (item) { return item.day.format('YYYY-MM-DD'); })).to.deep.equal(['2017-04-30', '2017-05-01', '2017-05-02', '2017-05-03', '2017-05-04', '2017-05-05', '2017-05-06']);
            });
        });
    });
    describe('Multiple grids', function () {
        var months;
        var calendars;
        beforeEach(function () {
            months = [{ year: 2017, month: 1 }, { year: 2017, month: 2 }, { year: 2017, month: 3 }, { year: 2018, month: 3 }];
            calendars = sut.getMonths(months);
        });
        it('should support multiple months', function () {
            chai_1.expect(calendars.length).to.equal(4);
        });
        it('should return the correct number of days for all month. Including leap year', function () {
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
            ];
            calendars = sut.getMonths(months, 'exact', true);
            var reduceFn = function (a, b) { return a.concat(b); };
            chai_1.expect(calendars[0].weeks.reduce(reduceFn).length).to.equal(29);
            chai_1.expect(calendars[1].weeks.reduce(reduceFn).length).to.equal(31);
            chai_1.expect(calendars[2].weeks.reduce(reduceFn).length).to.equal(28);
            chai_1.expect(calendars[3].weeks.reduce(reduceFn).length).to.equal(31);
            chai_1.expect(calendars[4].weeks.reduce(reduceFn).length).to.equal(30);
            chai_1.expect(calendars[5].weeks.reduce(reduceFn).length).to.equal(31);
            chai_1.expect(calendars[6].weeks.reduce(reduceFn).length).to.equal(30);
            chai_1.expect(calendars[7].weeks.reduce(reduceFn).length).to.equal(31);
            chai_1.expect(calendars[8].weeks.reduce(reduceFn).length).to.equal(31);
            chai_1.expect(calendars[9].weeks.reduce(reduceFn).length).to.equal(30);
            chai_1.expect(calendars[10].weeks.reduce(reduceFn).length).to.equal(31);
            chai_1.expect(calendars[11].weeks.reduce(reduceFn).length).to.equal(30);
            chai_1.expect(calendars[12].weeks.reduce(reduceFn).length).to.equal(31);
        });
    });
    describe('Localization', function () {
        it('should be able to set locale for moment', function () {
            var dates;
            dates = sut.getRange(new Date(), new Date());
            chai_1.expect(dates[0].day.fromNow()).to.equal('a few seconds ago');
            sut = new headless_datepicker_1.HeadlessDatepicker({ locale: 'da', localeSettings: da });
            dates = sut.getRange(new Date(), new Date());
            chai_1.expect(dates[0].day.fromNow()).to.equal('få sekunder siden');
        });
        it('should respect first day in week, based on locale', function () {
            var dates;
            var calendar;
            dates = sut.getRange(new Date(2017, 3, 1), new Date(2017, 3, 3));
            calendar = sut.getMonth(2017, 3);
            chai_1.expect(dates[0].day.weekday()).to.equal(6);
            chai_1.expect(dates[1].day.weekday()).to.equal(0);
            chai_1.expect(dates[2].day.weekday()).to.equal(1);
            chai_1.expect(calendar.weekDays.min).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
            sut = new headless_datepicker_1.HeadlessDatepicker({ locale: 'da', localeSettings: da });
            dates = sut.getRange(new Date(2017, 3, 1), new Date(2017, 3, 3));
            calendar = sut.getMonth(2017, 3);
            chai_1.expect(dates[0].day.weekday()).to.equal(5);
            chai_1.expect(dates[1].day.weekday()).to.equal(6);
            chai_1.expect(dates[2].day.weekday()).to.equal(0);
            chai_1.expect(calendar.weekDays.min).to.deep.equal(['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø']);
        });
    });
});
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
    dayOfMonthOrdinalParse: /\d{1,2}\./,
    ordinal: "%d.",
    week: {
        dow: 1,
        doy: 4
    }
};
//# sourceMappingURL=headless-datepicker.spec.js.map