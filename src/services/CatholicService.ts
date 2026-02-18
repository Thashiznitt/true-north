export interface CatholicEvent {
    name: string;
    date: string; // ISO format YYYY-MM-DD
    type: 'feast' | 'solemnity' | 'season_start';
}

export const CATHOLIC_DATES_2026: CatholicEvent[] = [
    { name: 'Ash Wednesday', date: '2026-02-18', type: 'season_start' },
    { name: 'Saint Patrick', date: '2026-03-17', type: 'feast' },
    { name: 'Saint Joseph', date: '2026-03-19', type: 'solemnity' },
    { name: 'Easter Sunday', date: '2026-04-05', type: 'solemnity' },
    { name: 'Ascension of the Lord', date: '2026-05-14', type: 'solemnity' },
    { name: 'Pentecost Sunday', date: '2026-05-24', type: 'solemnity' },
    { name: 'The Most Holy Trinity', date: '2026-05-31', type: 'solemnity' },
    { name: 'Corpus Christi', date: '2026-06-07', type: 'solemnity' },
    { name: 'Sacred Heart of Jesus', date: '2026-06-12', type: 'solemnity' },
    { name: 'Assumption of Mary', date: '2026-08-15', type: 'solemnity' },
    { name: 'All Saints Day', date: '2026-11-01', type: 'solemnity' }, // Fix year to 2026 below
    { name: 'All Souls Day', date: '2026-11-02', type: 'feast' },
    { name: 'Solemnity of Mary, Mother of God', date: '2026-01-01', type: 'solemnity' },
    { name: 'Epiphany of the Lord', date: '2026-01-04', type: 'solemnity' },
    { name: 'Immaculate Conception', date: '2026-12-08', type: 'solemnity' },
    { name: 'Christmas Day', date: '2026-12-25', type: 'solemnity' },
];

export const CatholicService = {
    getEventsForMonth: (month: number, year: number = 2026) => {
        return CATHOLIC_DATES_2026.filter(event => {
            const date = new Date(event.date);
            return date.getMonth() === month && date.getFullYear() === year;
        });
    },

    getEventForDate: (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return CATHOLIC_DATES_2026.find(event => event.date === dateStr);
    },

    isSignificantCatholicDate: (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return CATHOLIC_DATES_2026.some(event => event.date === dateStr);
    }
};
