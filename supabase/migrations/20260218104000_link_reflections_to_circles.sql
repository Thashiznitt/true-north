-- Add circle_id to journal_entries to track where reflections are shared
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS shared_in_circle_id UUID REFERENCES circles(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_circle ON journal_entries(shared_in_circle_id);
