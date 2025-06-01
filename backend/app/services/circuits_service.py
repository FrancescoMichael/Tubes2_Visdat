from flask import jsonify
from models import db, Race, Circuit, Result, Driver, Constructor, DriverStanding, ConstructorStanding, Status
from sqlalchemy import and_, func

def get_circuits_with_results(year, circuit_id=0):
    try:
        race_query = (
            db.session.query(Race, Circuit)
            .join(Circuit, Race.circuitId == Circuit.circuitId)
            .filter(Race.year == year, Race.circuitId == circuit_id)
            .order_by(Race.round)
            .first()
        )
        
        if not race_query:
            return jsonify({'error': f'No race found for year {year} and circuit ID {circuit_id}'}), 404

        race, circuit = race_query

        results = get_driver_race_results(race.raceId)
        
        total_laps = get_race_total_laps(race.raceId)
        
        circuit_info = {
            'race_id': race.raceId,
            'round': race.round,
            'race_name': race.name,
            'race_date': race.date.isoformat() if race.date else None,
            'circuit': {
                'circuit_id': circuit.circuitId,
                'name': circuit.name,
                'location': circuit.location,
                'country': circuit.country,
                'coordinates': {
                    'latitude': float(circuit.lat) if circuit.lat else None,
                    'longitude': float(circuit.lng) if circuit.lng else None,
                    'altitude': circuit.alt
                },
                'url': circuit.url
            },
            'total_laps': total_laps,
            'race_time': race.time.strftime('%H:%M:%S') if race.time else None,
            'results': results
        }

        return jsonify(circuit_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
def get_driver_race_results(race_id):
    try:
        results_query = (
            db.session.query(Result, Driver, Constructor)
            .join(Driver, Result.driverId == Driver.driverId)
            .join(Constructor, Result.constructorId == Constructor.constructorId)
            .filter(Result.raceId == race_id)
            .order_by(Result.positionOrder)
            .all()
        )
        
        results = []
        for result, driver, constructor in results_query:
            is_finished = result.position is not None
            results.append({
                'position': result.position or result.positionText or 'DNF',
                'driver': {
                    'driver_id': driver.driverId,
                    'code': driver.code,
                    'name': f"{driver.forename} {driver.surname}",
                    'nationality': driver.nationality
                },
                'constructor': {
                    'constructor_id': constructor.constructorId,
                    'name': constructor.name,
                    'color': constructor.color,
                    'nationality': constructor.nationality
                },
                'grid_position': result.grid,
                'points': float(result.points) if result.points else 0,
                'laps_completed': result.laps,
                'race_time': result.time,
                'fastest_lap': result.fastestLap,
                'fastest_lap_time': result.fastestLapTime,
                'status': get_result_status(result.statusId) if result.statusId else ('Finished' if is_finished else 'DNF')
            })

        return results[:10]

    except Exception as e:
        print(f"Error getting driver results: {e}")
        return []

    
def get_result_status(status_id):
    try:
        status = db.session.query(Status).filter(Status.statusId == status_id).first()
        return status.status if status else 'Unknown'
    except Exception as e:
        print(f"Error getting status: {e}")
        return 'Unknown'

def get_race_total_laps(race_id):
    try:
        max_laps = (
            db.session.query(func.max(Result.laps))
            .filter(Result.raceId == race_id)
            .scalar()
        )
        return max_laps or 0
    except Exception as e:
        print(f"Error getting total laps: {e}")
        return 0
    
def get_circuits_by_year(year):
    try:
        races_query = (
            db.session.query(Race, Circuit)
            .join(Circuit, Race.circuitId == Circuit.circuitId)
            .filter(Race.year == year)
            .order_by(Race.date, Race.time)
            .all()
        )

        if not races_query:
            return jsonify({'error': f'No races found for year {year}'}), 404

        circuits_dict = {}

        for race, circuit in races_query:
            if circuit.circuitId not in circuits_dict:
                circuits_dict[circuit.circuitId] = {
                    'circuit_id': circuit.circuitId,
                    'circuit_ref': circuit.circuitRef,
                    'name': circuit.name,
                    'location': circuit.location,
                    'country': circuit.country,
                    'coordinates': {
                        'latitude': circuit.lat,
                        'longitude': circuit.lng,
                        'altitude': circuit.alt
                    },
                    'url': circuit.url,
                    'races': []
                }

            circuits_dict[circuit.circuitId]['races'].append({
                'race_id': race.raceId,
                'round': race.round,
                'total_laps': get_race_total_laps(race.raceId),
                'name': race.name,
                'date': race.date.isoformat() if race.date else None,
                'time': race.time.strftime('%H:%M:%S') if race.time else None,
                'url': race.url
            })

        return jsonify({
            'year': year,
            'circuits': list(circuits_dict.values())
        })

    except ValueError:
        return jsonify({'error': 'Invalid year format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
def get_circuits_details(circuit_id):
    try:
        circuit = Circuit.query.filter_by(circuitId=circuit_id).first()
        
        if not circuit:
            return jsonify({'error': f'Circuit with ID {circuit_id} not found'}), 404
        
        circuit_data = {
            'circuit_id': circuit.circuitId,
            'circuit_ref': circuit.circuitRef,
            'name': circuit.name,
            'location': circuit.location,
            'country': circuit.country,
            'coordinates': {
                'latitude': float(circuit.lat) if circuit.lat is not None else None,
                'longitude': float(circuit.lng) if circuit.lng is not None else None,
                'altitude': circuit.alt
            },
            'url': circuit.url,
        }
        
        return jsonify(circuit_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500