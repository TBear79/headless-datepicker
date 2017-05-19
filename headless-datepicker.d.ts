

declare class HeadlessDatepicker {
    constructor(options?: HeadlessDatepicker.HeadlessDatepickerOptions);
    
    setSelectedDates(dates: Date[]);
    getSelectedDates(): Date[];
}

declare module 'HeadlessDatepicker' {

    export interface HeadlessDatepickerOptions {
        locale: string;
        localSettings: any;
        minimumDate: Date;
        maximumDate: Date;
        disabledDates: Date[];
        extras: any
    }

    export interface HeadlessDatepickerResult {
        
    }
}