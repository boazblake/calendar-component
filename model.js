import eachDayOfInterval from "date-fns/eachDayOfInterval"
import endOfISOWeek from "date-fns/endOfISOWeek"
import endOfMonth from "date-fns/endOfMonth"
import isSameMonth from "date-fns/isSameMonth"
import startOfISOWeek from "date-fns/startOfISOWeek"
import startOfMonth from "date-fns/startOfMonth"
import eachWeekOfInterval from "date-fns/eachWeekOfInterval"
import format from "date-fns/format"
import differenceInMonths from "date-fns/differenceInMonths"
import parseISO from "date-fns/parseISO"
import { jsonp } from "mithril"

export const root = document.getElementById("app")

export const shortDate = (date = new Date()) =>
  new Date(date).toISOString().split("T")[0]

const isLeapYear = (year) =>
  year % 4 == 0
    ? false
    : year % 100 == 0
    ? year % 400 == 0
      ? true
      : false
    : false

export const daysOfTheWeek = [
  "Sunday",
  "Monday",
  "Teusday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const monthsOfTheYear = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const pad0Left = (num) => `0${num}`

const updateYear = (year, dir) => (parseInt(year) + dir).toString()

const daysInMonth = (month, year) =>
  new Date(parseInt(year), parseInt(month) + 1, 0).getDate()

const updateMonth = (month, dir) =>
  (parseInt(month) + dir).toString().length == 1
    ? pad0Left((parseInt(month) + dir).toString())
    : (parseInt(month) + dir).toString()

export const updateMonthDto = (year, month, day, dir) => {
  let _year = year
  let _month = updateMonth(month, dir)
  let _day = day || "01"

  if (_month >= 13) {
    _year = updateYear(_year, dir)
    _month = "01"
  }

  if (_month <= 0) {
    _year = updateYear(_year, dir)
    _month = "12"
  }

  return getModelDto(formatDateString(_year, _month, _day))
}

export const getMonthByIdx = (idx) =>
  idx >= 12
    ? monthsOfTheYear[0]
    : idx < 0
    ? monthsOfTheYear[11]
    : monthsOfTheYear[idx]

export const formatDateString = (year, month, day) => `${year}-${month}-${day}`

export const isCalenderDay = (date) => ({
  day: format(date, "dd"),
  dir: 0,
})

export const isNotCalenderDay = (day, date) => ({
  day: format(day, "dd"),
  dir: differenceInMonths(parseISO(shortDate(date)), day) == 0 ? -1 : +1,
})

export const createCalendarDayViewModel = (day, date, { isSameMonth }) =>
  isSameMonth ? isCalenderDay(day) : isNotCalenderDay(day, date)

export const getMountMatrix = ({ year, month }) => {
  const date = new Date(parseInt(year), parseInt(month - 1))

  const matrix = eachWeekOfInterval(
    {
      start: startOfMonth(date),
      end: endOfMonth(date),
    },
    { weekStartsOn: 1 }
  )

  return matrix.map((weekDay) =>
    eachDayOfInterval({
      start: startOfISOWeek(weekDay),
      end: endOfISOWeek(weekDay),
    }).map((day) =>
      createCalendarDayViewModel(day, date, {
        isSameMonth: isSameMonth(date, day),
      })
    )
  )
}

export const getModelDto = (date = shortDate()) => {
  let _date = shortDate(date).split("-")
  let today = shortDate().split("-")
  let year = _date[0]
  let month = _date[1]
  let day = _date[2]

  let dto = {
    isLeapYear: isLeapYear(year),
    startDate: date,
    selected: { year, month, day },
    today: {
      year: today[0],
      month: today[1],
      day: today[2],
    },
    year,
    month,
    day,
    daysInMonth: daysInMonth(month, year),
  }
  return dto
}

const isEqual = (a, b) => JSON.stringify(a) == JSON.stringify(b)

export const calendarDay = ({ today, selected }) => (currentDate, dir) => {
  if (dir !== 0) {
    return "notThisMonth"
  }

  if (
    isEqual(currentDate, today.day) &&
    isEqual(currentDate, selected.day) &&
    isEqual(selected.year, today.year)
  ) {
    return "selectedDay isToday"
  } else if (isEqual(currentDate, selected.day)) {
    return "selectedDay"
  } else if (
    isEqual(currentDate, today) &&
    isEqual(today.month, selected.month) &&
    isEqual(today.year, selected.year)
  ) {
    return "isToday"
  }
}
