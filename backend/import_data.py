import pandas as pd
from datetime import datetime
import os
from app import create_app
from models import db, Driver, Constructor, Race, DriverStanding, ConstructorStanding, Result

def clean_data(df):
    df = df.replace('\\N', None)
    df = df.replace(r'\N', None)
    df = df.replace('', None)
    
    df = df.where(pd.notna(df), None)
    
    return df

def table_exists_and_has_data(model):
    try:
        count = db.session.query(model).count()
        return count > 0
    except:
        return False

def import_drivers():
    if table_exists_and_has_data(Driver):
        print(" Drivers table already has data, skipping...")
        return
        
    print("Importing drivers...")
    df = pd.read_csv('data/drivers.csv')
    df = clean_data(df)
    
    try:
        for _, row in df.iterrows():
            existing = Driver.query.filter_by(driverId=row['driverId']).first()
            if not existing:
                driver = Driver(
                    driverId=row['driverId'],
                    driverRef=row['driverRef'],
                    number=int(row['number']) if row['number'] is not None else None,
                    code=row['code'],
                    forename=row['forename'],
                    surname=row['surname'],
                    dob=datetime.strptime(row['dob'], '%Y-%m-%d').date() if row['dob'] else None,
                    nationality=row['nationality'],
                    url=row['url']
                )
                db.session.add(driver)
        
        db.session.commit()
        print(f" Successfully imported {len(df)} drivers")
    except Exception as e:
        db.session.rollback()
        print(f" Error importing drivers: {e}")
        raise

def import_constructors():
    if table_exists_and_has_data(Constructor):
        print(" Constructors table already has data, skipping...")
        return
        
    print("Importing constructors...")
    df = pd.read_csv('data/constructors.csv')
    df = clean_data(df)
    
    try:
        for _, row in df.iterrows():
            existing = Constructor.query.filter_by(constructorId=row['constructorId']).first()
            if not existing:
                constructor = Constructor(
                    constructorId=row['constructorId'],
                    constructorRef=row['constructorRef'],
                    name=row['name'],
                    nationality=row['nationality'],
                    url=row['url'],
                    color=row['color']
                )
                db.session.add(constructor)
        
        db.session.commit()
        print(f" Successfully imported {len(df)} constructors")
    except Exception as e:
        db.session.rollback()
        print(f" Error importing constructors: {e}")
        raise

def import_races():
    if table_exists_and_has_data(Race):
        print(" Races table already has data, skipping...")
        return
        
    print("Importing races...")
    df = pd.read_csv('data/races.csv')
    df = clean_data(df)
    
    def parse_time(time_str):
        """Convert time string to Python time object"""
        if time_str is None or pd.isna(time_str):
            return None
        try:
            # Parse time string in format "HH:MM:SS"
            return datetime.strptime(time_str, '%H:%M:%S').time()
        except:
            return None
    
    try:
        for _, row in df.iterrows():
            existing = Race.query.filter_by(raceId=row['raceId']).first()
            if not existing:
                race_data = {
                    'raceId': row['raceId'],
                    'year': int(row['year']),
                    'round': int(row['round']),
                    'circuitId': int(row['circuitId']),
                    'name': row['name'],
                    'date': datetime.strptime(row['date'], '%Y-%m-%d').date() if row['date'] else None,
                    'time': parse_time(row['time']),
                    'url': row['url']
                }
                
                # Add optional fields if they exist in the CSV
                optional_fields = [
                    'fp1_date', 'fp1_time', 'fp2_date', 'fp2_time', 
                    'fp3_date', 'fp3_time', 'quali_date', 'quali_time',
                    'sprint_date', 'sprint_time'
                ]
                
                for field in optional_fields:
                    if field in row:
                        if field.endswith('_time'):
                            race_data[field] = parse_time(row[field])
                        elif field.endswith('_date'):
                            race_data[field] = datetime.strptime(row[field], '%Y-%m-%d').date() if row[field] else None
                        else:
                            race_data[field] = row[field]
                
                race = Race(**race_data)
                db.session.add(race)
        
        db.session.commit()
        print(f" Successfully imported {len(df)} races")
    except Exception as e:
        db.session.rollback()
        print(f" Error importing races: {e}")
        raise

def import_results():
    if table_exists_and_has_data(Result):
        print(" Results table already has data, skipping...")
        return
        
    print("Importing race results...")
    df = pd.read_csv('data/results.csv')
    df = clean_data(df)
    
    try:
        batch_size = 1000
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i+batch_size]
            
            for _, row in batch.iterrows():
                existing = Result.query.filter_by(resultId=row['resultId']).first()
                if not existing:
                    result = Result(
                        resultId=row['resultId'],
                        raceId=int(row['raceId']),
                        driverId=int(row['driverId']),
                        constructorId=int(row['constructorId']),
                        number=int(row['number']) if row['number'] is not None else None,
                        grid=int(row['grid']) if row['grid'] is not None else None,
                        position=int(row['position']) if row['position'] is not None else None,
                        positionText=row['positionText'],
                        positionOrder=int(row['positionOrder']),
                        points=float(row['points']) if row['points'] is not None else 0.0,
                        laps=int(row['laps']) if row['laps'] is not None else 0,
                        time=row['time'],
                        milliseconds=int(row['milliseconds']) if row['milliseconds'] is not None else None,
                        fastestLap=int(row['fastestLap']) if row['fastestLap'] is not None else None,
                        rank=int(row['rank']) if row['rank'] is not None else None,
                        fastestLapTime=row['fastestLapTime'],
                        fastestLapSpeed=float(row['fastestLapSpeed']) if row['fastestLapSpeed'] is not None else None,
                        statusId=int(row['statusId'])
                    )
                    db.session.add(result)
            
            db.session.commit()
            print(f" Imported batch {i//batch_size + 1}: {len(batch)} results")
        
        print(f" Successfully imported all race results")
    except Exception as e:
        db.session.rollback()
        print(f" Error importing results: {e}")
        raise

def import_driver_standings():
    if table_exists_and_has_data(DriverStanding):
        print(" Driver standings table already has data, skipping...")
        return
        
    print("Importing driver standings...")
    df = pd.read_csv('data/driver_standings.csv')
    df = clean_data(df)
    
    try:
        batch_size = 1000
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i+batch_size]
            
            for _, row in batch.iterrows():
                existing = DriverStanding.query.filter_by(driverStandingsId=row['driverStandingsId']).first()
                if not existing:
                    standing = DriverStanding(
                        driverStandingsId=row['driverStandingsId'],
                        raceId=int(row['raceId']),
                        driverId=int(row['driverId']),
                        points=float(row['points']) if row['points'] is not None else 0.0,
                        position=int(row['position']) if row['position'] is not None else None,
                        positionText=row['positionText'],
                        wins=int(row['wins']) if row['wins'] is not None else 0
                    )
                    db.session.add(standing)
            
            db.session.commit()
            print(f" Imported batch {i//batch_size + 1}: {len(batch)} driver standings")
        
        print(f" Successfully imported all driver standings")
    except Exception as e:
        db.session.rollback()
        print(f" Error importing driver standings: {e}")
        raise

def import_constructor_standings():
    if table_exists_and_has_data(ConstructorStanding):
        print(" Constructor standings table already has data, skipping...")
        return
        
    print("Importing constructor standings...")
    df = pd.read_csv('data/constructor_standings.csv')
    df = clean_data(df)
    
    try:
        batch_size = 1000
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i+batch_size]
            
            for _, row in batch.iterrows():
                existing = ConstructorStanding.query.filter_by(constructorStandingsId=row['constructorStandingsId']).first()
                if not existing:
                    standing = ConstructorStanding(
                        constructorStandingsId=row['constructorStandingsId'],
                        raceId=int(row['raceId']),
                        constructorId=int(row['constructorId']),
                        points=float(row['points']) if row['points'] is not None else 0.0,
                        position=int(row['position']) if row['position'] is not None else None,
                        positionText=row['positionText'],
                        wins=int(row['wins']) if row['wins'] is not None else 0
                    )
                    db.session.add(standing)
            
            db.session.commit()
            print(f" Imported batch {i//batch_size + 1}: {len(batch)} constructor standings")
        
        print(f" Successfully imported all constructor standings")
    except Exception as e:
        db.session.rollback()
        print(f" Error importing constructor standings: {e}")
        raise

def clear_all_data():
    print("⚠️  Clearing all data from database...")
    try:
        db.session.query(ConstructorStanding).delete()
        db.session.query(DriverStanding).delete()
        db.session.query(Result).delete()
        db.session.query(Race).delete()
        db.session.query(Constructor).delete()
        db.session.query(Driver).delete()
        db.session.commit()
        print(" All data cleared successfully")
    except Exception as e:
        db.session.rollback()
        print(f" Error clearing data: {e}")
        raise

def check_data_files():
    required_files = [
        'data/drivers.csv',
        'data/constructors.csv', 
        'data/races.csv',
        'data/results.csv',
        'data/driver_standings.csv',
        'data/constructor_standings.csv'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(" Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print(" All required CSV files found")
    return True

def main():
    print("Formula 1 Data Import Script")
    print("=" * 40)
    
    if not check_data_files():
        print("\n Please ensure all CSV files are in the 'data/' directory")
        return
    
    app = create_app()
    with app.app_context():
        try:
            print("\nCreating database tables...")
            db.create_all()
            print(" Database tables created")
            
            import_drivers()
            import_constructors()
            import_races()
            import_results()
            import_driver_standings()
            import_constructor_standings()
            
            print("\n" + "=" * 40)
            print("Data import completed successfully!")
            print("\nDatabase Summary:")
            print(f"   - Drivers: {Driver.query.count()}")
            print(f"   - Constructors: {Constructor.query.count()}")
            print(f"   - Races: {Race.query.count()}")
            print(f"   - Results: {Result.query.count()}")
            print(f"   - Driver Standings: {DriverStanding.query.count()}")
            print(f"   - Constructor Standings: {ConstructorStanding.query.count()}")
            
        except Exception as e:
            print(f"\n Import failed: {e}")
            print("\nIf you want to start fresh, you can:")
            print("1. Delete the database file (f1_api.db)")
            print("2. Or uncomment the clear_all_data() call below")
            raise

if __name__ == '__main__':
    main()