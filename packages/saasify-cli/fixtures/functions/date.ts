type DateAlias = Date

/**
 * @param date1 First date
 */
export function playdate(date1: Date, date2: DateAlias): Date {
  return new Date(date2.getTime() - date1.getTime())
}
