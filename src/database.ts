import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite", { create: true });

type TestResult = { id: number, date: string, time: number, accuracy: number };

async function createTables() {
    db.query(`
        CREATE TABLE IF NOT EXISTS test_result (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            time REAL,
            accuracy REAL
        );
    `).run();
}

export function saveTestResult(date: Date, time: number, accuracy: number) {
    createTables();
    db.query(`
        INSERT INTO test_result (date, time, accuracy)
        VALUES ($date, $time, $accuracy);
    `).run({
        $date: date.toISOString().replace('T', ' ').slice(0, 19),
        $time: time,
        $accuracy: accuracy,
    });
}

export function getTestsResults(): TestResult[] {
    createTables();
    return db.query("SELECT id, date, time, accuracy FROM test_result").all() as TestResult[];
}

