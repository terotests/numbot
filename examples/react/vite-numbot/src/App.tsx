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
  const [log, setLog] = React.useState(`year 2022
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
            width={500}
            height={320}
            data={
              stats
                ? stats.week.sum.map((values: any) => {
                    // TODO: fix the typing in the stats function return value
                    const date = new Date(values[2]);
                    return {
                      value: values[1],
                      name: `${dfns.getYear(date)}/${dfns.getISOWeek(date)}`,
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
            <Legend />
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
