import * as moment from 'moment'

export namespace HeadlessDatepicker {
    export class Calendar {
        private selectedDates: DateItem[] = []
        private localMoment: any

        constructor(
            public options: Options = {}
        ) {
            options.locale = options.locale || 'en'
            options.disabledDates = options.disabledDates || []
            options.extras = options.extras || []

            this.localMoment = moment

            if (!this.localMoment) throw ('headlessDatepicker: momentjs is not available. Please do import or require(\'moment\') or reference it from a script tag.')
        }

        public setSelectedDates(dates: Date[]) {
            this.selectedDates = dates.map((date) => { return this.createHdpDate(date, false) })
        }
        public getSelectedDates(): DateItem[] { return this.selectedDates }

        public getRange(startDate: Date, endDate: Date): DateItem[] {
            let dates = []
            let dateWorker = this.createHdpDate(startDate, false)

            while (dateWorker.day.isSameOrBefore(endDate)) {
                dates.push(dateWorker)
                dateWorker = this.createHdpDate(this.addDay(dateWorker.day.toDate()), false)
            }

            return dates
        }

        public getMonth(year: number, month: number, mode: HdpCalendarMode = 'fill', oneBasedMonth: boolean = false): MonthItem {
            const monthOffset = oneBasedMonth ? 1 : 0
            const startDate = this.hdMoment().year(year).month(month - monthOffset).date(1).toDate()
            const endDate = this.hdMoment().year(year).month(month - monthOffset).add(1, 'months').date(0).toDate()

            const range = this.getRange(startDate, endDate)

            const weekDays = this.getWeekDays(range)

            const weeks = this.getWeeks(range, mode)

            const calendar = {
                weekDayInfo: weekDays,
                year: year,
                monthInfo: this.getMonthNames(range, monthOffset),
                weeks: weeks
            }

            return calendar
        }

        public getMonths(months: YearMonthPair[], mode: HdpCalendarMode, oneBasedMonth: boolean): MonthItem[] {
            return months.map((item) => { return this.getMonth(item.year, item.month, mode, oneBasedMonth) })
        }

        // createMomentDay
        private hdMoment(date?: Date): moment.Moment {
            const m = this.localMoment(date)
            m.locale(this.options.locale, this.options.localeSettings)
            return m
        }

        // dateIsSelected
        private isSelectedCheck(date: Date): boolean {
            const selected = this.getSelectedDates()

            const found = selected.find((item) => { return this.hdMoment(item.day.toDate()).isSame(date, 'day') })

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
                day: momentDate,
                isActive: isActive,
                isSelected: this.isSelectedCheck(date),
                isMinimumDate: isMinimum,
                isMaximumDate: isMaximum,
                isDisabled: isDisabled,
                isAdjacent: isAdjacent,
                extras: this.attachExtras(date)
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
                return item.day.weekday() == 0
            })

            for (let i = firstDayOfWeekIndex; i < firstDayOfWeekIndex + 7; i++) {
                const day = range[i].day

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
                number: firstDayOfMonth.day.month() + monthOffset,
                full: firstDayOfMonth.day.format('MMMM'),
                short: firstDayOfMonth.day.format('MMM')
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

        private splitIntoWeeks(range: DateItem[]): DateItem[][] {
            const weeks = []

            let startWeekNumber = range[0].day.week()
            let endWeekNumber = range[range.length - 1].day.week()
            let newYear = false

            if (startWeekNumber > endWeekNumber) {
                endWeekNumber = range[range.length - 2].day.week() + 1
                newYear = true
            }

            for (var i = startWeekNumber; i <= endWeekNumber; i++) {
                const compareWeek = newYear && i == endWeekNumber ? 1 : i

                weeks.push(range.filter(function (r) { return r.day.week() == compareWeek }))
            }

            return weeks
        }

        private exactMode(range: DateItem[]): DateItem[][] {
            return this.splitIntoWeeks(range)
        }

        private fillMode(range: DateItem[], showAdjacentMonths: boolean): DateItem[][] {
            var weeks = this.splitIntoWeeks(range)
            var lastWeekIndex = weeks.length - 1

            weeks[0] = this.getAdjacentBefore(range[0].day, showAdjacentMonths).concat(weeks[0])

            weeks[lastWeekIndex] = weeks[lastWeekIndex].concat(this.getAdjacentAfter(range[range.length - 1].day, showAdjacentMonths))

            return weeks
        }

        private adjacentMode(range: DateItem[]): DateItem[][] {
            return this.fillMode(range, true)
        }

        private fixedMode(range: DateItem[]): DateItem[][] {
            const weeks = this.adjacentMode(range)
            while (weeks.length < 6) {
                const lastDay = weeks[weeks.length - 1].slice(-1)[0].day.clone()
                const nextDay = lastDay.add(1, 'day')
                const newWeek = this.getAdjacentAfter(nextDay, true)

                // getAdjacentAfter only works with dates AFTER the the date passed. So we have to place the new date at the beginning
                newWeek.unshift(this.createAdjacentDateEntry(nextDay, true))

                weeks.push(newWeek)
            }
            return weeks
        }

        private getWeeks(range: DateItem[], mode: HdpCalendarMode): DateItem[][] {
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
        extras?: ExtraInfo[]
    }

    export interface DateItem {
        day: moment.Moment,
        isActive: boolean,
        isSelected: boolean,
        isMinimumDate: boolean,
        isMaximumDate: boolean,
        isDisabled: boolean,
        isAdjacent: boolean,
        extras: any
    }

    export interface MonthItem {
        weekDayInfo: WeekDayInfo
        year: number
        monthInfo: MonthInfo
        weeks: DateItem[][]
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

    export type HdpCalendarMode = 'exact' | 'adjacent' | 'fill' | 'fixed'
}

