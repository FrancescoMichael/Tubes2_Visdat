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

export interface WinsResponse {
  stats: {
    color: string,
    name: string,
    wins: number,
  }[]
}