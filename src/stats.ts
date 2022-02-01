import * as aegg from "aegg";
import * as dfns from "date-fns";
import { ParseResultLine } from "./kernel";

type Aggregates = {
  count: Array<[string, number]>;
  avg: Array<[string, number]>;
  sum: Array<[string, number]>;
  min: Array<[string, number]>;
  max: Array<[string, number]>;
};
type AggregateKey = keyof Aggregates;

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

type StatsResult = {
  week: Aggregates;
  month: Aggregates;
};

export function getStatsFor(
  lines: ParseResultLine[],
  subject: string,
  measure: string
): StatsResult {
  const data = lines
    .filter((value) => {
      return (
        value.result.text?.includes(subject) &&
        Object.keys(value.result).includes(measure)
      );
    })
    .map((row) => {
      return {
        day: row.day,
        [measure]: Number(row.result[measure]),
      };
    });

  const aggregatedData = aegg.multiAggregate(
    data,
    {
      week: (t) => `${dfns.getISOWeek(t.day)}`,
      month: (t) => `${dfns.getMonth(t.day) + 1}`,
    },
    computeStats
  );

  const collect = (part: string, aggregateName: AggregateKey) => {
    const list = (Object.entries(aggregatedData[part]).map(([key, value]) => {
      const v = key;
      const n = value?.[measure]?.[aggregateName] || 0;
      return [v, n];
    }) as Array<[string, number]>).sort((a, b) => {
      return Number(a[0]) - Number(b[0]);
    });
    if (list.length === 0) return [];
    let lastIndex = Number(list[0][0]);
    const results: Array<[string, number]> = [];
    list.forEach(([idx, value]) => {
      const i = Number(idx);
      while (lastIndex + 1 < i) {
        lastIndex++;
        results.push([String(lastIndex), 0]);
      }
      results.push([idx, value]);
      lastIndex = i;
    });
    return results;
  };

  return {
    week: {
      min: collect("week", "min"),
      max: collect("week", "max"),
      avg: collect("week", "avg"),
      sum: collect("week", "sum"),
      count: collect("week", "count"),
    },
    month: {
      min: collect("month", "min"),
      max: collect("month", "max"),
      avg: collect("month", "avg"),
      sum: collect("month", "sum"),
      count: collect("month", "count"),
    },
  };
}
