export interface DriverJourney {
  code: string;
  driver_name: string;
  final_points: number;
  final_wins: number;
  nationality: string;
  points_journey: PointsEntry[];
  rank: number;
  team_name: string;
}

export interface PointsEntry {
  cumulative_points: number;
  date: string;
  points: number;
  points_this_race: number;
  position: number;
  race_name: string;
  round: number;
  wins: number;
}

export interface DriverJourneysResponse {
  drivers: DriverJourney[];
  title: string;
  year: number;
}

export interface ConstructorJourney {
  final_points: number;
  final_wins: number;
  name: string;
  nationality: string;
  points_journey: PointsEntry[];
  rank: number;
}

export interface ConstructorJourneyResponse {
  constructors: ConstructorJourney[];
  title: string;
  year: number;
}