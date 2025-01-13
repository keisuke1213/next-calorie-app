export interface Place {
  name: string;
  location: { lat: number; lng: number };
  website?: string;
  estimatedCalories?: number;
}
