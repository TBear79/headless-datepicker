var headlessDatepicker = function (options) {
    var localMoment = require ? require('moment') : moment

    if (!localMoment) throw ('headlessDatepicker: momentjs is not available. Please do require(\'moment\') or reference it from a script tag.')

    var _selectedDates = []

    var hdp = new Object();

    options = options || {}

    hdp.locale = options.locale || 'en'
    hdp.localeSettings = options.localeSettings

    hdp.minimumDate = options.minimumDate || null
    hdp.maximumDate = options.maximumDate || null
    hdp.disabledDates = options.disabledDates || []
    hdp.extras = options.extras || []

    var hdMoment = function (date) {
        var m = localMoment(date)
        m.locale(hdp.locale, hdp.localeSettings)
        return m
    }

    var isSelectedCheck = function (date) {
        var selected = hdp.getSelectedDates()

        var found = selected.find(function (item) { return hdMoment(item.day.toDate()).isSame(date, 'day') })

        return typeof found !== 'undefined'
    }

    var isMinimumDateCheck = function (date) {
        return hdp.minimumDate ? hdMoment(hdp.minimumDate).isAfter(date, 'day') : false
    }

    var isMaximumCheck = function (date) {
        return hdp.maximumDate ? hdMoment(hdp.maximumDate).isBefore(date, 'day') : false
    }

    var isDisabledCheck = function (date) {
        return hdp.disabledDates.findIndex(function (item) { return hdMoment(item).isSame(date, 'day') }) !== -1
    }

    var attachExtras = function (date) {
        var extras = hdp.extras.filter(function (item) { return hdMoment(item.date).isSame(date, 'day') })

        return extras.length == 0 ? null : extras[0].data
    }

    var createHdpDate = function (date, isAdjacent) {
        var momentDate = hdMoment(date)
        var day = date.getDay()
        var month = date.getMonth()

        var isMinimum = isMinimumDateCheck(date)
        var isMaximum = isMaximumCheck(date)
        var isDisabled = isDisabledCheck(date)
        var isActive = !isMinimum && !isMaximum && !isDisabled

        return {
            day: momentDate,
            isActive: isActive,
            isSelected: isSelectedCheck(date),
            isMinimumDate: isMinimum,
            isMaximumDate: isMaximum,
            isDisabled: isDisabled,
            isAdjacent: isAdjacent,
            extras: attachExtras(date)
        }
    }

    var addDay = function (date) {
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
    }

    var createAdjacentDateEntry = function (momentDate, showAdjacentMonths) {
        return showAdjacentMonths ? createHdpDate(momentDate.toDate(), true) : null
    }

    var getWeekDays = function (range) {
        var weekDays = {
            full: [],
            short: [],
            min: []
        }

        var firstDayOfWeekIndex = range.findIndex(function (item) {
            return item.day.weekday() == 0
        })

        for (var i = firstDayOfWeekIndex; i < firstDayOfWeekIndex + 7; i++) {
            var day = range[i].day

            weekDays.full.push(day.format('dddd'))
            weekDays.short.push(day.format('ddd'))
            weekDays.min.push(day.format('dd'))
        }

        return weekDays
    }

    var getMonthNames = function (range, monthOffset) {
        var firstDayOfMonth = range.find(function (item) {
            return item && item.isAdjacent == false
        })

        return {
            number: firstDayOfMonth.day.month() + monthOffset,
            full: firstDayOfMonth.day.format('MMMM'),
            short: firstDayOfMonth.day.format('MMM')
        }
    }

    var getAdjacentBefore = function (momentDate, showAdjacentMonths) {
        var dayOfWeek = momentDate.weekday()
        var clonedDate = momentDate.clone()

        clonedDate.subtract(dayOfWeek, 'days')

        var dates = []

        while (clonedDate.isBefore(momentDate)) {
            dates.push(createAdjacentDateEntry(clonedDate, showAdjacentMonths))
            clonedDate.add(1, 'day')
        }

        return dates
    }

    var getAdjacentAfter = function (momentDate, showAdjacentMonths) {
        var dayOfWeek = momentDate.weekday()
        var clonedDate = momentDate.clone()

        clonedDate.add(6 - dayOfWeek, 'days')

        var dates = []

        while (clonedDate.isAfter(momentDate)) {
            dates.push(createAdjacentDateEntry(clonedDate, showAdjacentMonths))
            clonedDate.subtract(1, 'day')
        }

        dates.reverse()

        return dates
    }

    var splitIntoWeeks = function (range) {
        var weeks = []

        var startWeekNumber = range[0].day.week()
        var endWeekNumber = range[range.length - 1].day.week()
        var newYear = false

        if(startWeekNumber > endWeekNumber) {
            endWeekNumber = range[range.length - 2].day.week() + 1
            newYear = true
        }

        for (var i = startWeekNumber; i <= endWeekNumber; i++) {
            var compareWeek = newYear && i == endWeekNumber ? 1 : i

            weeks.push(range.filter(function (r) { return r.day.week() == compareWeek }))
        }

        return weeks
    }

    var exactMode = function (range) {
        return splitIntoWeeks(range)
    }

    var fillMode = function (range, showAdjacentMonths) {
        var weeks = splitIntoWeeks(range)
        var lastWeekIndex = weeks.length - 1

        weeks[0] = getAdjacentBefore(range[0].day, showAdjacentMonths).concat(weeks[0])

        weeks[lastWeekIndex] = weeks[lastWeekIndex].concat(getAdjacentAfter(range[range.length - 1].day, showAdjacentMonths))

        return weeks
    }

    var adjacentMode = function (range) {
        return fillMode(range, true)
    }

    var fixedMode = function (range) {
        var weeks = adjacentMode(range)
        while (weeks.length < 6) {
            var lastDay = weeks[weeks.length - 1].slice(-1)[0].day.clone()
            var nextDay = lastDay.add(1, 'day')
            var newWeek = getAdjacentAfter(nextDay, true)
            
            // getAdjacentAfter only works with dates AFTER the the date passed. So we have to place the new date at the beginning
            newWeek.unshift(createAdjacentDateEntry(nextDay, true)) 

            weeks.push(newWeek)
        }
        return weeks
    }

    var getWeeks = function (range, mode) {
        var showAdjacentMonths = false

        switch (mode) {
            case 'exact':
                return exactMode(range)
            case 'adjacent':
                return adjacentMode(range)
            case 'fill':
                return fillMode(range, false)
            case 'fixed':
                return fixedMode(range)
            default:
                throw new Error('Invalid mode: ' + mode)
        }
    }

    hdp.setSelectedDates = function (dates) {
        _selectedDates = dates.map(function (date) { return createHdpDate(date, false) })
    }

    hdp.getSelectedDates = function () { return _selectedDates }

    hdp.setSelectedDate = function (date) { hdp.setSelectedDates([date]) }

    hdp.getSelectedDate = function () { return !_selectedDates.length ? null : _selectedDates[_selectedDates.length - 1] }

    hdp.getRange = function (startDate, endDate) {
        var dates = []
        var dateWorker = createHdpDate(startDate, false)

        while (dateWorker.day.isSameOrBefore(endDate)) {
            dates.push(dateWorker)
            dateWorker = createHdpDate(addDay(dateWorker.day.toDate()), false)
        }

        return dates
    }

    hdp.getCalendar = function (year, month, mode, oneBasedMonth) {
        mode = mode || 'exact'
        var monthOffset = oneBasedMonth ? 1 : 0
        var startDate = hdMoment().year(year).month(month - monthOffset).date(1).toDate()
        var endDate = hdMoment().year(year).month(month - monthOffset).add(1, 'months').date(0).toDate()

        var range = hdp.getRange(startDate, endDate)

        var weekDays = getWeekDays(range)

        var weeks = getWeeks(range, mode)

        var calendar = {
            weekDays: weekDays,
            year: year,
            month: getMonthNames(range, monthOffset),
            weeks: weeks
        }

        return calendar
    }

    hdp.getCalendars = function (months, mode, oneBasedMonth) {
        var t = this

        return months.map(function (item) { return t.getCalendar(item.year, item.month, mode, oneBasedMonth) })
    }

    return hdp
}

if (module && module.exports) module.exports = module.exports.HeadlessDatepicker = headlessDatepicker