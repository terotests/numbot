import * as dfns from "date-fns";

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

    // month names, notice: longer name must come before shorthand
    /(?<january>january|jan|tammikuu)/iu,
    /(?<february>february|feb|helmikuu)/iu,
    /(?<march>march|mar|maaliskuu)/iu,
    /(?<april>april|apr|huhtikuu)/iu,
    /(?<may>may|toukokuu)/iu,
    /(?<june>june|jun|kesäkuu)/iu,
    /(?<july>july|jul|heinäkuu)/iu,
    /(?<august>august|aug|elokuu)/iu,
    /(?<september>september|sep|syyskuu)/iu,
    /(?<october>october|oct|lokakuu)/iu,
    /(?<november>november|nov|marraskuu)/iu,
    /(?<december>december|dec|joulukuu)/iu,

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
      year: (y, v) => dfns.setYear(y, Number(v)),
    },
    {
      day: (y, v) => dfns.setDate(y, Number(v)),
    },
    {
      month: (y, v) => dfns.setMonth(y, Number(v) - 1),
    },
    {
      hour: (y, v) => dfns.setHours(y, Number(v)),
    },
    {
      minutes: (y, v) => dfns.setMinutes(y, Number(v)),
    },
    {
      last_week: (y, v) => dfns.addDays(y, -7),
    },
    {
      move_week: (y, v) => dfns.addWeeks(y, Number(v)),
    },
    {
      move_to_year: (y, v) => dfns.setYear(y, Number(v)),
    },
    {
      move_to_week: (y, v) => dfns.setISOWeek(y, Number(v)),
    },
    {
      monday: (y, v) => dfns.setISODay(y, 1),
    },
    {
      tuesday: (y, v) => dfns.setISODay(y, 2),
    },
    {
      wednesday: (y, v) => dfns.setISODay(y, 3),
    },
    {
      thursday: (y, v) => dfns.setISODay(y, 4),
    },
    {
      friday: (y, v) => dfns.setISODay(y, 5),
    },
    {
      saturday: (y, v) => dfns.setISODay(y, 6),
    },
    {
      sunday: (y, v) => dfns.setISODay(y, 7),
    },
    {
      january: (y, v) => dfns.setMonth(y, 0),
    },
    {
      february: (y, v) => dfns.setMonth(y, 1),
    },
    {
      march: (y, v) => dfns.setMonth(y, 2),
    },
    {
      april: (y, v) => dfns.setMonth(y, 3),
    },
    {
      may: (y, v) => dfns.setMonth(y, 4),
    },
    {
      june: (y, v) => dfns.setMonth(y, 5),
    },
    {
      july: (y, v) => dfns.setMonth(y, 6),
    },
    {
      august: (y, v) => dfns.setMonth(y, 7),
    },
    {
      september: (y, v) => dfns.setMonth(y, 8),
    },
    {
      october: (y, v) => dfns.setMonth(y, 9),
    },
    {
      november: (y, v) => dfns.setMonth(y, 10),
    },
    {
      december: (y, v) => dfns.setMonth(y, 11),
    },
  ],
};
