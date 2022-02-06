# Parser for text based logs

NOTE: the API is still a bit unstable, testing for best ways to parse data effiently still.

This is a configurable parser for text based logs. For example

```
  Year 2021
  Week 1
    Mon running 45min
```

Would return a parsed JS Object in format

```javascript
[
  {
    day: "2021-01-30T00:00:00.000Z",
    result: {
      move_to_year: "2021",
    },
  },
  {
    day: "2021-01-09T00:00:00.000Z",
    result: {
      move_to_week: "1",
    },
  },
  {
    day: "2021-01-04T00:00:00.000Z",
    result: {
      monday: "Mon",
      text: ["running"],
      duration_mins: "45",
    },
  },
];
```

For now, see the test file(s) for example of usage.
