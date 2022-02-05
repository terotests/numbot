import { expect } from "chai";
import { parser, stats } from "../src/index";
import { exampleRules } from "../src/parsers";

var babar = require("babar");

describe("Options tests", () => {
  it("Test basic date parsing", () => {
    const test = parser(`2.2.2021`);
    test.forEach((row) => {
      expect(row.day.getFullYear()).to.eq(2021);
      expect(row.day.getDate()).to.eq(2);
      expect(row.day.getMonth()).to.eq(1);
    });
  });

  it("Test moving week -1", () => {
    const test = parser("viikko -1 ma", exampleRules, new Date("2022-01-30"));
    expect(test.length).to.eq(1);
    test.forEach((row) => {
      expect(row.day.getDate()).to.eq(17);
    });
  });

  it("Test moving week +2", () => {
    const test = parser("viikko +2 ma", exampleRules, new Date("2022-01-30"));
    expect(test.length).to.eq(1);
    test.forEach((row) => {
      expect(row.day.getDate()).to.eq(7);
    });
  });

  it("Test moving week +2 and tuesday", () => {
    const test = parser("viikko +2 tue", exampleRules, new Date("2022-01-30"));
    expect(test.length).to.eq(1);
    test.forEach((row) => {
      expect(row.day.getDate()).to.eq(8);
    });
  });

  it("Test month: march", () => {
    const test = parser("maaliskuu", exampleRules, new Date("2022-01-30"));
    expect(test.length).to.eq(1);
    test.forEach((row) => {
      expect(row.day.getMonth()).to.eq(2);
    });
  });

  it("Test month: Mar", () => {
    const test = parser("Mar", exampleRules, new Date("2022-01-30"));
    expect(test.length).to.eq(1);
    test.forEach((row) => {
      expect(row.day.getMonth()).to.eq(2);
    });
  });

  it("Test last week, text and numbers", () => {
    const test = parser(
      `viime viikko ti projekti sairas 7.5`,
      exampleRules,
      new Date("2022-01-30")
    );
    test.forEach((row) => {
      expect(row.day.getFullYear()).to.eq(2022);
      expect(row.day.getDate()).to.eq(18);
      expect(row.result).to.not.be.undefined;

      if (row.result) {
        expect(row.result.text).to.not.be.undefined;
        if (row.result.text) {
          expect(row.result?.text[0]).to.eq("projekti");
          expect(row.result?.text[1]).to.eq("sairas");
        }
        expect(row.result.number).to.not.be.undefined;
        if (row.result.number) {
          expect(row.result?.number).to.eq("7.5");
        }
      }
    });
  });

  it("Test multiline with week", () => {
    const test = parser(
      `
  viikko 1
    ti juoksu 30min    
      `,
      exampleRules,
      new Date("2022-01-30")
    );
    test.forEach((row) => {
      if (row.result.duration_mins) {
        expect(row.day.getDate()).to.eq(4);
        expect(row.result.duration_mins).to.eq("30");
        expect(row.result?.text?.[0]).to.eq("juoksu");
      }
    });
  });

  it("Test multiline with english week", () => {
    const test = parser(
      `
  Year 2021 
  Week 1
    Mon running 45min 
      `,
      exampleRules,
      new Date("2022-01-30")
    );
    test.forEach((row) => {
      if (row.result.duration_mins) {
        expect(row.day.getDate()).to.eq(4);
        expect(row.result.duration_mins).to.eq("45");
        expect(row.result?.text?.[0]).to.eq("running");
      }
    });
  });

  it("Test text and number parsing", () => {
    const test = parser("a b c 100");
    test.forEach((row) => {
      expect(row.result.text?.join(" ")).to.eq("a b c");
      expect(row.result.number).to.eq("100");
    });
  });

  it("Test Finnish month names (tammikuu, helmikuu...)", () => {
    [
      "tammikuu",
      "helmikuu",
      "maaliskuu",
      "huhtikuu",
      "toukokuu",
      "kesäkuu",
      "heinäkuu",
      "elokuu",
      "syyskuu",
      "lokakuu",
      "marraskuu",
      "joulukuu",
    ].forEach((name, idx) => {
      const test = parser(name);
      test.forEach((row) => {
        expect(row.day.getMonth()).to.eq(idx);
      });
    });
  });

  it("Test English month names (january, february...)", () => {
    [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ].forEach((name, idx) => {
      const test = parser(name);
      test.forEach((row) => {
        expect(row.day.getMonth()).to.eq(idx);
      });
    });
  });

  it("Test English month names, short versions (jan, feb,...)", () => {
    [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ].forEach((name, idx) => {
      const test = parser(name);
      test.forEach((row) => {
        expect(row.day.getMonth()).to.eq(idx);
      });
    });
  });

  it("Test multiline with several weeks", () => {
    const test = parser(
      `
  viikko 1
    ti juoksu 30min    
  viikko 2
    ti juoksu 5km   

    `,
      exampleRules,
      new Date("2022-01-30")
    );
    test.forEach((row) => {
      if (row.result.duration_mins) {
        expect(row.day.getDate()).to.eq(4);
        expect(row.result.duration_mins).to.eq("30");
        expect(row.result?.text?.[0]).to.eq("juoksu");
      }
      if (row.result.km) {
        expect(row.day.getDate()).to.eq(4 + 7);
        expect(row.result.km).to.eq("5");
        expect(row.result?.text?.[0]).to.eq("juoksu");
      }
    });
  });
});
