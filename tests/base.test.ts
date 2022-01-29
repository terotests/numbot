import { expect } from "chai";
import { SampleTestFunction } from "../src";

describe("Options tests", () => {
  // the tests container
  it("checking default options", () => {
    // the single test
    expect(true).to.eq(true);
    expect(SampleTestFunction()).to.eq("OK");
  });
});
