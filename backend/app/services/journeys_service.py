from flask import jsonify
from models import db, Race, DriverStanding, Driver, Constructor, Result, ConstructorStanding
from sqlalchemy import and_

def get_top3_points_journey(year):
    try:
        races = Race.query.filter_by(year=year).order_by(Race.round).all()
        
        if not races:
            return jsonify({'error': f'No races found for year {year}'}), 404
        
        last_race = races[-1]
        
        top3_drivers_query = (
            db.session.query(
                DriverStanding,
                Driver,
                Constructor
            )
            .join(Driver, DriverStanding.driverId == Driver.driverId)
            .join(
                Result, 
                and_(
                    Result.driverId == DriverStanding.driverId,
                    Result.raceId == last_race.raceId
                )
            )
            .join(Constructor, Result.constructorId == Constructor.constructorId)
            .filter(DriverStanding.raceId == last_race.raceId)
            .order_by(DriverStanding.position)
            .limit(3)
            .all()
        )
        
        top3_drivers = []
        if top3_drivers_query:
            for ds, driver, constructor in top3_drivers_query:
                top3_drivers.append({
                    'driver_id': driver.driverId,
                    'code': driver.code,
                    'color' : constructor.color,
                    'driver_name': f"{driver.forename} {driver.surname}",
                    'nationality': driver.nationality,
                    'team_name': constructor.name,
                    'final_rank': ds.position,
                    'final_points': float(ds.points) if ds.points else 0,
                    'final_wins': ds.wins or 0
                })
        else:
            top3_basic = (
                db.session.query(DriverStanding, Driver)
                .join(Driver, DriverStanding.driverId == Driver.driverId)
                .filter(DriverStanding.raceId == last_race.raceId)
                .order_by(DriverStanding.position)
                .limit(3)
                .all()
            )
            
            for ds, driver in top3_basic:
                recent_result = (
                    db.session.query(Result, Constructor)
                    .join(Constructor, Result.constructorId == Constructor.constructorId)
                    .join(Race, Result.raceId == Race.raceId)
                    .filter(
                        and_(
                            Result.driverId == driver.driverId,
                            Race.year == year
                        )
                    )
                    .order_by(Race.round.desc())
                    .first()
                )
                
                team_name = recent_result[1].name if recent_result else "Unknown Team"
                
                top3_drivers.append({
                    'driver_id': driver.driverId,
                    'code': driver.code,
                    'color': None, 
                    'driver_name': f"{driver.forename} {driver.surname}",
                    'nationality': driver.nationality,
                    'team_name': team_name,
                    'final_rank': ds.position,
                    'final_points': float(ds.points) if ds.points else 0,
                    'final_wins': ds.wins or 0
                })
        
        driver_ids = [driver['driver_id'] for driver in top3_drivers]
        
        all_race_results = (
            db.session.query(Result, Race)
            .join(Race, Result.raceId == Race.raceId)
            .filter(
                and_(
                    Result.driverId.in_(driver_ids),
                    Race.year == year
                )
            )
            .order_by(Race.round)
            .all()
        )
        
        all_standings = (
            db.session.query(DriverStanding, Race)
            .join(Race, DriverStanding.raceId == Race.raceId)
            .filter(
                and_(
                    DriverStanding.driverId.in_(driver_ids),
                    Race.year == year
                )
            )
            .order_by(Race.round, DriverStanding.position)
            .all()
        )
        
        points_journey = {driver['driver_id']: [] for driver in top3_drivers}
        
        race_results_map = {}
        for result, race in all_race_results:
            key = (result.driverId, race.raceId)
            race_results_map[key] = result.position
        
        for standing, race in all_standings:
            race_position_key = (standing.driverId, race.raceId)
            race_position = race_results_map.get(race_position_key, None)
            
            points_journey[standing.driverId].append({
                'round': race.round,
                'race_name': race.name.replace("Grand Prix", "GP"),
                'date': race.date.isoformat() if race.date else None,
                'position': race_position,
                'points': float(standing.points) if standing.points else 0,
                'wins': standing.wins or 0
            })
        
        for driver_id, journey in points_journey.items():
            cumulative_points = 0
            for i, race in enumerate(journey):
                if i == 0:
                    race['points_this_race'] = race['points']
                else:
                    race['points_this_race'] = race['points'] - journey[i-1]['points']
                cumulative_points = race['points']
                race['cumulative_points'] = cumulative_points
        
        response_data = {
            'year': year,
            'title': f'Top 3 Drivers Points Journey - {year} Season',
            'drivers': []
        }
        
        for driver in top3_drivers:
            driver_id = driver['driver_id']
            response_data['drivers'].append({
                'rank': driver['final_rank'],
                'code': driver['code'],
                'color': driver['color'],
                'driver_name': driver['driver_name'],
                'nationality': driver['nationality'],
                'team_name': driver['team_name'],
                'final_points': driver['final_points'],
                'final_wins': driver['final_wins'],
                'points_journey': points_journey.get(driver_id, [])
            })
        
        return response_data
    
    except Exception as e:
        return {'error': str(e)}, 500

def get_driver_journeys(year):
    try:
        result = get_top3_points_journey(year)
        
        if isinstance(result, tuple) and result[1] != 200:
            return jsonify(result[0]), result[1]
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_constructor_journeys(year):
    try:
        races = Race.query.filter_by(year=year).order_by(Race.round).all()
        
        if not races:
            return jsonify({'error': f'No races found for year {year}'}), 404
        
        last_race = races[-1]
        
        top3_constructors = (
            db.session.query(ConstructorStanding, Constructor)
            .join(Constructor, ConstructorStanding.constructorId == Constructor.constructorId)
            .filter(ConstructorStanding.raceId == last_race.raceId)
            .order_by(ConstructorStanding.position)
            .limit(3)
            .all()
        )
        
        constructors_data = []
        for cs, constructor in top3_constructors:
            constructors_data.append({
                'constructor_id': constructor.constructorId,
                'name': constructor.name,
                'color': constructor.color,
                'nationality': constructor.nationality,
                'final_rank': cs.position,
                'final_points': float(cs.points) if cs.points else 0,
                'final_wins': cs.wins or 0
            })
        
        constructor_ids = [c['constructor_id'] for c in constructors_data]
        
        # Get constructor race results - best position per race
        constructor_race_results = (
            db.session.query(
                Result.constructorId,
                Race.raceId,
                Race.round,
                Race.name,
                Race.date,
                db.func.min(Result.position).label('best_position')
            )
            .join(Race, Result.raceId == Race.raceId)
            .filter(
                and_(
                    Result.constructorId.in_(constructor_ids),
                    Race.year == year,
                    Result.position.isnot(None)
                )
            )
            .group_by(Result.constructorId, Race.raceId, Race.round, Race.name, Race.date)
            .order_by(Race.round)
            .all()
        )
        
        all_standings = (
            db.session.query(ConstructorStanding, Race)
            .join(Race, ConstructorStanding.raceId == Race.raceId)
            .filter(
                and_(
                    ConstructorStanding.constructorId.in_(constructor_ids),
                    Race.year == year
                )
            )
            .order_by(Race.round, ConstructorStanding.position)
            .all()
        )
        
        points_journey = {c['constructor_id']: [] for c in constructors_data}
        
        race_results_map = {}
        for result in constructor_race_results:
            key = (result.constructorId, result.raceId)
            race_results_map[key] = {
                'round': result.round,
                'race_name': result.name.replace("Grand Prix", "GP"),
                'date': result.date.isoformat() if result.date else None,
                'best_position': result.best_position
            }
        
        for standing, race in all_standings:
            key = (standing.constructorId, race.raceId)
            race_data = race_results_map.get(key, {})
            
            points_journey[standing.constructorId].append({
                'round': race.round,
                'race_name': race.name.replace("Grand Prix", "GP"),
                'date': race.date.isoformat() if race.date else None,
                'position': race_data.get('best_position', None),
                'points': float(standing.points) if standing.points else 0,
                'wins': standing.wins or 0
            })
        
        for constructor_id, journey in points_journey.items():
            cumulative_points = 0
            for i, race in enumerate(journey):
                if i == 0:
                    race['points_this_race'] = race['points']
                else:
                    race['points_this_race'] = race['points'] - journey[i-1]['points']
                cumulative_points = race['points']
                race['cumulative_points'] = cumulative_points
        
        response_data = {
            'year': year,
            'title': f'Top 3 Constructors Points Journey - {year} Season',
            'constructors': []
        }
        
        for constructor in constructors_data:
            constructor_id = constructor['constructor_id']
            response_data['constructors'].append({
                'rank': constructor['final_rank'],
                'color': constructor['color'],
                'name': constructor['name'],
                'nationality': constructor['nationality'],
                'final_points': constructor['final_points'],
                'final_wins': constructor['final_wins'],
                'points_journey': points_journey.get(constructor_id, [])
            })
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500