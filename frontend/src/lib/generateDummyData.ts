export const generateDummyData = (dateRange: [Date | null, Date | null]) => {
    // Implement date-based data generation here
    // For example, adjust metrics based on date range duration
    const isFullYear = !dateRange[0] && !dateRange[1]

    return {
        metrics: {
            totalCourses: isFullYear ? 120 : 60,
            completedCourses: isFullYear ? 80 : 40,
            inProgressCourses: isFullYear ? 25 : 12,
        },
        barLabels: isFullYear
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        barValues: isFullYear
            ? [5, 10, 8, 15, 12, 20, 18, 22, 16, 14, 9, 11]
            : [15, 20, 18, 22],
        lineLabels: isFullYear
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        lineValues: isFullYear
            ? [10, 12, 8, 15, 9, 14]
            : [5, 8, 6, 9, 7]
    }
}