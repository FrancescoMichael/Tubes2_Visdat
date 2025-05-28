export interface DriverStanding {
  code: string;
  driver_name: string;
  rank: number;
  team_name: string;
  total_points: number;
  wins: number;
}

export interface ConstructorStanding {
  nationality: string;
  rank: number;
  team_name: string;
  total_points: number;
  wins: number;
}

export interface StandingsResponse {
  constructors_championship: {
    standings: ConstructorStanding[];
    title: string;
  };
  drivers_championship: {
    standings: DriverStanding[];
    title: string;
  };
  year: number;
}