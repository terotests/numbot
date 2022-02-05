import { expect } from "chai";
import { parser, stats } from "../src/index";
import { exampleRules } from "../src/parsers";

var babar = require("babar");

const testLogOneYear = `
viikko 1
  ma juoksu 60min
  ti juoksu 30min    
  ke kävely 50min
viikko 2
  ma juoksu 15min
  ti juoksu 30min 
  pe kävely 45min
viikko 3
  ma juoksu 44min
  ti juoksu 44min
  ke kävely 10min
  to juoksu 44min
viikko 4
  ma juoksu 34min
  ti juoksu 74min
  to juoksu 14min
viikko 5
  ma juoksu 44min
  ti juoksu 34min
  ke kävely 10min
  to juoksu 14min
  su kävely 20min
  `;

const testLogTwoYears = `
vuosi 2020
  viikko 1
    ma juoksu 10min
    ti juoksu 40min    
    ke kävely 10min
  viikko 2
    ma juoksu 65min
    ti juoksu 32min 
    pe kävely 45min
  viikko 3
    ma juoksu 34min
    ti juoksu 64min
    ke kävely 70min
    to juoksu 24min
  viikko 4
    ma juoksu 54min
    ti juoksu 74min
    to juoksu 14min
  viikko 5
    ma juoksu 14min
    ti juoksu 24min
    ke kävely 30min
    to juoksu 44min
    su kävely 50min
vuosi 2021
  viikko 1
    ma juoksu 60min
    ti juoksu 30min    
    ke kävely 50min
  viikko 2
    ma juoksu 15min
    ti juoksu 30min 
    pe kävely 45min
  viikko 3
    ma juoksu 44min
    ti juoksu 44min
    ke kävely 10min
    to juoksu 44min
  viikko 4
    ma juoksu 34min
    ti juoksu 74min
    to juoksu 14min
  viikko 5
    ma juoksu 44min
    ti juoksu 34min
    ke kävely 10min
    to juoksu 14min
    su kävely 20min
  viikko 6
    ma juoksu 44min
    ti juoksu 34min
    ke kävely 10min
    to juoksu 14min
    su kävely 20min


    `;

describe("Statistics tests", () => {
  it("Test reading statistics", () => {
    const test = parser(testLogOneYear, exampleRules, new Date("2022-01-30"));
    const statistics = stats(test, {
      subject: "juoksu",
      measure: "duration_mins",
    });
    console.log(
      babar(statistics.week.sum, {
        caption: "running weekly sum",
        color: "green",
        width: 40,
        height: 10,
        minY: 0.01,
        yFractions: 1,
      })
    );
    expect(statistics.week.sum[0][1]).to.eq(90);
    expect(statistics.week.sum[1][1]).to.eq(45);

    console.log(
      babar(statistics.week.avg, {
        caption: "running weekly average",
        color: "green",
        width: 40,
        height: 10,
        minY: 0.01,
        yFractions: 1,
      })
    );

    expect(statistics.week.avg[0][1]).to.eq(45);

    const walk_stats = stats(test, {
      subject: "kävely",
      measure: "duration_mins",
    });
    console.log(
      babar(walk_stats.week.sum, {
        caption: "walking weekly sum",
        color: "blue",
        width: 40,
        height: 10,
        minY: 0.01,
        yFractions: 1,
      })
    );
  });

  it("Test stats for multiple measures", () => {
    const test = parser(testLogOneYear, exampleRules, new Date("2022-01-30"));
    const statistics = stats(test, {
      subject: ["juoksu", "kävely"],
      measure: "duration_mins",
    });
    console.log(
      babar(statistics.week.sum, {
        caption: "running and walking combined weekly sum",
        color: "green",
        width: 40,
        height: 10,
        minY: 0.01,
        yFractions: 1,
      })
    );

    expect(statistics.week.sum[0][1]).to.eq(90 + 50);
  });

  it("Test multiple year sums", () => {
    const test = parser(testLogTwoYears, exampleRules, new Date("2022-01-30"));
    const statistics = stats(test, {
      subject: ["juoksu", "kävely"],
      measure: "duration_mins",
    });
    console.log(
      babar(statistics.week.sum, {
        caption: "running and walking combined weekly sum for multiple years",
        color: "green",
        width: 40,
        height: 10,
        minY: 0.01,
        yFractions: 1,
      })
    );
    console.log(
      babar(statistics.day.sum, {
        caption: "sums for each day",
        color: "green",
        width: 40,
        height: 10,
        minY: 0.01,
        yFractions: 1,
      })
    );
  });
});
