export interface SportEntry {
  participantName: string;
  score: number;
}

export interface SportEvent {
  id: string;
  name: string;
  date: string;
  entries: SportEntry[];
  showEntries?: boolean;
}
