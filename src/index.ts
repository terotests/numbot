import * as chrono from "chrono-node";
import { test } from "./detectDates";
console.log("Hello World");

export const SampleTestFunction = () => "OK";

// first day of
console.log(test("ma 8:00 8h"));
console.log(test("tiistai kello 15"));
console.log(test("2.3.2022"));
console.log(test("4.12.2021"));
