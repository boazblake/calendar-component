import m from "mithril"
import {
  root,
  daysOfTheWeek,
  updateModelDto,
  formatDateString,
  getMountMatrix,
  getModelDto,
  calendarDayClass,
  getMonthByIdx,
} from "./model"

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

const MonthsToolbar = () => {
  return {
    view: ({ attrs: { mdl } }) => {
      // console.log(mdl)
      return m(".frow width-100  mt-10", [
        m("h1", mdl.data.year),
        m(".frow width-100 row-between mt-10", [
          m(
            ".button",
            {
              onclick: (e) => {
                mdl.data = updateModelDto(mdl, -1)
              },
            },
            getMonthByIdx(parseInt(mdl.data.month - 2))
          ),
          m(".text-underline", getMonthByIdx(parseInt(mdl.data.month) - 1)),
          m(
            ".button",
            {
              onclick: (e) => {
                mdl.data = updateModelDto(mdl, 1)
              },
            },
            getMonthByIdx(parseInt(mdl.data.month))
          ),
        ]),
      ])
    },
  }
}

const Calendar = () => {
  return {
    view: ({ attrs: { mdl } }) => {
      let dto = getMountMatrix(mdl.data)

      return m(".frow frow-container", [
        m(MonthsToolbar, { mdl }),
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
          ".frow centered-column width-100 row-between mt-10 ",
          dto.map((week) =>
            m(
              ".frow width-100",
              { class: "" },
              week.map(({ day, dir }) =>
                m(
                  ".col-xs-1-7 text-center",
                  {
                    onclick: (_) =>
                      (mdl.data = getModelDto(
                        formatDateString(
                          mdl.data.year,
                          mdl.data.month,
                          day,
                          dir
                        )
                      )),
                    class: calendarDayClass(mdl.data)(day, dir),
                  },
                  m("span.day", day)
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
