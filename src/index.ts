import { parseLines } from "./kernel";
import { getStatsFor, StatsResult } from "./stats";

export const parser = parseLines;
export const stats = getStatsFor;
export type TStatsResult = StatsResult;
