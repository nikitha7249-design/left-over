const db = require('./db');
db.query('ALTER TABLE food_items ADD COLUMN IF NOT EXISTS food_type VARCHAR(50), ADD COLUMN IF NOT EXISTS event_name VARCHAR(255), ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20), ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(100), ADD COLUMN IF NOT EXISTS address TEXT')
    .then(() => { console.log('Migration done!'); process.exit(0); })
    .catch(e => { console.error(e); process.exit(1); });
