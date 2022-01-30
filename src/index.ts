import * as chrono from "chrono-node";
import { parseLines, test } from "./detectDates";
console.log("Hello World");

export const SampleTestFunction = () => "OK";

// first day of
console.log(test("ma 8:00 8h"));
console.log(test("tiistai 15:00 lenkki 30min"));
console.log(test("2.3.2022"));
console.log(test("4.12.2021"));
console.log(test("4.2.2020 780kcal"));
console.log(test("  4.2.2020 hiihto 500kcal 45min"));
console.log(test("  4.2.2020 qpr 4h porukan jeesimistä"));
console.log(test("  4.2.2020 codento.qpr 4h porukan jeesimistä"));
console.log(test("  4.2.2020 qpr 4"));
console.log(test("ma qpr 7"));
console.log(test("ti qpr 7.5"));
console.log(test("ti qpr sairas 7.5"));
console.log(test("viime viikko ti qpr sairas 7.5"));
console.log(test("viikko -1 ti qpr sairas 7.5"));
console.log(test("viikko 1 ti qpr sairas 7.5"));
console.log(test("viikko 1 ti qpr sairas 7.5h"));

console.log(test("viikko +1 ti qpr sairas 7.5h"));
console.log(test("viikko +2 ti qpr sairas 7.5h"));
console.log(test("viikko +3 ti qpr sairas 7.5h"));

// TODO: parse several lines of text

console.log(
  JSON.stringify(
    parseLines(`

viikko 1 
 ma lepo
 ti lepo
 ke lenkki 45min
 to sali 1h

viikko 2
 ma hiihto 30min
 ti 
   p.qpr 4.5h tutkittiin erilaisia asioita
         1h avustin projektissa
   p.cirit 0.5h kahvibreikki
   vitutus 5
viikko 3 
 ke hiihto 45min

`),
    null,
    2
  )
);
