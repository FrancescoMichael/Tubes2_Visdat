export interface YearsResponse {
  years: number[]
}

export interface PolesResponse {
  stats: {
    color: string,
    name: string,
    poles: number,
  }[]
}

export interface SummaryResponse {
  years: number,
  driver_summary: DriverSummary,
  team_summary: TeamSummary,
}

export interface DriverSummary{
  total_drivers: number,
  unique_driver_podium_finishers	: number,
  unique_driver_pole_sitters: number,
  unique_driver_race_winners	: number,
}

export interface TeamSummary {
  total_teams: number,
  unique_team_podium_finishers: number,
  unique_team_pole_sitters: number,
  unique_team_race_winners: number,
}

export interface WinsResponse {
  stats: {
    color: string,
    name: string,
    wins: number,
  }[]
}