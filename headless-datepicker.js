var headlessDatepicker = function (options) {
    var hdMoment = require ? require('moment') : moment

    if (!hdMoment) throw ('headlessDatepicker: momentjs is not available. Please do require(\'moment\') or reference it from a script tag.')

    var _selectedDates = []

    var hdp = new Object();

    options = options || {}

    var momentLocale = options.locale || 'en'


    // if (options.localeSettings) {
    //     hdMoment.updateLocale(momentLocale, options.localeSettings)
    // }
    // else {
    //     if (momentLocale !== hdMoment.locale())
    //         hdMoment.locale(momentLocale)
    // }

    hdp.minimumDate = options.minimumDate || null
    hdp.maximumDate = options.maximumDate || null
    hdp.disabledDates = options.disabledDates || []

    var isSelectedCheck = function (date) {
        var selected = hdp.getSelectedDates()

        var found = selected.find(function (item) { return hdMoment(item.moment.toDate()).isSame(date, 'day') })

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

    var createHdpDate = function (date, isAdjacent) {
        var momentDate = hdMoment(date)
        var day = date.getDay()
        var month = date.getMonth()

        var isMinimum = isMinimumDateCheck(date)
        var isMaximum = isMaximumCheck(date)
        var isDisabled = isDisabledCheck(date)
        var isActive = !isMinimum && !isMaximum && !isDisabled

        return {
            moment: momentDate,
            isActive: isActive,
            isSelected: isSelectedCheck(date),
            isMinimumDate: isMinimum,
            isMaximumDate: isMaximum,
            isDisabled: isDisabled,
            isAdjacent: isAdjacent
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
            return item.moment.format('d') == 0
        })

        for (var i = firstDayOfWeekIndex; i < firstDayOfWeekIndex + 7; i++) {
            var day = range[i].moment

            weekDays.full.push(day.format('dddd'))
            weekDays.short.push(day.format('ddd'))
            weekDays.min.push(day.format('dd'))
        }

        return weekDays
    }

    var getMonth = function (range, monthOffset) {
        var firstDayOfMonth = range.find(function (item) {
            return item && item.isAdjacent == false
        })

        var momentMonth = firstDayOfMonth.moment.subtract(monthOffset, 'month')

        return {
            full: momentMonth.format('MMMM'),
            short: momentMonth.format('MMM')
        }
    }

    var getAdjacentBefore = function (momentDate, showAdjacentMonths) {
        var dayOfWeek = momentDate.format('d')
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
        var dayOfWeek = momentDate.format('d')
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

    var splitIntoWeeks = function (range, showAdjacentMonths) {
        var weeks = []

        var startWeekNumber = range[0].moment.week()
        var endWeekNumber = range[range.length - 1].moment.week()

        for (var i = startWeekNumber; i <= endWeekNumber; i++) {
            weeks.push(range.filter(function (r) { return r.moment.week() == i }))
        }

        return weeks
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

        while (dateWorker.moment.isSameOrBefore(endDate)) {
            dates.push(dateWorker)
            dateWorker = createHdpDate(addDay(dateWorker.moment.toDate()), false)
        }

        return dates
    }

    hdp.getCalendar = function (year, month, showAdjacentMonths, oneBasedMonth) {

        var startDate = hdMoment().year(year).month(month).date(1).toDate()
        var endDate = hdMoment().year(year).month(month).add('months', 1).date(0).toDate()

        var range = this.getRange(startDate, endDate)

        var weekDays = getWeekDays(range)

        var weeks = splitIntoWeeks(range, true)
        var lastWeekIndex = weeks.length - 1

        weeks[0] = getAdjacentBefore(range[0].moment, showAdjacentMonths).concat(weeks[0])

        weeks[lastWeekIndex] = weeks[lastWeekIndex].concat(getAdjacentAfter(range[range.length - 1].moment, showAdjacentMonths))

        var calendar = {
            moment: hdMoment,
            weekDays: weekDays,
            month: getMonth(range, oneBasedMonth ? 1 : 0),
            weeks: weeks
        }

        return calendar
    }

    return hdp
}

if (module && module.exports) module.exports = headlessDatepicker