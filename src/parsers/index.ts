import * as dfns from "date-fns";
import * as locale from "date-fns/locale";

const setWeekDay = (y: Date, weekDayNo: number) => {
  const startOfWeek = dfns.startOfWeek(y, { locale: locale.fi });
  const day = dfns.addDays(startOfWeek, weekDayNo - 1);
  // do not lose the time information
  day.setHours(y.getHours());
  day.setMinutes(y.getMinutes());
  return day;
};

export type Parser = {
  matchers: RegExp[];
  transformers: Array<{
    [key: string]: (
      startDate: Date,
      value: string,
      obj: any,
      key: string
    ) => Date;
  }>;
};
export const exampleRules: Parser = {
  // correct order of the matchers is very important here
  matchers: [
    // date numbers
    /(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})/u,
    /(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{4})/u,
    /(?<day>\d{1,2})\.(?<month>\d{1,2})\./u,

    // day names
    /(?<monday>ma|maanantai|mon)/iu,
    /(?<tuesday>ti|tiistai|tue)/iu,
    /(?<wednesday>ke|keskiviikko|wed)/iu,
    /(?<thursday>to|torstai|thu)/iu,
    /(?<friday>pe|perjantai|fri)/iu,
    /(?<saturday>la|lauantai|sat)/iu,
    /(?<sunday>su|sunnuntai|sun)/iu,

    // special fraces
    /(?<last_week>viime viikko)/u,
    /(?<last_week>last week)/u,

    // moving date
    /viikko\s*(?<move_week>[+-][0-9]+)/iu,
    /viikko\s*(?<move_to_week>[0-9]+)/iu,
    /week\s*(?<move_to_week>[0-9]+)/iu,
    /vuosi\s*(?<move_to_year>[0-9]+)/iu,
    /year\s*(?<move_to_year>[0-9]+)/iu,

    // date of month
    /(?<day>\d{1,2})th/u,
    /(?<day>\d{1})st/u,
    /(?<day>\d{1})nd/u,

    // week days
    /(?<monday>ma|maanantai)/u,
    /(?<tuesday>ti|tiistai)/u,
    /(?<wednesday>ke|keskiviikko)/u,
    /(?<thursday>to|torstai)/u,
    /(?<friday>pe|perjantai)/u,
    /(?<saturday>la|lauantai)/u,
    /(?<sunday>su|sunnuntai)/u,

    // month names
    /(?<january>jan|january|tammikuu)/iu,
    /(?<february>feb|february|helmikuu)/iu,
    /(?<march>mar|march|maaliskuu)/iu,

    // time of day
    /(?<hour>\d{1,2}):(?<minutes>\d{1,2})/u,

    // lisää matchereitä, esim. tunteja yms.
    /(?<duration_hours>\d{1,2})h/u,
    /(?<duration_hours>\d{1,2}.\d{1})h/u,
    /(?<duration_mins>\d{1,2})min/u,
    /(?<duration_mins>\d{1,2}\.\d{1})min/u,

    // suureiden tunnistamista
    /(?<kcal>\d+)\s*kcal/u,
    /(?<kg>\d+)\s*kg/u,
    /(?<km>\d+)\s*km/u,

    // project and scope
    /(?<scope>[a-zA-ZöäåÖÄÅ]+)\.(?<project>[a-zA-ZöäåÖÄÅ]+)/u,

    // text
    /(?<text>[a-zA-ZöäåÖÄÅ]+)/u,

    // any number
    /(?<number>[0-9]*[.]?[0-9]+)/u,
    /(?<number>\d+)/u,
  ],
  transformers: [
    {
      year: (y, v) => {
        y.setFullYear(Number(v));
        return y;
      },
    },
    {
      day: (y, v) => {
        y.setDate(Number(v));
        return y;
      },
    },
    {
      month: (y, v) => {
        y.setMonth(Number(v) - 1);
        return y;
      },
    },
    {
      hour: (y, v) => {
        y.setHours(Number(v));
        return y;
      },
    },
    {
      minutes: (y, v) => {
        y.setMinutes(Number(v));
        return y;
      },
    },
    {
      last_week: (y, v) => {
        y.setDate(y.getDate() - 7);
        return y;
      },
    },
    {
      move_week: (y, v) => {
        y.setDate(y.getDate() + 7 * Number(v));
        return y;
      },
    },
    {
      move_to_year: (y, v) => {
        y.setFullYear(Number(v));
        return y;
      },
    },
    {
      move_to_week: (y, v) => {
        const delta = Number(v) - dfns.getWeek(y, { locale: locale.fi });
        y.setDate(y.getDate() + 7 * delta);
        return y;
      },
    },
    {
      monday: (y, v) => setWeekDay(y, 1),
    },
    {
      tuesday: (y, v) => setWeekDay(y, 2),
    },
    {
      wednesday: (y, v) => setWeekDay(y, 3),
    },
    {
      thursday: (y, v) => setWeekDay(y, 4),
    },
    {
      friday: (y, v) => setWeekDay(y, 5),
    },
    {
      saturday: (y, v) => setWeekDay(y, 6),
    },
    {
      sunday: (y, v) => setWeekDay(y, 7),
    },
    {
      january: (y, v) => (y.setMonth(0), y),
    },
    {
      february: (y, v) => (y.setMonth(1), y),
    },
    {
      march: (y, v) => (y.setMonth(2), y),
    },
  ],
};
