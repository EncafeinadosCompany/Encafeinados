export function combineDateTime(date: Date, timeString: string): string {
    const [hours, minutes] = timeString.split(":").map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, 0, 0)
    return newDate.toISOString()
}