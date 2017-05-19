"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var HeadlessDatepicker = (function () {
    function HeadlessDatepicker(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        options.locale = options.locale || 'en';
        options.disabledDates = options.disabledDates || [];
        options.extras = options.extras || [];
        this.localMoment = moment;
        if (!this.localMoment)
            throw ('headlessDatepicker: momentjs is not available. Please do import or require(\'moment\') or reference it from a script tag.');
    }
    HeadlessDatepicker.prototype.setSelectedDates = function (dates) {
        var _this = this;
        this.selectedDates = dates.map(function (date) { return _this.createHdpDate(date, false); });
    };
    HeadlessDatepicker.prototype.getSelectedDates = function () { return this.selectedDates; };
    HeadlessDatepicker.prototype.getRange = function (startDate, endDate) {
        var dates = [];
        var dateWorker = this.createHdpDate(startDate, false);
        while (dateWorker.day.isSameOrBefore(endDate)) {
            dates.push(dateWorker);
            dateWorker = this.createHdpDate(this.addDay(dateWorker.day.toDate()), false);
        }
        return dates;
    };
    HeadlessDatepicker.prototype.getMonth = function (year, month, mode, oneBasedMonth) {
        mode = mode || 'exact';
        var monthOffset = oneBasedMonth ? 1 : 0;
        var startDate = this.hdMoment().year(year).month(month - monthOffset).date(1).toDate();
        var endDate = this.hdMoment().year(year).month(month - monthOffset).add(1, 'months').date(0).toDate();
        var range = this.getRange(startDate, endDate);
        var weekDays = this.getWeekDays(range);
        var weeks = this.getWeeks(range, mode);
        var calendar = {
            weekDayInfo: weekDays,
            year: year,
            monthInfo: this.getMonthNames(range, monthOffset),
            weeks: weeks
        };
        return calendar;
    };
    HeadlessDatepicker.prototype.getMonths = function (months, mode, oneBasedMonth) {
        var _this = this;
        return months.map(function (item) { return _this.getMonth(item.year, item.month, mode, oneBasedMonth); });
    };
    // createMomentDay
    HeadlessDatepicker.prototype.hdMoment = function (date) {
        var m = this.localMoment(date);
        m.locale(this.options.locale, this.options.localeSettings);
        return m;
    };
    // dateIsSelected
    HeadlessDatepicker.prototype.isSelectedCheck = function (date) {
        var _this = this;
        var selected = this.getSelectedDates();
        var found = selected.find(function (item) { return _this.hdMoment(item.day.toDate()).isSame(date, 'day'); });
        return typeof found !== 'undefined';
    };
    // minimumDateIsReached
    HeadlessDatepicker.prototype.isMinimumDateCheck = function (date) {
        return this.options.minimumDate ? this.hdMoment(this.options.minimumDate).isAfter(date, 'day') : false;
    };
    // maximumDateIsReached
    HeadlessDatepicker.prototype.isMaximumDateCheck = function (date) {
        return this.options.maximumDate ? this.hdMoment(this.options.maximumDate).isBefore(date, 'day') : false;
    };
    // dateIsDisabled
    HeadlessDatepicker.prototype.isDisabledCheck = function (date) {
        var _this = this;
        return this.options.disabledDates.findIndex(function (item) { return _this.hdMoment(item).isSame(date, 'day'); }) !== -1;
    };
    // attachExtrasToDay
    HeadlessDatepicker.prototype.attachExtras = function (date) {
        var _this = this;
        var extras = this.options.extras.filter(function (item) { return _this.hdMoment(item.date).isSame(date, 'day'); });
        return extras.length == 0 ? null : extras[0].data;
    };
    HeadlessDatepicker.prototype.createHdpDate = function (date, isAdjacent) {
        var momentDate = this.hdMoment(date);
        var day = date.getDay();
        var month = date.getMonth();
        var isMinimum = this.isMinimumDateCheck(date);
        var isMaximum = this.isMaximumDateCheck(date);
        var isDisabled = this.isDisabledCheck(date);
        var isActive = !isMinimum && !isMaximum && !isDisabled;
        return {
            day: momentDate,
            isActive: isActive,
            isSelected: this.isSelectedCheck(date),
            isMinimumDate: isMinimum,
            isMaximumDate: isMaximum,
            isDisabled: isDisabled,
            isAdjacent: isAdjacent,
            extras: this.attachExtras(date)
        };
    };
    HeadlessDatepicker.prototype.addDay = function (date) {
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
    };
    HeadlessDatepicker.prototype.createAdjacentDateEntry = function (momentDate, showAdjacentMonths) {
        return showAdjacentMonths ? this.createHdpDate(momentDate.toDate(), true) : null;
    };
    HeadlessDatepicker.prototype.getWeekDays = function (range) {
        var weekDays = {
            full: [],
            short: [],
            min: []
        };
        var firstDayOfWeekIndex = range.findIndex(function (item) {
            return item.day.weekday() == 0;
        });
        for (var i = firstDayOfWeekIndex; i < firstDayOfWeekIndex + 7; i++) {
            var day = range[i].day;
            weekDays.full.push(day.format('dddd'));
            weekDays.short.push(day.format('ddd'));
            weekDays.min.push(day.format('dd'));
        }
        return weekDays;
    };
    HeadlessDatepicker.prototype.getMonthNames = function (range, monthOffset) {
        var firstDayOfMonth = range.find(function (item) {
            return item && item.isAdjacent == false;
        });
        return {
            number: firstDayOfMonth.day.month() + monthOffset,
            full: firstDayOfMonth.day.format('MMMM'),
            short: firstDayOfMonth.day.format('MMM')
        };
    };
    HeadlessDatepicker.prototype.getAdjacentBefore = function (momentDate, showAdjacentMonths) {
        var dayOfWeek = momentDate.weekday();
        var clonedDate = momentDate.clone();
        clonedDate.subtract(dayOfWeek, 'days');
        var dates = [];
        while (clonedDate.isBefore(momentDate)) {
            dates.push(this.createAdjacentDateEntry(clonedDate, showAdjacentMonths));
            clonedDate.add(1, 'day');
        }
        return dates;
    };
    HeadlessDatepicker.prototype.getAdjacentAfter = function (momentDate, showAdjacentMonths) {
        var dayOfWeek = momentDate.weekday();
        var clonedDate = momentDate.clone();
        clonedDate.add(6 - dayOfWeek, 'days');
        var dates = [];
        while (clonedDate.isAfter(momentDate)) {
            dates.push(this.createAdjacentDateEntry(clonedDate, showAdjacentMonths));
            clonedDate.subtract(1, 'day');
        }
        dates.reverse();
        return dates;
    };
    HeadlessDatepicker.prototype.splitIntoWeeks = function (range) {
        var weeks = [];
        var startWeekNumber = range[0].day.week();
        var endWeekNumber = range[range.length - 1].day.week();
        var newYear = false;
        if (startWeekNumber > endWeekNumber) {
            endWeekNumber = range[range.length - 2].day.week() + 1;
            newYear = true;
        }
        var _loop_1 = function () {
            var compareWeek = newYear && i == endWeekNumber ? 1 : i;
            weeks.push(range.filter(function (r) { return r.day.week() == compareWeek; }));
        };
        for (var i = startWeekNumber; i <= endWeekNumber; i++) {
            _loop_1();
        }
        return weeks;
    };
    HeadlessDatepicker.prototype.exactMode = function (range) {
        return this.splitIntoWeeks(range);
    };
    HeadlessDatepicker.prototype.fillMode = function (range, showAdjacentMonths) {
        var weeks = this.splitIntoWeeks(range);
        var lastWeekIndex = weeks.length - 1;
        weeks[0] = this.getAdjacentBefore(range[0].day, showAdjacentMonths).concat(weeks[0]);
        weeks[lastWeekIndex] = weeks[lastWeekIndex].concat(this.getAdjacentAfter(range[range.length - 1].day, showAdjacentMonths));
        return weeks;
    };
    HeadlessDatepicker.prototype.adjacentMode = function (range) {
        return this.fillMode(range, true);
    };
    HeadlessDatepicker.prototype.fixedMode = function (range) {
        var weeks = this.adjacentMode(range);
        while (weeks.length < 6) {
            var lastDay = weeks[weeks.length - 1].slice(-1)[0].day.clone();
            var nextDay = lastDay.add(1, 'day');
            var newWeek = this.getAdjacentAfter(nextDay, true);
            // getAdjacentAfter only works with dates AFTER the the date passed. So we have to place the new date at the beginning
            newWeek.unshift(this.createAdjacentDateEntry(nextDay, true));
            weeks.push(newWeek);
        }
        return weeks;
    };
    HeadlessDatepicker.prototype.getWeeks = function (range, mode) {
        var showAdjacentMonths = false;
        switch (mode) {
            case 'exact':
                return this.exactMode(range);
            case 'adjacent':
                return this.adjacentMode(range);
            case 'fill':
                return this.fillMode(range, false);
            case 'fixed':
                return this.fixedMode(range);
            default:
                throw new Error('Invalid mode: ' + mode);
        }
    };
    return HeadlessDatepicker;
}());
exports.HeadlessDatepicker = HeadlessDatepicker;
//# sourceMappingURL=headless-datepicker.js.map