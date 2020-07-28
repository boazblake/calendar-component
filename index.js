import eachDayOfInterval from "date-fns/eachDayOfInterval"
import endOfISOWeek from "date-fns/endOfISOWeek"
import endOfMonth from "date-fns/endOfMonth"
import isSameMonth from "date-fns/isSameMonth"
import startOfISOWeek from "date-fns/startOfISOWeek"
import startOfMonth from "date-fns/startOfMonth"
import eachWeekOfInterval from "date-fns/eachWeekOfInterval"
import format from "date-fns/format"
import getWeekOfMonth from "date-fns/getWeekOfMonth"

import m from "mithril"

const root = document.getElementById("app")

const daysOfTheWeek = [
  "Sunday",
  "Monday",
  "Teusday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const convertDate = (day, { isSameMonth }) =>
  isSameMonth ? format(day, "dd") : "--"

const getMountMatrix = ({ year, month }) => {
  const date = new Date(year, month)

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
      convertDate(day, {
        isSameMonth: isSameMonth(date, day),
      })
    )
  )
}

const getModelDto = (date = new Date().toISOString().split("T")[0]) => {
  console.log("DATE", date)
  let _date = date.split("-")
  let year = _date[0]
  let month = _date[1]
  let week = getWeekOfMonth(_date)
  let day = _date[2]

  let dto = {
    selectedDate: date,
    today: new Date().toISOString().split("T")[0],
    year,
    month,
    week,
    day,
  }
  console.log("dto", dto)
  return dto
}

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(".toolbar", [
        m("input", {
          onchange: (e) => (mdl.data = getModelDto(e.target.value)),
          type: "date",
          value: mdl.data.selectedDate,
        }),
      ]),
  }
}

const calendarDayClass = ({ today, day, month }) => (currentDate) => {
  // console.log("day", day)
  // console.log("currentDate", currentDate)
  // console.log("today", today.split("-")[2])

  // console.log("currentDate == day", currentDate == day)
  // console.log("currentDate == day", currentDate == today.split("-")[2])

  if (currentDate == today.split("-")[2] && currentDate == day) {
    return "selectedDay isToday"
  } else if (currentDate == day) {
    return "isSelected"
  } else if (
    currentDate == today.split("-")[2] &&
    month == today.split("-")[1]
  ) {
    return "isToday"
  }
}

const Calendar = () => {
  return {
    view: ({ attrs: { mdl } }) => {
      let dto = getMountMatrix(mdl.data)
      return m(".frow frow-container", [
        m(
          ".frow width-100 row-between mt-10",
          daysOfTheWeek.map((day) =>
            m(
              ".col-xs-1-7 text-center",
              m(
                "span.width-auto",

                day[0].toUpperCase()
              )
            )
          )
        ),
        m(
          ".frow centered-column width-100 row-between mt-10",
          dto.map((week) =>
            m(
              ".frow width-100",
              { class: "" },
              week.map((day) =>
                m(
                  ".col-xs-1-7 text-center",
                  {
                    onclick: (_) =>
                      (mdl.data = getModelDto(
                        `${mdl.data.year}-${mdl.data.month}-${day}`
                      )),
                    class:
                      // console.log(
                      calendarDayClass(mdl.data)(day),
                    // ),
                  },
                  day
                )
              )
            )
          )
        ),
      ])
    },
  }
}

const App = (mdl) => {
  return {
    view: () => m(".app", [m(Toolbar, { mdl }), m(Calendar, { mdl })]),
  }
}

const model = {
  data: getModelDto(),
}

m.mount(root, App(model))
