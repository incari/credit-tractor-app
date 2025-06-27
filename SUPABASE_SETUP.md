# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: "Budgeter" (or your preferred name)
   - Database Password: (generate a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure Site URL:
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

### Enable Google OAuth (Optional)

1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Configure authorized redirect URIs in Google Console:
   - `https://your-project-id.supabase.co/auth/v1/callback`

## 3. Run the Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the entire content from `supabase-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

## 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Get your project URL and anon key from:
   - Settings > API in your Supabase dashboard
3. Update the values in `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   \`\`\`

## 5. Install Dependencies

\`\`\`bash
npm install @supabase/supabase-js @tanstack/react-query @tanstack/react-query-devtools
\`\`\`

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Try signing up with email or Google
4. Create a test payment plan
5. Verify data appears in your Supabase dashboard

## 7. Row Level Security (RLS)

The schema automatically sets up RLS policies to ensure:
- Users can only see their own data
- All operations are properly secured
- Data isolation between users

## 8. Database Structure

### Tables Created:
- `payments`: Stores payment plans and installment data
- `credit_cards`: Stores user credit card information
- `user_settings`: Stores user preferences and settings

### Features:
- Automatic user settings creation on signup
- Timestamp tracking for all records
- Data validation and constraints
- Performance indexes
- Statistics view for analytics

## Troubleshooting

### Common Issues:

1. **Authentication not working**: Check redirect URLs and site URL configuration
2. **Database errors**: Verify the schema was executed successfully
3. **Environment variables**: Ensure `.env.local` is properly configured
4. **RLS errors**: Check that policies are enabled and user is authenticated

### Useful SQL Queries:

\`\`\`sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- View RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check user data
SELECT * FROM auth.users;
