export interface CreateSparePart {
  manufacturer: string;
  model: string;
  type: string;
  depot: string;
  amount: number;
  remarks?: string;
}

export interface SparePart {
  _id: string;
  manufacturer: string;
  model: string;
  type: string;
  depot: string;
  amount: number;
  remarks?: string;
}
