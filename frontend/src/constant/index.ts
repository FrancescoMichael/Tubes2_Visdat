/*
# Get 2023 final driver standings
http://localhost:5000/api/standings/drivers/2023

# Get 2022 final constructor standings  
http://localhost:5000/api/standings/constructors/2022

# Get both championships for 2021
http://localhost:5000/api/standings/2021

# Get all available years
http://localhost:5000/api/years

http://localhost:5000/api/journeys/drivers/2024

http://localhost:5000/api/journeys/constructors/2024

http://localhost:5000/api/stats/poles/2024

http://localhost:5000/api/stats/wins/2024
*/

export const API_BASE_URL = "http://localhost:5000/api";

export const API_DRIVER_STANDINGS = `${API_BASE_URL}/standings/drivers`;
export const API_CONSTRUCTOR_STANDINGS = `${API_BASE_URL}/standings/constructors`;
export const API_STANDINGS = `${API_BASE_URL}/standings`;

export const API_CIRCUITS = `${API_BASE_URL}/circuits`;
export const API_CIRCUITS_RESULT = `${API_BASE_URL}/circuits/results`;

export const API_YEARS = `${API_BASE_URL}/years`;

export const API_DRIVER_JOURNEYS = `${API_BASE_URL}/journeys/drivers`;
export const API_CONSTRUCTOR_JOURNEYS = `${API_BASE_URL}/journeys/constructors`;

export const API_STATS_POLES = `${API_BASE_URL}/stats/poles`;
export const API_STATS_WINS = `${API_BASE_URL}/stats/wins`;
export const API_STATS_SUMMARY = `${API_BASE_URL}/stats/summary`;