var moment = require('moment')

module.exports = function (options) {
    var _selectedDates = []

    var hdp = new Object();

    options = options || {}

    hdp.zeroBased = typeof options.zeroBased === 'undefined' ? true : options.zeroBased
    hdp.minimumDate = options.minimumDate || null
    hdp.maximumDate = options.maximumDate || null
    hdp.disabledDates = options.disabledDates || []

    hdp.localeSettings = options.localeSettings || {
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
        monthNames: [ 'January','February','March','April','May','June','July','August','September','October','November','December' ],
        monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
    }


    var createSelectedDate = function(date){

        // todo: fill in the blanks
        var settings = hdp.localeSettings
        var day = date.getDay()
        var month = date.getMonth()
        return {
            date: date,
            dateString: '',
            dayName: settings.dayNames[day],
            dayNameShort: settings.dayNamesShort[day],
            dayNameMin: settings.dayNamesMin[day],
            monthName: settings.monthNames[month],
            monthNameShort: settings.monthNamesShort[month],
            dayInWeek: 0,
            dayInMonth: 0,
            dayInYear: 0
        }
    }

    
    
    hdp.setSelectedDates = function (dates) { 
        _selectedDates = dates.map(function(date){ return createSelectedDate(date) }) 
        
    }

    hdp.getSelectedDates = function(){ return _selectedDates }

    hdp.setSelectedDate = function (date) { hdp.setSelectedDates([date]) }

    hdp.getSelectedDate = function() { return !_selectedDates.length ? null : _selectedDates[_selectedDates.length - 1] }

    return hdp
}