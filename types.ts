
export interface TimerItem {
  id: string;
  duration: number; // in minutes (Phase 1)
  secondaryDuration?: number; // in minutes (Phase 2)
  label: string;
}

export type TimerType = '3min' | '1min';
