import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { Task } from "@/types/entities";

export const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 → 23:00
export const HOUR_HEIGHT_PX = 56;
export const DAY_GRID_HEIGHT_PX = HOURS.length * HOUR_HEIGHT_PX;

const PX_PER_MIN = HOUR_HEIGHT_PX / 60;

export function dateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function tasksForDate(tasks: Task[], date: Date) {
  const key = dateKey(date);
  return tasks.filter((t) => t.due_date === key);
}

/** The 7 days (Mon→Sun) of the week containing `date`. */
export function weekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Full calendar weeks (Mon→Sun) covering the month containing `date`. */
export function monthGrid(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

/** "14:00" alone, or "14:00–15:30" once an end time is set. */
export function formatTimeRange(due_time?: string, end_time?: string): string | undefined {
  if (!due_time) return undefined;
  if (!end_time) return due_time;
  return `${due_time}–${end_time}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function splitByTime(tasks: Task[]) {
  const allDay = tasks.filter((t) => !t.due_time);
  const timed = tasks.filter((t) => t.due_time);
  return { allDay, timed };
}

export interface DayTaskLayout {
  task: Task;
  top: number; // px from the top of the day grid
  height: number; // px
  left: number; // %
  width: number; // %
  isRange: boolean;
}

/**
 * Positions timed tasks on the day grid: tasks with only a start time get a
 * compact dot-height slot, tasks with an end time get a bar spanning their
 * full duration. Overlapping tasks are packed into side-by-side lanes,
 * clustered by connected time ranges so unrelated events elsewhere in the
 * day aren't squeezed by a busy moment.
 */
export function layoutDayTasks(tasks: Task[]): DayTaskLayout[] {
  const gridStartMin = HOURS[0] * 60;

  const items = tasks
    .filter((t) => t.due_time)
    .map((t) => {
      const start = timeToMinutes(t.due_time!);
      const isRange = !!t.end_time && timeToMinutes(t.end_time) > start;
      const end = isRange ? timeToMinutes(t.end_time!) : start + 30;
      return { task: t, start, end, isRange, lane: 0 };
    })
    .sort((a, b) => a.start - b.start || a.end - b.end);

  type Item = (typeof items)[number];
  const result: (Item & { clusterCols: number })[] = [];
  let cluster: Item[] = [];
  let clusterMaxEnd = -Infinity;

  function flushCluster() {
    if (cluster.length === 0) return;
    const laneEnds: number[] = [];
    for (const item of cluster) {
      let lane = laneEnds.findIndex((end) => end <= item.start);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(item.end);
      } else {
        laneEnds[lane] = item.end;
      }
      item.lane = lane;
    }
    const cols = laneEnds.length;
    for (const item of cluster) result.push({ ...item, clusterCols: cols });
    cluster = [];
  }

  for (const item of items) {
    if (cluster.length > 0 && item.start >= clusterMaxEnd) {
      flushCluster();
      clusterMaxEnd = -Infinity;
    }
    cluster.push(item);
    clusterMaxEnd = Math.max(clusterMaxEnd, item.end);
  }
  flushCluster();

  return result.map(({ task, start, end, isRange, lane, clusterCols }) => ({
    task,
    top: (start - gridStartMin) * PX_PER_MIN,
    height: isRange ? Math.max((end - start) * PX_PER_MIN, 26) : 22,
    left: (lane / clusterCols) * 100,
    width: (1 / clusterCols) * 100,
    isRange,
  }));
}
