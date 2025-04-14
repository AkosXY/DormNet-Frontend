export interface TimeSlotRequest {
  resourceId: number;
  date: string; // 'yyyy-mm-dd'
  durationMinutes: number;
}
