import m from "mithril"
import {
  root,
  daysOfTheWeek,
  updateMonthDto,
  getMountMatrix,
  getModelDto,
  calendarDay,
  getMonthByIdx,
  formatDateString,
} from "./model"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(".toolbar", [
        m("input", {
          onchange: (e) => (mdl.data = getModelDto(e.target.value)),
          type: "date",
          value: mdl.data.startDate,
        }),
        m(
          "button.width-100",
          { onclick: (_) => (mdl.data = getModelDto()) },
          "Today"
        ),
      ]),
  }
}

const MonthsToolbar = () => {
  return {
    view: ({ attrs: { mdl } }) => {
      // console.log(mdl)
      return m(".frow width-100  mt-10", [
        m(".frow width-100 row-between mt-10", [
          m(
            "button.prevMonth",
            m(
              "h3",
              {
                onclick: (_) => {
                  mdl.data = getModelDto(
                    formatDateString(
                      parseInt(mdl.data.selected.year) - 1,
                      mdl.data.selected.month,
                      mdl.data.selected.day
                    )
                  )
                },
              },
              parseInt(mdl.data.selected.year) - 1
            )
          ),
          m(".centerMonthGroup", [
            m(
              "h2.currentMonth",
              getMonthByIdx(parseInt(mdl.data.selected.month) - 1)
            ),
            m("h3.text-center", parseInt(mdl.data.selected.year)),
          ]),
          m(
            "button.nextMonth",
            m(
              "h3",
              {
                onclick: (_) => {
                  mdl.data = getModelDto(
                    formatDateString(
                      parseInt(mdl.data.selected.year) + 1,
                      mdl.data.selected.month,
                      mdl.data.selected.day
                    )
                  )
                },
              },
              parseInt(mdl.data.selected.year) + 1
            )
          ),
        ]),
        m(".frow width-100 row-between mt-10", [
          m(
            "button",
            {
              onclick: (_) => {
                mdl.data = updateMonthDto(
                  mdl.data.selected.year,
                  mdl.data.selected.month,
                  null,
                  -1
                )
              },
            },
            m("h4", getMonthByIdx(parseInt(mdl.data.selected.month - 2)))
          ),

          m(
            "button",
            {
              onclick: (_) => {
                mdl.data = updateMonthDto(
                  mdl.data.selected.year,
                  mdl.data.selected.month,
                  null,
                  1
                )
              },
            },
            m("h4", getMonthByIdx(parseInt(mdl.data.selected.month)))
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
                      (mdl.data = updateMonthDto(
                        mdl.data.selected.year,
                        mdl.data.selected.month,
                        day,
                        dir
                      )),
                    class: calendarDay(mdl.data)(day, dir),
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
