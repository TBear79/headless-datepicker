import * as moment from 'moment'

export namespace HeadlessDatepicker {
    export class Calendar {
        public selectedDates: Date[] = []
        private localMoment: any
        private monthOffset: number

        constructor(
            public options: Options = {}
        ) {
            options.locale = options.locale || 'en'
            options.disabledDates = options.disabledDates || []
            options.extras = options.extras || []
            options.calendarMode = options.calendarMode || 'fill'
            options.zeroBasedMonth = options.zeroBasedMonth === undefined ? false : options.zeroBasedMonth

            this.monthOffset = this.options.zeroBasedMonth ? 0 : 1

            this.localMoment = moment

            if (!this.localMoment) throw ('headlessDatepicker: momentjs is not available. Please do import or require(\'moment\') or reference it from a script tag.')
        }

        public getRange(startDate: Date, endDate: Date): DateItem[] {
            let dates = []
            let dateWorker = this.createHdpDate(startDate, false)

            while (dateWorker.moment.isSameOrBefore(endDate)) {
                dates.push(dateWorker)
                dateWorker = this.createHdpDate(this.addDay(dateWorker.moment.toDate()), false)
            }

            return dates
        }

        public getMonth(yearMonthPair: YearMonthPair): CalendarMonth {
            const startDate = this.hdMoment().year(yearMonthPair.year).month(yearMonthPair.month - this.monthOffset).date(1).toDate()
            const endDate = this.hdMoment().year(yearMonthPair.year).month(yearMonthPair.month - this.monthOffset).add(1, 'months').date(0).toDate()

            const range = this.getRange(startDate, endDate)

            const weekDays = this.getWeekDays(range)

            const weeks = this.getWeeks(range, this.options.calendarMode)

            const month = {
                weekDayInfo: weekDays,
                year: yearMonthPair.year,
                monthInfo: this.getMonthNames(range, this.monthOffset),
                weeks: weeks
            }

            return month
        }

        public getMonths(yearMonthPairs: YearMonthPair[]): CalendarMonth[] {
            return yearMonthPairs.map((item) => { return this.getMonth({ year: item.year, month: item.month }) })
        }

        // createMomentDay
        private hdMoment(date?: Date): moment.Moment {
            const m = this.localMoment(date)
            m.locale(this.options.locale, this.options.localeSettings)
            return m
        }

        // dateIsSelected
        private isSelectedCheck(date: Date): boolean {
            const found = this.selectedDates.find((item) => { return this.hdMoment(item).isSame(date, 'day') })

            return typeof found !== 'undefined'
        }

        // minimumDateIsReached
        private isMinimumDateCheck(date: Date): boolean {
            return this.options.minimumDate ? this.hdMoment(this.options.minimumDate).isAfter(date, 'day') : false
        }

        // maximumDateIsReached
        private isMaximumDateCheck(date: Date): boolean {
            return this.options.maximumDate ? this.hdMoment(this.options.maximumDate).isBefore(date, 'day') : false
        }

        // dateIsDisabled
        private isDisabledCheck(date: Date): boolean {
            return this.options.disabledDates.findIndex((item) => { return this.hdMoment(item).isSame(date, 'day') }) !== -1
        }

        // attachExtrasToDay
        private attachExtras(date: Date) {
            var extras = this.options.extras.filter((item) => { return this.hdMoment(item.date).isSame(date, 'day') })

            return extras.length == 0 ? null : extras[0].data
        }

        private createHdpDate(date: Date, isAdjacent: boolean): DateItem {
            const momentDate = this.hdMoment(date)
            const day = date.getDay()
            const month = date.getMonth()

            const isMinimum = this.isMinimumDateCheck(date)
            const isMaximum = this.isMaximumDateCheck(date)
            const isDisabled = this.isDisabledCheck(date)
            const isActive = !isMinimum && !isMaximum && !isDisabled
            return {
                moment: momentDate,
                isActive: isActive,
                isToday: momentDate.isSame(new Date(), 'day'), 
                isSelected: this.isSelectedCheck(date),
                isMinimumDate: isMinimum,
                isMaximumDate: isMaximum,
                isDisabled: isDisabled,
                isAdjacent: isAdjacent,
                extras: this.attachExtras(date)
            }
        }

        private createWeekItem(weekDates: DateItem[]): WeekItem {
            const firstDate = weekDates[0]
            return   {
                    weekOfYear: firstDate.moment.week(),
                    weekOfMonth: Math.ceil(firstDate.moment.date() / 7),
                    dates: weekDates
                }
        }

        private addDay(date: Date): Date {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        }

        private createAdjacentDateEntry(momentDate: moment.Moment, showAdjacentMonths: boolean): DateItem {
            return showAdjacentMonths ? this.createHdpDate(momentDate.toDate(), true) : null
        }

        private getWeekDays(range: DateItem[]): WeekDayInfo {
            const weekDays = {
                full: [],
                short: [],
                min: []
            }

            const firstDayOfWeekIndex = range.findIndex((item) => {
                return item.moment.weekday() == 0
            })

            for (let i = firstDayOfWeekIndex; i < firstDayOfWeekIndex + 7; i++) {
                const day = range[i].moment

                weekDays.full.push(day.format('dddd'))
                weekDays.short.push(day.format('ddd'))
                weekDays.min.push(day.format('dd'))
            }

            return weekDays
        }

        private getMonthNames(range: DateItem[], monthOffset: number): MonthInfo {
            
            const firstDayOfMonth = range.find((item) => {
                return item && item.isAdjacent == false
            })
            return {
                number: firstDayOfMonth.moment.month() + monthOffset,
                full: firstDayOfMonth.moment.format('MMMM'),
                short: firstDayOfMonth.moment.format('MMM')
            }
        }

        private getAdjacentBefore(momentDate: moment.Moment, showAdjacentMonths: boolean): DateItem[] {
            const dayOfWeek = momentDate.weekday()
            const clonedDate = momentDate.clone()

            clonedDate.subtract(dayOfWeek, 'days')

            const dates = []

            while (clonedDate.isBefore(momentDate)) {
                dates.push(this.createAdjacentDateEntry(clonedDate, showAdjacentMonths))
                clonedDate.add(1, 'day')
            }

            return dates
        }

        private getAdjacentAfter(momentDate: moment.Moment, showAdjacentMonths: boolean): DateItem[] {
            const dayOfWeek = momentDate.weekday()
            const clonedDate = momentDate.clone()

            clonedDate.add(6 - dayOfWeek, 'days')

            const dates = []

            while (clonedDate.isAfter(momentDate)) {
                dates.push(this.createAdjacentDateEntry(clonedDate, showAdjacentMonths))
                clonedDate.subtract(1, 'day')
            }

            dates.reverse()

            return dates
        }

        private getLastWeekNumberInYear(range: DateItem[]): number {
            const lastDayInLastWeek = [...range].reverse().find(d => d.moment.week() !== 1)
                           
            return lastDayInLastWeek.moment.week()
        }

        private splitIntoWeeks(range: DateItem[]): WeekItem[] {
            const weeks: WeekItem[] = []

            let startWeekNumber = range[0].moment.week()
            let endWeekNumber = range[range.length - 1].moment.week()
            let newYear = false

            if (endWeekNumber == 1) {
                endWeekNumber = this.getLastWeekNumberInYear(range)
                endWeekNumber++
                newYear = true
            }

            for (var i = startWeekNumber; i <= endWeekNumber; i++) {
                const compareWeek = newYear && i == endWeekNumber ? 1 : i
                const weekDates: DateItem[] = range.filter(function (r) { return r.moment.week() == compareWeek });
                weeks.push(this.createWeekItem(weekDates))
            }


            return weeks
        }

        private exactMode(range: DateItem[]): WeekItem[] {
            return this.splitIntoWeeks(range)
        }

        private fillMode(range: DateItem[], showAdjacentMonths: boolean): WeekItem[] {
            var weeks = this.splitIntoWeeks(range)
            var lastWeekIndex = weeks.length - 1

            weeks[0].dates = this.getAdjacentBefore(range[0].moment, showAdjacentMonths).concat(weeks[0].dates)

            weeks[lastWeekIndex].dates = weeks[lastWeekIndex].dates.concat(this.getAdjacentAfter(range[range.length - 1].moment, showAdjacentMonths))

            return weeks
        }

        private adjacentMode(range: DateItem[]): WeekItem[] {
            return this.fillMode(range, true)
        }

        private fixedMode(range: DateItem[]): WeekItem[] {
            const weeks = this.adjacentMode(range)
            while (weeks.length < 6) {
                const lastDay = weeks[weeks.length - 1].dates.slice(-1)[0].moment.clone()
                const nextDay = lastDay.add(1, 'day')
                const newWeek = this.getAdjacentAfter(nextDay, true)

                // getAdjacentAfter only works with dates AFTER the the date passed. So we have to place the new date at the beginning
                newWeek.unshift(this.createAdjacentDateEntry(nextDay, true))

                weeks.push(this.createWeekItem(newWeek))
            }
            return weeks
        }

        private getWeeks(range: DateItem[], mode: CalendarMode): WeekItem[] {
            const showAdjacentMonths = false

            switch (mode) {
                case 'exact':
                    return this.exactMode(range)
                case 'adjacent':
                    return this.adjacentMode(range)
                case 'fill':
                    return this.fillMode(range, false)
                case 'fixed':
                    return this.fixedMode(range)
                default:
                    throw new Error('Invalid mode: ' + mode)
            }
        }

    }

    export interface Options {
        locale?: string
        localeSettings?: any
        minimumDate?: Date
        maximumDate?: Date
        disabledDates?: Date[]
        extras?: ExtraInfo[],
        calendarMode?: CalendarMode,
        zeroBasedMonth?: boolean
    }

    export interface WeekItem {
        weekOfYear: number,
        weekOfMonth: number,
        dates: DateItem[]
    }

    export interface DateItem {
        moment: moment.Moment,
        isActive: boolean,
        isToday: boolean,
        isSelected: boolean,
        isMinimumDate: boolean,
        isMaximumDate: boolean,
        isDisabled: boolean,
        isAdjacent: boolean,
        extras: any
    }

    export interface CalendarMonth {
        weekDayInfo: WeekDayInfo
        year: number
        monthInfo: MonthInfo
        weeks: WeekItem[]
    }

    export interface WeekDayInfo {
        full: string[]
        short: string[]
        min: string[]
    }

    export interface MonthInfo {
        number: number
        full: string
        short: string
    }

    export interface YearMonthPair {
        year: number
        month: number
    }

    export interface ExtraInfo {
        date: Date,
        data: any
    }

    export type CalendarMode = 'exact' | 'adjacent' | 'fill' | 'fixed'
}

