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
  total_drivers: number,
  total_teams: number,
  unique_podium_finishers: number,
  unique_pole_sitters: number,
  unique_race_winners: number,
  years: number,
}

export interface WinsResponse {
  stats: {
    color: string,
    name: string,
    wins: number,
  }[]
}