export interface Route {
  label: string;
  icon: string;
  route: string;
  description: string;
  showOnHomepage?: boolean;
  roles?: string[];
}
