import * as aegg from "aegg";
import * as dfns from "date-fns";
import { ParseResultLine } from "./kernel";

// dfns.isWithinInterval()
// start, end

type Aggregates = {
  count: Array<[string, number]>;
  avg: Array<[string, number]>;
  sum: Array<[string, number]>;
  min: Array<[string, number]>;
  max: Array<[string, number]>;
};

type AggregatesResult = {
  count: Array<[Date, number]>;
  avg: Array<[Date, number]>;
  sum: Array<[Date, number]>;
  min: Array<[Date, number]>;
  max: Array<[Date, number]>;
};

export type AggregateKey = keyof Aggregates;
export type StatsRows = keyof AggregatesResult;

function computeStats(vals: number[]) {
  const sum = vals.reduce((s, a) => s + a);
  return {
    count: vals.length,
    sum,
    avg: vals.length > 0 ? sum / vals.length : 0,
    min: Math.min.apply(Math, vals),
    max: Math.max.apply(Math, vals),
  };
}

export type StatsResult = {
  day: AggregatesResult;
  week: AggregatesResult;
  month: AggregatesResult;
  year: AggregatesResult;
  [key: string]: AggregatesResult;
};

export function getStatsFor(
  lines: ParseResultLine[],
  options: {
    subject?: string | string[];
    measure: string;
    format?: string;
  }
): StatsResult {
  const { subject, measure, format } = options;

  const filterValues = (lines: ParseResultLine[]) => {
    if (!subject) return lines;
    return lines.filter((value) => {
      const { subject, measure } = options;
      if (!subject) return true;
      const resultKeys = Object.keys(value.result);
      const subjectMatch =
        typeof subject === "string"
          ? value.result.text?.includes(subject)
          : subject.some((v) => value.result.text?.includes(v));
      const measureMatch = resultKeys.includes(measure);
      return subjectMatch && measureMatch;
    });
  };

  const data = filterValues(lines).map((row) => {
    return {
      day: row.day,
      [options.measure]: Number(row.result[options.measure]),
    };
  });

  // collect values for each of the intervals
  const aggregateObject: {
    [key: string]: (t: { [key: string]: number | Date }) => string;
  } = {
    day: (t) => `${dfns.startOfDay(t.day)}`,
    week: (t) => `${dfns.startOfISOWeek(t.day)}`,
    month: (t) => `${dfns.startOfMonth(t.day)}`,
    year: (t) => `${dfns.startOfYear(t.day)}`,
  };

  if (format) {
    aggregateObject[format] = (t) => `${dfns.format(t.day, format)}`;
  }

  const aggregatedData = aegg.multiAggregate(
    data,
    aggregateObject,
    computeStats
  );

  const collect = (part: string, aggregateName: AggregateKey) => {
    return (Object.entries(aggregatedData[part]).map(([key, value]) => {
      const v = key;
      const n = value?.[measure]?.[aggregateName] || 0;
      return [new Date(v), n];
    }) as Array<[Date, number]>)
      .sort((a, b) => {
        return a[0].getTime() - b[0].getTime();
      })
      .map(([key, value], idx) => {
        return [key, value];
      });
  };

  return {
    ...Object.keys(aggregateObject).reduce((obj: any, key) => {
      obj[key] = {
        min: collect(key, "min"),
        max: collect(key, "max"),
        avg: collect(key, "avg"),
        sum: collect(key, "sum"),
        count: collect(key, "count"),
      };
      return obj;
    }, {}),
  };
}
