from flask import jsonify
from models import db, Race, DriverStanding, ConstructorStanding, Driver, Constructor, Result
from sqlalchemy import and_

def get_standings(year):
    """Get both driver and constructor final championship standings for a specific year"""
    try:
        # Find the last race of the year
        last_race = Race.query.filter_by(year=year).order_by(Race.round.desc()).first()
        
        if not last_race:
            return jsonify({'error': f'No data available for year {year}'}), 404
        
        # Get driver standings with team information
        driver_standings_query = (
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
            .all()
        )
        
        # Fallback method if no direct results found
        if not driver_standings_query:
            driver_standings_basic = (
                db.session.query(DriverStanding, Driver)
                .join(Driver, DriverStanding.driverId == Driver.driverId)
                .filter(DriverStanding.raceId == last_race.raceId)
                .order_by(DriverStanding.position)
                .all()
            )
            
            drivers = []
            for ds, driver in driver_standings_basic:
                # Find the most recent team for this driver in this year
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
                
                drivers.append({
                    'rank': ds.position,
                    'driver_name': f"{driver.forename} {driver.surname}",
                    'team_name': team_name,
                    'total_points': float(ds.points) if ds.points else 0,
                    'wins': ds.wins or 0,
                    'code': driver.code
                })
        else:
            drivers = []
            for ds, driver, constructor in driver_standings_query:
                drivers.append({
                    'rank': ds.position,
                    'driver_name': f"{driver.forename} {driver.surname}",
                    'team_name': constructor.name,
                    'total_points': float(ds.points) if ds.points else 0,
                    'wins': ds.wins or 0,
                    'code': driver.code
                })
        
        # Get constructor standings
        constructor_standings = (
            db.session.query(ConstructorStanding, Constructor)
            .join(Constructor, ConstructorStanding.constructorId == Constructor.constructorId)
            .filter(ConstructorStanding.raceId == last_race.raceId)
            .order_by(ConstructorStanding.position)
            .all()
        )
        
        constructors = []
        for cs, constructor in constructor_standings:
            constructors.append({
                'rank': cs.position,
                'team_name': constructor.name,
                'total_points': float(cs.points) if cs.points else 0,
                'wins': cs.wins or 0,
                'nationality': constructor.nationality
            })
        
        return jsonify({
            'year': year,
            'drivers_championship': {
                'title': 'Drivers Championship Final Standings',
                'standings': drivers
            },
            'constructors_championship': {
                'title': 'Constructors Championship Final Standings',
                'standings': constructors
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# get_driver_standings(year) and get_constructor_standings(year) similarly here

def get_driver_standings(year):
    """Get final driver championship standings for a specific year with team information"""
    try:
        # Find the last race of the year
        last_race = Race.query.filter_by(year=year).order_by(Race.round.desc()).first()
        
        if not last_race:
            return jsonify({'error': f'No data available for year {year}'}), 404
        
        # Get driver standings with team information
        # We need to join with results to get the constructor (team) for each driver
        standings_query = (
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
            .all()
        )
        
        # If no results found, try to get constructor info from the most recent race result
        if not standings_query:
            standings_query = (
                db.session.query(DriverStanding, Driver)
                .join(Driver, DriverStanding.driverId == Driver.driverId)
                .filter(DriverStanding.raceId == last_race.raceId)
                .order_by(DriverStanding.position)
                .all()
            )
            
            drivers = []
            for ds, driver in standings_query:
                # Find the most recent constructor for this driver in this year
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
                
                drivers.append({
                    'rank': ds.position,
                    'driver_name': f"{driver.forename} {driver.surname}",
                    'team_name': team_name,
                    'total_points': float(ds.points) if ds.points else 0,
                    'wins': ds.wins or 0,
                    'code': driver.code,
                    'nationality': driver.nationality
                })
        else:
            drivers = []
            for ds, driver, constructor in standings_query:
                drivers.append({
                    'rank': ds.position,
                    'driver_name': f"{driver.forename} {driver.surname}",
                    'team_name': constructor.name,
                    'total_points': float(ds.points) if ds.points else 0,
                    'wins': ds.wins or 0,
                    'code': driver.code,
                    'nationality': driver.nationality
                })
        
        return jsonify({
            'year': year,
            'championship': 'Drivers Championship',
            'final_standings': drivers
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def get_constructor_standings(year):
    """Get final constructor championship standings for a specific year"""
    try:
        last_race = Race.query.filter_by(year=year).order_by(Race.round.desc()).first()
        
        if not last_race:
            return jsonify({'error': f'No data available for year {year}'}), 404
        
        constructor_standings = (
            db.session.query(ConstructorStanding, Constructor)
            .join(Constructor, ConstructorStanding.constructorId == Constructor.constructorId)
            .filter(ConstructorStanding.raceId == last_race.raceId)
            .order_by(ConstructorStanding.position)
            .all()
        )
        
        constructors = []
        for cs, constructor in constructor_standings:
            constructors.append({
                'rank': cs.position,
                'team_name': constructor.name,
                'total_points': float(cs.points) if cs.points else 0,
                'wins': cs.wins or 0,
                'nationality': constructor.nationality
            })
        
        return jsonify({
            'year': year,
            'championship': 'Constructors Championship',
            'final_standings': constructors
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500