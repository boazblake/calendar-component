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

export const updateModelDto = (mdl, dir) => {
  let year = mdl.data.year
  let month = updateMonth(mdl.data.month, dir)
  let day = "01"

  if (month >= 13) {
    year = updateYear(year, dir)
    month = "01"
  }

  if (month <= 0) {
    year = updateYear(year, dir)
    month = "12"
  }

  return getModelDto(formatDateString(year, month, day))
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

export const isNotCalenderDay = (date) => ({
  day: format(date, "dd"),
  dir: differenceInMonths(date, parseISO(shortDate())) == 0 ? -1 : +1,
})

export const createCalendarDayViewModel = (day, { isSameMonth }) =>
  isSameMonth ? isCalenderDay(day) : isNotCalenderDay(day)

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
      createCalendarDayViewModel(day, {
        isSameMonth: isSameMonth(date, day),
      })
    )
  )
}

export const getModelDto = (date = shortDate()) => {
  let _date = shortDate(date).split("-")
  let year = _date[0]
  let month = _date[1]
  let day = _date[2]

  let dto = {
    isLeapYear: isLeapYear(year),
    selectedDate: date,
    today: shortDate(),
    year,
    month,
    day,
    daysInMonth: daysInMonth(month, year),
  }
  return dto
}

export const isTodayClass = (currentDate, today) =>
  currentDate == today.split("-")[2]

export const isThisMonthClass = (currentDate, today) => currentDate == today

export const calendarDayClass = ({ today, day, month }) => (
  currentDate,
  dir
) => {
  if (dir !== 0) {
    return "notThisMonth"
  }
  if (isTodayClass(currentDate, today) && isThisMonthClass(currentDate, day)) {
    return "selectedDay isToday"
  } else if (isThisMonthClass(currentDate, day)) {
    return "selectedDay"
  } else if (isTodayClass(currentDate, today) && month == today.split("-")[1]) {
    return "isToday"
  }
}
