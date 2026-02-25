const db = require('./db');
db.query('ALTER TABLE food_items ADD COLUMN IF NOT EXISTS claimed_by INTEGER, ADD COLUMN IF NOT EXISTS claimed_by_name VARCHAR(255), ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE')
    .then(() => { console.log('Booking columns added!'); process.exit(0); })
    .catch(e => { console.error(e); process.exit(1); });
