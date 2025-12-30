import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import type { DatesSetArg } from "@fullcalendar/core";

import {
  DayPicker,
  useDayPicker,
  getDefaultClassNames,
  type MonthCaptionProps,
} from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@fullcalendar/daygrid/index.cjs";

import { ko } from "date-fns/locale";
import {
  addDays,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";

import Sidebar from "../../../../shared/ui/Sidebar/Sidebar";

type ViewMode = "month" | "week";

type EventTask = { id: string; label: string; done?: boolean };
type EventItem = {
  id: string;
  title: string;
  start: string; 
  end?: string; 
  color: string; 
  tags?: string[];
  tasks?: EventTask[];
};

type TodoCard = {
  id: string;
  title: string;
  items: string[];
};

const DUMMY_EVENTS: EventItem[] = [
  { id: "1", title: "Scelerisque mauris", start: "2025-05-05", color: "#F1B7B4" },
  {
    id: "2",
    title: "Convallis egestas in aliquet",
    start: "2025-05-05",
    end: "2025-05-08",
    color: "#A9AFB7",
  },
  { id: "3", title: "Fringilla arcu donec", start: "2025-05-15", color: "#F1726A" },
  { id: "4", title: "Turpis venenatis bibendum", start: "2025-05-19", color: "#2D3436" },
  { id: "5", title: "Nibh", start: "2025-05-23", color: "#BFEFF0" },

  {
    id: "w1",
    title: "Massa volutpat",
    start: "2025-05-12",
    color: "#00BDBD",
    tags: ["회의준비", "문서작업"],
    tasks: [{ id: "t1", label: "Vitae sed", done: true }],
  },
  {
    id: "w2",
    title: "Nunc maecenas",
    start: "2025-05-13",
    color: "#00BDBD",
    tags: ["회의준비", "백엔드"],
  },
  {
    id: "w3",
    title: "In elementum",
    start: "2025-05-14",
    color: "#00BDBD",
    tags: ["프론트", "리팩터링"],
  },
  {
    id: "w4",
    title: "Morbi lacus",
    start: "2025-05-15",
    color: "#00BDBD",
    tags: ["디자인", "정리"],
  },
  {
    id: "w5",
    title: "Pulvinar at",
    start: "2025-05-16",
    color: "#00BDBD",
    tags: ["테스트", "배포"],
  },
  {
    id: "w6",
    title: "Massa volutpat",
    start: "2025-05-15",
    end: "2025-05-16",
    color: "#00BDBD",
    tags: ["회의준비", "백엔드"],
    tasks: [
      { id: "t2", label: "Bibendum urna", done: true },
      { id: "t3", label: "Viverra tortor", done: false },
      { id: "t4", label: "Potenti porttitor", done: false },
      { id: "t5", label: "Justo fermentum", done: false },
      { id: "t6", label: "Urna sodales", done: false },
    ],
  },
];

const DUMMY_TODOS: TodoCard[] = [
  {
    id: "td1",
    title: "Morbi lacus",
    items: [
      "Tortor viverra",
      "Ultricies varius",
      "Orci sociis",
      "Rhoncus mattis",
      "Aliquam nunc",
      "Nec nisl",
      "Posuere id",
    ],
  },
  { id: "td2", title: "Volutpat cursus", items: ["Fermentum a", "Sed tincidunt", "Eget euismod"] },
  { id: "td3", title: "Diam eget", items: ["Bibendum urna", "Viverra tortor", "Potenti porttitor", "Justo fermentum"] },
];

function toDate(iso: string) {
  return parseISO(iso);
}

function isInEventRange(day: Date, e: EventItem) {
  const s = toDate(e.start);
  if (!e.end) return isSameDay(day, s);
  const endInclusive = toDate(e.end);
  return isWithinInterval(day, { start: s, end: endInclusive });
}

function formatRange(e: EventItem) {
  const s = toDate(e.start);
  if (!e.end) return format(s, "yyyy.MM.dd", { locale: ko });
  const end = toDate(e.end);
  return `${format(s, "yyyy.MM.dd", { locale: ko })} - ${format(end, "yyyy.MM.dd", { locale: ko })}`;
}

function pickTextColor(hex: string) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return "#111827";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.72 ? "#111827" : "#FFFFFF";
}

function ArrowRight() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#DDE7E7] text-[#0F172A]">
      ›
    </span>
  );
}

function WeekHeader({
  selectedDate,
  onSelectDay,
}: {
  selectedDate: Date;
  onSelectDay: (d: Date) => void;
}) {
  const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const days = new Array(7).fill(0).map((_, i) => addDays(start, i));
  const dow = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="grid grid-cols-7 gap-0 border-b border-[#9FE7E7]">
      {days.map((d, idx) => {
        const active = isSameDay(d, selectedDate);
        return (
          <button
            key={d.toISOString()}
            onClick={() => onSelectDay(d)}
            className={[
              "py-3 text-center transition",
              active ? "bg-[#E6FAFA]" : "bg-white hover:bg-[#F4FEFE]",
            ].join(" ")}
          >
            <div className="text-xs text-[#0F172A] font-semibold">{dow[idx]}</div>
            <div className="text-xs text-[#0F172A] mt-1">{format(d, "d")}</div>
          </button>
        );
      })}
    </div>
  );
}

function WeekBoard({
  selectedDate,
  events,
}: {
  selectedDate: Date;
  events: EventItem[];
}) {
  const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const days = new Array(7).fill(0).map((_, i) => addDays(start, i));

  return (
    <div className="grid grid-cols-7 gap-6 pt-4">
      {days.map((d) => {
        const dayEvents = events.filter((e) => isInEventRange(d, e));
        return (
          <div key={d.toISOString()} className="min-w-[160px]">
            <div className="space-y-3">
              {dayEvents.map((e) => (
                <div
                  key={`${e.id}-${format(d, "yyyy-MM-dd")}`}
                  className="bg-white rounded-xl border border-[#00BDBD] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-[#0F172A] truncate">
                      {e.title}
                    </div>
                    <ArrowRight />
                  </div>

                  <div className="text-[11px] text-[#9CA3AF] mt-1">
                    {formatRange(e)}
                  </div>

                  {e.tasks && e.tasks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {e.tasks.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center gap-2 text-[11px]">
                          <span
                            className={[
                              "inline-flex w-3 h-3 rounded-sm border",
                              t.done
                                ? "bg-[#00BDBD] border-[#00BDBD]"
                                : "bg-white border-[#B8D9D9]",
                            ].join(" ")}
                          />
                          <span className="text-[#0F172A] truncate">{t.label}</span>
                        </div>
                      ))}
                      {e.tasks.length > 5 && (
                        <div className="text-[11px] text-[#9CA3AF]">…</div>
                      )}
                    </div>
                  )}

                  {e.tags && e.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {e.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-[2px] rounded-full text-[10px] bg-[#DDF7F7] text-[#00A9A9]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MainForm() {
  const defaultClassNames = getDefaultClassNames();
  const calendarRef = useRef<FullCalendar | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const isMonth = viewMode === "month";

  const [selectedDate, setSelectedDate] = useState<Date>(parseISO("2025-05-15"));
  const [month, setMonth] = useState<Date>(parseISO("2025-05-01"));
  const [currentTitle, setCurrentTitle] = useState<string>(
    format(parseISO("2025-05-01"), "yyyy.MM", { locale: ko })
  );

  const events = useMemo(() => DUMMY_EVENTS, []);

  const selectedDayEvents = useMemo(() => {
    return events.filter((e) => isInEventRange(selectedDate, e));
  }, [selectedDate, events]);

  const fcEvents = useMemo(() => {
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end ? format(addDays(toDate(e.end), 1), "yyyy-MM-dd") : undefined,
      extendedProps: { color: e.color },
    }));
  }, [events]);

  const goPrev = () => calendarRef.current?.getApi().prev();
  const goNext = () => calendarRef.current?.getApi().next();

  const changeView = (mode: ViewMode) => {
    setViewMode(mode);
    calendarRef.current?.getApi().changeView(
      mode === "month" ? "dayGridMonth" : "dayGridWeek"
    );
  };

  const onDatesSet = (_: DatesSetArg) => {
    const date = calendarRef.current?.getApi().getDate() ?? new Date();
    setCurrentTitle(format(date, "yyyy.MM", { locale: ko }));
    setMonth(date);
  };

  const onDateClick = (info: DateClickArg) => {
    setSelectedDate(info.date);
    setMonth(info.date);
  };

  return (
    <div className="flex h-screen bg-[#FFFFFF]">
      <Sidebar active="Calendar" />

      <main className="flex-1 overflow-hidden">
        <div className="grid grid-cols-[320px_1fr] gap-10 h-full px-10">
          <section className="pt-6 flex flex-col gap-6 min-h-0">
            <div className="bg-white">
              <DayPicker
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={selectedDate}
                onSelect={(day) => {
                  if (!day) return;
                  setSelectedDate(day);
                  setMonth(day);
                  if (isMonth) {
                    calendarRef.current?.getApi().gotoDate(day);
                  }
                }}
                weekStartsOn={0}
                locale={ko}
                hideNavigation
                components={{
                  MonthCaption: (props: MonthCaptionProps) => {
                    const { previousMonth, nextMonth, goToMonth } = useDayPicker();
                    const curr = props.calendarMonth.date;

                    return (
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <button
                          type="button"
                          onClick={() => previousMonth && goToMonth(previousMonth)}
                          disabled={!previousMonth}
                          className="w-7 h-7 rounded-full text-gray-500 hover:text-[#00BDBD] disabled:opacity-30"
                        >
                          ‹
                        </button>
                        <span className="font-semibold text-[#00BDBD] text-sm">
                          {format(curr, "yyyy.MM", { locale: ko })}
                        </span>
                        <button
                          type="button"
                          onClick={() => nextMonth && goToMonth(nextMonth)}
                          disabled={!nextMonth}
                          className="w-7 h-7 rounded-full text-gray-500 hover:text-[#00BDBD] disabled:opacity-30"
                        >
                          ›
                        </button>
                      </div>
                    );
                  },
                }}
                classNames={{
                  ...defaultClassNames,
                  month: "w-full",
                  head_row: "mb-1",
                  head_cell: "text-center text-[11px] text-gray-400 font-semibold",
                  row: "mt-1",
                  cell: "text-center",
                  day: "w-9 h-9 mx-auto rounded-full hover:bg-gray-50",
                  today: "text-gray-900 font-semibold",
                  selected: "bg-[#00BDBD] text-white rounded-full",
                }}
              />
            </div>

            {isMonth ? (
              <div className="min-h-0">
                <div className="text-sm font-semibold text-[#0F172A] mb-3">
                  {format(selectedDate, "yyyy.MM.dd", { locale: ko })}
                </div>

                {selectedDayEvents.length === 0 ? (
                  <div className="text-xs text-gray-400">등록된 일정이 없습니다.</div>
                ) : (
                  <ul className="space-y-3">
                    {selectedDayEvents.map((e) => (
                      <li
                        key={e.id}
                        className="flex items-center justify-between text-[13px] text-[#0F172A]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-400">•</span>
                          <span className="truncate">{e.title}</span>
                        </div>
                        <span className="text-gray-300">›</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="min-h-0">
                <div className="bg-[#F3F4F6] text-sm font-semibold text-[#0F172A] px-3 py-2 rounded-md">
                  To Do
                </div>

                <div className="mt-3 space-y-4 overflow-auto pr-1">
                  {DUMMY_TODOS.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white rounded-xl border border-[#00BDBD] px-4 py-3"
                    >
                      <div className="text-sm font-semibold text-[#00A9A9]">
                        {card.title}
                      </div>
                      <div className="mt-2 space-y-1">
                        {card.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-[#374151]">
                            {it}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="pt-6 min-h-0 flex flex-col">
            {isMonth ? (
              <>
                <div className="flex items-center justify-between">
                  <button
                    className="px-10 h-11 rounded-md border border-[#00BDBD] text-[#00BDBD] font-semibold hover:bg-[#E6FAFA]"
                    onClick={() => alert("일정 추가 모달 연결 예정")}
                  >
                    일정 추가하기
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={goPrev}
                      className="w-9 h-9 rounded-full text-gray-700 hover:bg-gray-50"
                      aria-label="이전"
                    >
                      ‹
                    </button>

                    <div className="px-10 h-11 rounded-md border border-[#B8D9D9] flex items-center font-semibold text-[#00BDBD]">
                      {currentTitle}
                    </div>

                    <button
                      onClick={goNext}
                      className="w-9 h-9 rounded-full text-gray-700 hover:bg-gray-50"
                      aria-label="다음"
                    >
                      ›
                    </button>
                  </div>

                  {/* right: toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeView("month")}
                      className={[
                        "w-10 h-10 rounded-full border text-sm font-semibold",
                        isMonth
                          ? "bg-[#00BDBD] text-white border-[#00BDBD]"
                          : "border-[#B8D9D9] text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      월
                    </button>
                    <button
                      onClick={() => changeView("week")}
                      className={[
                        "w-10 h-10 rounded-full border text-sm font-semibold",
                        !isMonth
                          ? "bg-[#00BDBD] text-white border-[#00BDBD]"
                          : "border-[#B8D9D9] text-gray-700 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      주
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex-1 min-h-0">
                  <FullCalendar
                    ref={calendarRef as any}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="ko"
                    headerToolbar={false}
                    height="100%"
                    firstDay={0}
                    fixedWeekCount={true}
                    showNonCurrentDates={true}
                    datesSet={onDatesSet}
                    dateClick={onDateClick}
                    events={fcEvents}
                    dayMaxEventRows={3}
                    dayCellContent={(arg) => {
                      const onlyNum = arg.dayNumberText.replace("일", "");
                      return <span className="fc-day-num">{onlyNum}</span>;
                    }}
                    dayCellClassNames={(arg) => {
                      const active = isSameDay(arg.date, selectedDate);
                      return active ? ["ct-selected-day"] : [];
                    }}
                    eventDidMount={(info) => {
                      const el = info.el as HTMLElement;
                      const color = (info.event.extendedProps as any)?.color as string | undefined;
                      if (color) el.style.backgroundColor = color;

                      el.style.border = "none";
                      el.style.boxShadow = "none";
                      el.style.borderRadius = "8px";
                      el.style.padding = "6px 10px";
                      el.style.fontSize = "12px";
                      el.style.lineHeight = "1.2";

                      if (color) {
                        el.style.color = pickTextColor(color);
                      }
                    }}
                  />
                </div>

                <style>{`
                  .fc-theme-standard .fc-scrollgrid,
                  .fc-theme-standard td,
                  .fc-theme-standard th {
                    border: none !important;
                  }
                  .fc .fc-scrollgrid-section > * {
                    border: none !important;
                  }

                  .fc .fc-col-header-cell-cushion {
                    color: #9ca3af;
                    font-weight: 600;
                    padding: 12px 0;
                  }

                  .fc .fc-daygrid-day-top {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    padding-top: 16px;
                    padding-bottom: 6px;
                  }
                  .fc .fc-daygrid-day-number {
                    float: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                  .fc .fc-day-num {
                    font-weight: 700;
                    color: #0f172a;
                    display: inline-flex;
                    width: 34px;
                    height: 34px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                  }

                  .fc .ct-selected-day .fc-day-num {
                    background: #00BDBD;
                    color: white;
                  }

                  .fc .fc-day-other .fc-day-num {
                    color: #cbd5e1;
                  }

                  .fc .fc-daygrid-day-frame {
                    min-height: 120px;
                  }

                  .fc .fc-daygrid-event,
                  .fc .fc-event,
                  .fc .fc-event-main {
                    border: none !important;
                    box-shadow: none !important;
                  }
                  .fc .fc-daygrid-event-harness {
                    margin: 4px 14px;
                  }

                  .fc {
                    --fc-today-bg-color: transparent;
                  }
                `}</style>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  <div className="absolute left-0 text-3xl font-extrabold text-[#0F172A]">
                    {format(selectedDate, "yyyy.MM.dd (eee)", { locale: ko })}
                  </div>

                  <button
                    className="px-10 h-11 rounded-md border border-[#00BDBD] text-[#00BDBD] font-semibold hover:bg-[#E6FAFA] flex items-center gap-2"
                    onClick={() => alert("일정 추가 모달 연결 예정")}
                  >
                    <span className="text-base">✎</span>
                    일정 추가하기
                  </button>

                  <div className="absolute right-0 flex items-center gap-2">
                    <button
                      onClick={() => changeView("month")}
                      className="w-10 h-10 rounded-full border border-[#B8D9D9] text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      월
                    </button>
                    <button
                      onClick={() => changeView("week")}
                      className="w-10 h-10 rounded-full bg-[#00BDBD] text-white border border-[#00BDBD] font-semibold"
                    >
                      주
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <WeekHeader selectedDate={selectedDate} onSelectDay={setSelectedDate} />
                </div>

                <div className="flex-1 min-h-0 overflow-x-auto pb-6">
                  <WeekBoard selectedDate={selectedDate} events={events} />
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
