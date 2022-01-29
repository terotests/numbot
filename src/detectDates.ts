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

// matcher

// correct order of the matchers is very important here
const matchers: RegExp[] = [
  // date numbers
  /(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})/u,
  /(?<day>\d{1,2})\.(?<month>\d{1,2})/u,
  /(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{4})/u,

  // time of day
  /(?<hour>\d{1,2}):(?<minutes>\d{1,2})/u,
  /kello (?<hour>\d{1,2}):(?<minutes>\d{1,2})/u,
  /kello (?<hour>\d{1,2})/u,

  // day names
  /(?<monday>ma|maanantai)/u,
  /(?<tuesday>ti|tiistai)/u,
  /(?<wednesday>ke|keskiviikko)/u,
  /(?<thursday>to|torstai)/u,
  /(?<friday>pe|perjantai)/u,
  /(?<saturday>la|lauantai)/u,
  /(?<sunday>su|sunnuntai)/u,

  // lisää matchereitä, esim. tunteja yms.
  /(?<h>\d{1,2})h/u,
  /(?<h>\d{1,2}.\d{1})h/u,
];

const setWeekDay = (y: Date, weekDayNo: number) => {
  const currentDay = y.getDay();
  const distance = weekDayNo - currentDay;
  y.setDate(y.getDate() + distance);
  return y;
};

const travellers: Array<{
  [key: string]: (startDate: Date, value: string) => Date;
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
      y.setDate(Number(v) - 1);
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
    monday: (y, v) => setWeekDay(y, 1),
  },
  {
    tuesday: (y, v) => setWeekDay(y, 2),
  },
  {
    wednesday: (y, v) => setWeekDay(y, 3),
  },
];

// scope function matcher
const scopeMatcher = {
  week: (d: Date, amount: number) => {
    return dfns.addWeeks(d, amount);
  },
  month: (d: Date, amount: number) => {
    return dfns.addMonths(d, amount);
  },
};

// convert known word to amoung
const amountMathcer = {
  last: -1,
};

const languageDefinitions = {
  eilen: (d: Date) => {},
};

export function parseTimeInformation(inputString: string, datePointer?: Date) {}

export function test(stringToTest: string = "ke") {
  let result: any = {};

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
      if (match && match.index === 0) {
        result = { ...result, ...match.groups };
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

  let day = new Date();

  day.setHours(8);
  day.setSeconds(0);
  day.setMinutes(0);
  day.setMilliseconds(0);

  travellers.forEach((t) => {
    Object.keys(result).forEach((key) => {
      if (t[key]) {
        day = t[key](day, result[key]);
      }
    });
  });

  return day;
}
