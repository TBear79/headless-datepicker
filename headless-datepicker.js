var headlessDatepicker = function (options) {
    var hdMoment = require ? require('moment') : moment 

    if(!hdMoment) throw('headlessDatepicker: momentjs is not available. Please do require(\'moment\') or reference it from a script tag.')

    var _selectedDates = []

    var hdp = new Object();

    options = options || {}

    hdMoment.locale(options.locale || 'en', options.localeSettings || null)

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

        var found = selected.find(function(item) { return hdMoment(item.date).isSame(date, 'day') })

        return typeof found !== 'undefined'
    }

    var isMinimumDateCheck = function (date) {
        return hdp.minimumDate ? hdMoment(hdp.minimumDate).isAfter(date, 'day') : false
    }

    var isMaximumCheck = function(date) {
        return hdp.maximumDate ? hdMoment(hdp.maximumDate).isBefore(date, 'day') : false
    }

    var isDisabledCheck = function(date) {
        return hdp.disabledDates.findIndex(function(item) { return hdMoment(item).isSame(date, 'day') }) !== -1
    }

    var createHdpDate = function (date) {
        var momentDate = hdMoment(date)
        var day = date.getDay()
        var month = date.getMonth()

        var isMinimum = isMinimumDateCheck(date)
        var isMaximum = isMaximumCheck(date)
        var isDisabled = isDisabledCheck(date)
        var isActive = !isMinimum && !isMaximum && !isDisabled

        return {
            date: date,
            formatted: momentDate.format(hdp.dateFormat),
            weekNumber: momentDate.format('W'),
            isActive: isActive,
            isSelected: isSelectedCheck(date),
            isMinimumDate: isMinimum,
            isMaximumDate: isMaximum,
            isDisabled: isDisabled
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

    hdp.getDatepicker = function (startDate, endDate) {
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

if(module && module.exports) module.exports = headlessDatepicker