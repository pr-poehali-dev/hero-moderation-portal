CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    nick VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    phone VARCHAR(50),
    online_hours VARCHAR(50),
    about TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'sent',
    admin_comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_nick ON applications (LOWER(nick));
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);
