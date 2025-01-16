export interface Place {
  name: string;
  location: { lat: number; lng: number };
  website?: string;
  estimatedCalories?: number;
}

export type TransitRouteData = {
  perCalories: PerCalories;
  sumCalories: SumCalories;
};

export type PerCalories =
  | {
      [key: string]: number;
    }[]
  | null;

export type SumCalories = {
  sum: number;
};
