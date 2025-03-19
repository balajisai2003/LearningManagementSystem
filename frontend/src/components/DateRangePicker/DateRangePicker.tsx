import { X } from 'lucide-react';
import React, { FC, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
    dateRange: [Date | null, Date | null]
    setDateRange: React.Dispatch<SetStateAction<[Date | null, Date | null]>>
}

const DateRangePicker: FC<DateRangePickerProps> = ({ dateRange, setDateRange }) => {
    const [startDate, endDate] = dateRange;

    const clearDates = () => {
        setDateRange([null, null]);
    };

    return (
        <div className="flex items-center space-x-1">
            <DatePicker
                selected={startDate}
                onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                showYearDropdown
                placeholderText="Select Date Range"
                className="border p-2 rounded w-[250px]"
            />
            <button
                onClick={clearDates}
                className="flex items-center justify-center p-2 bg-black text-white rounded-lg transition duration-200"
                aria-label="Clear Dates"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default DateRangePicker;
