var moment = require('moment')

module.exports = function (options) {
    var _selectedDates = []

    var hdp = new Object();

    options = options || {}

    hdp.dateFormat = options.dateFormat || 'YYYY-MM-DD'
    hdp.zeroBased = typeof options.zeroBased === 'undefined' ? true : options.zeroBased
    hdp.minimumDate = options.minimumDate || null
    hdp.maximumDate = options.maximumDate || null
    hdp.disabledDates = options.disabledDates || []

    hdp.localeSettings = options.localeSettings || {
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }

    var isSelectedCheck = function (date) {
        var selected = hdp.getSelectedDates()

        var found = selected.find(function(item) { return item.date.getTime() == date.getTime() })

        return typeof found !== 'undefined'
    }

    var createHdpDate = function (date) {
        var settings = hdp.localeSettings
        var day = date.getDay()
        var month = date.getMonth()
        return {
            date: date,
            formatted: moment(date).format(hdp.dateFormat),
            dayName: settings.dayNames[day],
            dayNameShort: settings.dayNamesShort[day],
            dayNameMin: settings.dayNamesMin[day],
            monthName: settings.monthNames[month],
            monthNameShort: settings.monthNamesShort[month],
            isSelected: isSelectedCheck(date)
        }
    }

    var addDay = function (date) {
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
    }

    hdp.setSelectedDates = function (dates) {
        _selectedDates = dates.map(function (date) { return createHdpDate(date) })
    }

    hdp.getSelectedDates = function () { return _selectedDates }

    hdp.setSelectedDate = function (date) { hdp.setSelectedDates([date]) }

    hdp.getSelectedDate = function () { return !_selectedDates.length ? null : _selectedDates[_selectedDates.length - 1] }

    hdp.getDatesByTimespan = function (startDate, endDate) {
        var dates = []
        var dateWorker = createHdpDate(startDate)

        while (dateWorker.date <= endDate) {
            dates.push(dateWorker)
            dateWorker = createHdpDate(addDay(dateWorker.date))
        }

        return dates
    }

    return hdp
}