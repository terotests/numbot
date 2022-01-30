/**
 * Module to detect date and time information from text
 *
 * mon tue wed
 * date format parsing
 *
 */

// eilen
// kello 18
// +1 day
// day +1
// yesterday
// last week monday
// first day of last month

// move the selected date one step backwards

// matchers to implement some transition

import * as dfns from "date-fns";

import * as locale from "date-fns/locale";

console.log("Locales ", locale.fi);

const settings = {
  weekStartsOn: 1,
};

// matcher

// correct order of the matchers is very important here
const matchers: RegExp[] = [
  // date numbers
  /(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})/u,
  /(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{4})/u,
  /(?<day>\d{1,2})\.(?<month>\d{1,2})\./u,

  // day names
  /(?<monday>ma|maanantai|mon)/u,
  /(?<tuesday>ti|tiistai|tue)/u,
  /(?<wednesday>ke|keskiviikko|wed)/u,
  /(?<thursday>to|torstai|thu)/u,
  /(?<friday>pe|perjantai|fri)/u,
  /(?<saturday>la|lauantai|sat)/u,
  /(?<sunday>su|sunnuntai|sun)/u,

  // special fraces
  /(?<last_week>viime viikko)/u,
  /(?<last_week>last week)/u,

  // moving date
  /viikko\s*(?<move_week>[+-][0-9]+)/u,
  /viikko\s*(?<move_to_week>[0-9]+)/u,

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

  // time of day
  /(?<hour>\d{1,2}):(?<minutes>\d{1,2})/u,

  // lisää matchereitä, esim. tunteja yms.
  /(?<duration_hours>\d{1,2})h/u,
  /(?<duration_hours>\d{1,2}.\d{1})h/u,
  /(?<duration_mins>\d{1,2})min/u,
  /(?<duration_mins>\d{1,2}\.\d{1})min/u,

  // suureiden tunnistamista
  /(?<kcal>\d+)\s*kcal/u,

  // project and scope
  /(?<scope>[a-zA-ZöäåÖÄÅ]+)\.(?<project>[a-zA-ZöäåÖÄÅ]+)/u,

  // text
  /(?<text>[a-zA-ZöäåÖÄÅ]+)/u,

  // any number
  /(?<number>[0-9]*[.]?[0-9]+)/u,
  /(?<number>\d+)/u,
];

const setWeekDay = (y: Date, weekDayNo: number) => {
  let currentDay = y.getDay();
  if (currentDay < settings.weekStartsOn) {
    currentDay = 7 - currentDay;
  }
  const distance = weekDayNo - currentDay;
  y.setDate(y.getDate() + distance);
  return y;
};

const travellers: Array<{
  [key: string]: (
    startDate: Date,
    value: string,
    obj: any,
    key: string
  ) => Date;
}> = [
  {
    year: (y, v) => {
      console.log("Setting year to ", v);
      y.setFullYear(Number(v));
      return y;
    },
  },
  {
    month: (y, v) => {
      console.log("Setting month to ", v);
      y.setMonth(Number(v) - 1);
      return y;
    },
  },
  {
    day: (y, v) => {
      console.log("Setting day to ", v);
      y.setDate(Number(v));
      return y;
    },
  },
  {
    hour: (y, v) => {
      console.log("Setting hour of day to ", v);
      y.setHours(Number(v));
      return y;
    },
  },
  {
    minutes: (y, v) => {
      console.log("Setting minutes of day to ", v);
      y.setMinutes(Number(v));
      return y;
    },
  },
  {
    last_week: (y, v) => {
      console.log("viime viikko", v);
      y.setDate(y.getDate() - 7);
      return y;
    },
  },
  {
    move_week: (y, v) => {
      console.log("siirrä viikkoa", v);
      y.setDate(y.getDate() + 7 * Number(v));
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
];

export function test(input: string, pvm = new Date()) {
  let result: any = {};

  const stringToTest = input.trim();

  console.log("STR: ", stringToTest);
  // cut the values

  let testableString = stringToTest;
  const findMatch = (input: string) => {
    let str = input;
    let didFind = false;
    matchers.forEach((m) => {
      if (didFind) {
        return;
      }
      const match = m.exec(str);
      if (match && match.index === 0 && match[0].length > 0) {
        if (match.groups?.text) {
          if (!result.text) {
            result.text = [];
          }
          result.text.push(match.groups.text);
        } else {
          result = { ...result, ...match.groups };
        }

        testableString = str.slice(match[0].length).trim();
        didFind = true;
      }
    });
    return didFind;
  };

  while (findMatch(testableString));

  /*
  matchers.forEach((m) => {
    console.log(".. ", str);
    const match = m.exec(str);
    if (match && match.index === 0) {
      console.log(match);
      console.log(match[0].length);
      result = { ...result, ...match.groups };

      str = str.slice(match[0].length).trim();
    }
  });
*/

  let day = (() => {
    if (pvm) return pvm;
    const day = new Date();

    day.setHours(8);
    day.setSeconds(0);
    day.setMinutes(0);
    day.setMilliseconds(0);
    return day;
  })();

  travellers.forEach((t) => {
    Object.keys(result).forEach((key) => {
      if (t[key]) {
        day = t[key](day, result[key], result, key);
      }
    });
  });

  return {
    day,
    result,
  };
}

export function parseLines(input: string) {
  let currentDate = new Date();
  return input.split("\n").map((line) => {
    const res = test(line, new Date(currentDate));
    currentDate = res.day!;
    return res;
  });
}
