from flask import jsonify
from models import db, Race, Result, Driver, Constructor
from sqlalchemy import and_, distinct


def get_season_summary(year):
    try:
        # Unique drivers who participated in any race
        total_drivers = (
            db.session.query(distinct(Result.driverId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(Race.year == year)
            .count()
        )

        # Unique constructors who participated in any race
        total_teams = (
            db.session.query(distinct(Result.constructorId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(Race.year == year)
            .count()
        )

        # === DRIVER STATISTICS ===

        unique_driver_race_winners = (
            db.session.query(distinct(Result.driverId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(and_(Race.year == year, Result.position == 1))
            .count()
        )

        unique_driver_pole_sitters = (
            db.session.query(distinct(Result.driverId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(and_(Race.year == year, Result.grid == 1))
            .count()
        )

        unique_driver_podium_finishers = (
            db.session.query(distinct(Result.driverId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(and_(Race.year == year, Result.position.in_([1, 2, 3])))
            .count()
        )

        # === TEAM STATISTICS ===

        unique_team_race_winners = (
            db.session.query(distinct(Result.constructorId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(and_(Race.year == year, Result.position == 1))
            .count()
        )

        unique_team_pole_sitters = (
            db.session.query(distinct(Result.constructorId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(and_(Race.year == year, Result.grid == 1))
            .count()
        )

        unique_team_podium_finishers = (
            db.session.query(distinct(Result.constructorId))
            .join(Race, Result.raceId == Race.raceId)
            .filter(and_(Race.year == year, Result.position.in_([1, 2, 3])))
            .count()
        )

        response = {
            'year': year,
            'driver_summary': {
            'total_drivers': total_drivers,
            'unique_driver_race_winners': unique_driver_race_winners,
            'unique_driver_pole_sitters': unique_driver_pole_sitters,
            'unique_driver_podium_finishers': unique_driver_podium_finishers,
        },
            'team_summary': {
            'total_teams': total_teams,
            'unique_team_race_winners': unique_team_race_winners,
            'unique_team_pole_sitters': unique_team_pole_sitters,
            'unique_team_podium_finishers': unique_team_podium_finishers
        },
        }
        

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_driver_stats_win(year):
    try:
        races = Race.query.filter_by(year=year).order_by(Race.round).all()
        
        if not races:
            return jsonify({'error': f'No races found for year {year}'}), 404
        
        winners = (
            db.session.query(
                Result,
                Driver,
                Constructor
            )
            .join(Race, Result.raceId == Race.raceId)
            .join(Driver, Result.driverId == Driver.driverId)
            .join(Constructor, Result.constructorId == Constructor.constructorId)
            .filter(
                and_(
                    Race.year == year,
                    Result.position == 1
                )
            )
            .order_by(Race.round)
            .all()
        )
        
        win_counts = {}
        for result, driver, constructor in winners:
            driver_id = driver.driverId
            if driver_id not in win_counts:
                win_counts[driver_id] = {
                    # 'driver_id': driver_id,
                    # 'code': driver.code,
                    'name': f"{driver.forename} {driver.surname}",
                    'color': constructor.color,
                    # 'nationality': driver.nationality,
                    # 'team_name': constructor.name,
                    # 'team_id': constructor.constructorId,
                    'wins': 0,
                    # 'win_details': []
                }
            win_counts[driver_id]['wins'] += 1
            # win_counts[driver_id]['win_details'].append({
            #     'round': result.race.round,
            #     'race_name': result.race.name,
            #     'date': result.race.date.isoformat() if result.race.date else None,
            #     'grid_position': result.grid,
            #     'laps': result.laps,
            #     'time': result.time
            # })
        
        win_stats = sorted(win_counts.values(), key=lambda x: x['wins'], reverse=True)
        
        response = {
            # 'year': year,
            # 'title': f'Race Wins by Driver - {year} Season',
            'stats': win_stats,
            # 'total_races': len(races)
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def get_team_stats_wins(year):
    try:
        races = Race.query.filter_by(year=year).order_by(Race.round).all()

        if not races:
            return jsonify({'error': f'No races found for year {year}'}), 404

        winners = (
            db.session.query(
                Result,
                Constructor
            )
            .join(Race, Result.raceId == Race.raceId)
            .join(Constructor, Result.constructorId == Constructor.constructorId)
            .filter(
                and_(
                    Race.year == year,
                    Result.position == 1
                )
            )
            .order_by(Race.round)
            .all()
        )

        win_counts = {}
        for result, constructor in winners:
            team_id = constructor.constructorId
            if team_id not in win_counts:
                win_counts[team_id] = {
                    'name': constructor.name,
                    'color': constructor.color,
                    'wins': 0
                }
            win_counts[team_id]['wins'] += 1

        win_stats = sorted(win_counts.values(), key=lambda x: x['wins'], reverse=True)

        response = {
            'stats': win_stats
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_driver_stats_pole(year):
    try:
        races = Race.query.filter_by(year=year).order_by(Race.round).all()
        
        if not races:
            return jsonify({'error': f'No races found for year {year}'}), 404
        
        pole_sitters = (
            db.session.query(
                Result,
                Driver,
                Constructor
            )
            .join(Race, Result.raceId == Race.raceId)
            .join(Driver, Result.driverId == Driver.driverId)
            .join(Constructor, Result.constructorId == Constructor.constructorId)
            .filter(
                and_(
                    Race.year == year,
                    Result.grid == 1
                )
            )
            .order_by(Race.round)
            .all()
        )
        
        pole_counts = {}
        for result, driver, constructor in pole_sitters:
            driver_id = driver.driverId
            if driver_id not in pole_counts:
                pole_counts[driver_id] = {
                    # 'driver_id': driver_id,
                    # 'code': driver.code,
                    'name': f"{driver.forename} {driver.surname}",
                    'color': constructor.color,
                    # 'nationality': driver.nationality,
                    # 'team_name': constructor.name,
                    # 'team_id': constructor.constructorId,'color': constructor.color,c
                    'poles': 0,
                    # 'pole_details': []
                }
            pole_counts[driver_id]['poles'] += 1
            # pole_counts[driver_id]['pole_details'].append({
            #     'round': result.race.round,
            #     'race_name': result.race.name,
            #     'date': result.race.date.isoformat() if result.race.date else None,
            #     'final_position': result.position,
            #     'laps': result.laps,
            #     'time': result.time,
            #     'converted_to_win': result.position == 1
            # })
        
        pole_stats = sorted(pole_counts.values(), key=lambda x: x['poles'], reverse=True)
        
        # for stat in pole_stats:
        #     if stat['poles'] > 0:
        #         wins_from_pole = sum(1 for detail in stat['pole_details'] if detail['converted_to_win'])
        #         stat['conversion_rate'] = f"{(wins_from_pole / stat['poles']) * 100:.1f}%"
        #     else:
        #         stat['conversion_rate'] = "0%"
        
        response = {
            # 'year': year,
            # 'title': f'Pole Positions by Driver - {year} Season',
            'stats': pole_stats,
            # 'total_races': len(races)
        }
        
        return jsonify(response)
    
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_team_stats_poles(year):
    try:
        races = Race.query.filter_by(year=year).order_by(Race.round).all()

        if not races:
            return jsonify({'error': f'No races found for year {year}'}), 404

        pole_sitters = (
            db.session.query(
                Result,
                Constructor
            )
            .join(Race, Result.raceId == Race.raceId)
            .join(Constructor, Result.constructorId == Constructor.constructorId)
            .filter(
                and_(
                    Race.year == year,
                    Result.grid == 1
                )
            )
            .order_by(Race.round)
            .all()
        )

        pole_counts = {}
        for result, constructor in pole_sitters:
            team_id = constructor.constructorId
            if team_id not in pole_counts:
                pole_counts[team_id] = {
                    'name': constructor.name,
                    'color': constructor.color,
                    'poles': 0
                }
            pole_counts[team_id]['poles'] += 1

        pole_stats = sorted(pole_counts.values(), key=lambda x: x['poles'], reverse=True)

        response = {
            'stats': pole_stats
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
