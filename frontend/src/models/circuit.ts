export interface CircuitCoordinates {
  altitude: number;
  latitude: number;
  longitude: number;
}

export interface CircuitRace {
  date: string;
  name: string;
  race_id: number;
  round: number;
  time: string;
  total_laps: number;
  url: string;
}

export interface F1Circuit {
  circuit_id: number;
  circuit_ref: string;
  coordinates: CircuitCoordinates;
  country: string;
  location: string;
  name: string;
  races: CircuitRace[];
  url: string;
}

export interface F1Season {
  circuits: F1Circuit[];
  year: number;
}


// Coordinates interface for circuit location
export interface Coordinates {
  altitude: number;
  latitude: number;
  longitude: number;
}

// Circuit information interface
export interface Circuit {
  circuit_id: number;
  coordinates: Coordinates;
  country: string;
  location: string;
  image_url: string;
  last_length_used: string;
  name: string;
  turns: string;
  url: string;
}

// Constructor/Team information interface
export interface Constructor {
  color: string;
  constructor_id: number;
  name: string;
  nationality: string;
}

// Driver information interface
export interface Driver {
  code: string | null;
  driver_id: number;
  name: string;
  nationality: string;
}

// Individual race result interface
export interface RaceResult {
  constructor: Constructor;
  driver: Driver;
  fastest_lap: number | null;
  fastest_lap_time: string | null;
  grid_position: number;
  laps_completed: number;
  points: number;
  position: number;
  race_time: string | null;
  status: string;
}

// Main race data interface
export interface RaceData {
  circuit: Circuit;
  race_date: string;
  race_id: number;
  race_name: string;
  race_time: string | null;
  results: RaceResult[];
  round: number;
  total_laps: number;
}