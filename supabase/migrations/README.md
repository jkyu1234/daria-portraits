# Supabase Migrations

## How to apply migrations

All SQL migration files need to be executed manually via the Supabase Dashboard SQL Editor.

1. Go to https://supabase.com/dashboard/project/cadpnylxtkacvvxqjtjb
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Paste the entire contents of the SQL file
5. Click **Run** (or press Ctrl+Enter)

## Migration order

### Step 1: 001_schema.sql (already applied)

Creates all required tables, enables Row Level Security, and applies RLS policies:
- `user_profiles` - extends Supabase auth.users
- `chat_sessions` - chat conversation sessions
- `chat_messages` - individual chat messages with emotion scores
- `affection_history` - tracks affection level changes
- `user_achievements` - unlocked achievement badges
- `daria_social_entries` - social media content pool
- `social_reactions` - user reactions to social entries

### Step 2: 002_seed_social.sql

Populates the `daria_social_entries` table with 20 seed entries (15 show memories and 5 late night thoughts) written in Daria's authentic voice.

Run this after 001_schema.sql to populate the social media content that appears in the Journal Panel.
