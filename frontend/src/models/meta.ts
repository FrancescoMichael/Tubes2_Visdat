export interface YearsResponse {
  years: number[]
}

export interface PolesResponse {
  stats: {
    color: string,
    driver_name: string,
    poles: number,
  }[]
}

export interface WinsResponse {
  stats: {
    color: string,
    driver_name: string,
    wins: number,
  }[]
}