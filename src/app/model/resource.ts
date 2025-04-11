export interface ResourceBase {
  name: string;
  available: boolean;
}

export interface Resource extends ResourceBase {
  id: number;
  status: string;
  version: number;
}
