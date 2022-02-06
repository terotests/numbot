import React from "react";
import { useState } from "react";
import logo from "./logo.svg";
import * as dfns from "date-fns";
import "./App.css";
import * as numbot from "numbot";
import { exampleRules } from "numbot/dist/src/parsers";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
function App() {
  const [log, setLog] = React.useState(`year 2021
  week 4
    mon running 11min
    tue running 10min
    wed swimming 30min
  week 5
    mon running 50min
    tue running 20min 
    wed swimming 90min
  week 6
    mon running 20min
    tue running 30min 
    wed swimming 55min

year 2022
  week 4
    mon running 11min
    tue running 40min
    wed swimming 30min
  week 5
    mon running 50min
    tue running 20min 
    wed swimming 10min

  week 6
    mon running 20min
    tue running 30min 
    wed swimming 55min
   
  week 7
    mon running 10min
    tue running 20min 
    wed swimming 50min

  week 8
    mon running 10min
    tue running 20min 
    wed swimming 50min
   
  
   
  
   
  
   
  `);
  const [subjects, setSubjects] = React.useState<string>("running");
  const [measure, setMeasure] = React.useState<string>("duration_mins");
  const [interval, setInterval] = React.useState<
    "day" | "week" | "month" | "year"
  >("week");
  const [type, setType] = React.useState<
    "min" | "max" | "avg" | "count" | "sum"
  >("sum");
  const [parsed, setParsed] = React.useState<any>();
  const [stats, setStats] = React.useState<ReturnType<typeof numbot.stats>>();

  React.useEffect(() => {
    setParsed(numbot.parser(log, exampleRules));
  }, [log, measure, subjects]);

  React.useEffect(() => {
    if (parsed) {
      setStats(
        numbot.stats(parsed, {
          subject: subjects.split(",").map((s) => s.trim()),
          measure,
        })
      );
    }
  }, [parsed]);

  return (
    <div className="container">
      <div className="inputrow">
        <div>
          <div>Write the stats of </div>
          <div>
            <input
              type="text"
              value={subjects}
              onChange={(e) => {
                setSubjects(e.target.value);
              }}
            />
            <input
              type="text"
              value={measure}
              onChange={(e) => {
                setMeasure(e.target.value);
              }}
            />
            <select
              value={interval}
              onChange={(e) => {
                setInterval(e.target.value as any);
              }}
            >
              {["day", "week", "month", "year"].map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as any);
              }}
            >
              {["min", "max", "avg", "count", "sum"].map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>Write the log </div>
          <div>
            <textarea
              className="log"
              value={log}
              onChange={(e) => {
                setLog(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
        <div>
          Stats:
          <BarChart
            width={808}
            height={320}
            data={
              stats
                ? stats[interval][type].map((values) => {
                    // TODO: fix the typing in the stats function return value
                    const date = new Date(values[0]);
                    return {
                      value: values[1],
                      name: (() => {
                        if (interval === "year") return `${dfns.getYear(date)}`;
                        if (interval === "week")
                          return `${dfns.getYear(date)}/${dfns.getISOWeek(
                            date
                          )}`;
                        if (interval === "day")
                          return `${dfns.getYear(date)}/${dfns.getMonth(date) +
                            1}/${dfns.getDate(date)}`;
                        if (interval === "month")
                          return `${dfns.getYear(date)}/${dfns.getMonth(date) +
                            1}`;
                        return date;
                      })(),
                    };
                  })
                : []
            }
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend
              wrapperStyle={{
                position: "relative",
                marginTop: "-10px",
              }}
            />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
      <pre>{JSON.stringify(parsed, null, 2)}</pre>
    </div>
  );
}

export default App;
