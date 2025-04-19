export class DateUtils {
  static getDuration(start: string, stop: string): string {
    const s = new Date(start);
    const e = new Date(stop);
    const diffMs = e.getTime() - s.getTime();
    const diffMins = diffMs / 60000;

    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}
