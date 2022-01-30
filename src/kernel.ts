/**
 * Module to detect date and time information from text
 *
 * mon tue wed
 * date format parsing
 *
 */

import { exampleRules, Parser } from "./parsers";

const createNewDay = (pvm?: Date) => {
  if (pvm) return pvm;
  const day = new Date();

  day.setHours(8);
  day.setSeconds(0);
  day.setMinutes(0);
  day.setMilliseconds(0);
  return day;
};

export function parseLine(
  rules: Parser,
  input: string,
  pvm?: Date
): {
  day: Date;
  result: {
    text?: string[];
    number?: string;
    [key: string]: string | string[] | undefined;
  };
} {
  let result: any = {};
  const stringToTest = input.trim();
  let testableString = stringToTest;
  const findMatch = (input: string) => {
    let str = input;
    let didFind = false;
    rules.matchers.forEach((m) => {
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

  let day = createNewDay(pvm);

  rules.transformers.forEach((t) => {
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

export function parseLines(
  input: string,
  rules: Parser = exampleRules,
  startDate?: Date
) {
  let currentDate = createNewDay(startDate);
  return input.split("\n").map((line) => {
    const res = parseLine(rules, line, new Date(currentDate));
    currentDate = res.day!;
    return res;
  });
}
