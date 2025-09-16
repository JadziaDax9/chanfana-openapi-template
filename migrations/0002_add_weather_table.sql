-- Migration number: 0002 	 2025-09-16T12:00:00.000Z
CREATE TABLE IF NOT EXISTS weather (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    temperature REAL NOT NULL,
    humidity INTEGER NOT NULL,
    description TEXT NOT NULL,
    wind_speed REAL NOT NULL,
    recorded_at DATETIME NOT NULL
);