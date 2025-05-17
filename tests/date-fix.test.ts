import { expect } from "chai";
import { parser } from "../src/index";
import { exampleRules } from "../src/parsers";

describe("Date parsing fixes", () => {
  it("should correctly set the day when using DD.MM. format", () => {
    // This test verifies the fix for the issue where DD.MM. format wasn't correctly setting the day value
    const test = parser("11.3. run 55min", exampleRules, new Date("2022-01-30"));
    expect(test.length).to.eq(1);
    
    test.forEach((row) => {
      expect(row.day.getDate()).to.eq(11); // Day should be 11
      expect(row.day.getMonth()).to.eq(2); // Month should be March (2)
      expect(row.result.duration_mins).to.eq("55"); // Should capture duration
      expect(row.result.text?.[0]).to.eq("run"); // Should capture text
    });
  });
});
