# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Credit Tractor is a Next.js PWA for tracking credit card payments and installment plans. The app helps users manage payment schedules with multi-currency support and features analytics for payment tracking.

## Development Commands

### Core Development
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing
No specific test commands configured - check with user before implementing tests.

## Architecture

### Frontend Stack
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Supabase** for backend/database
- **TanStack Query** for data fetching and state management
- **Tailwind CSS** + **Radix UI** for styling
- **PWA** capabilities with offline support

### Key Directories
- `app/` - Next.js app router pages and layouts
- `app/components/` - React components
- `app/lib/` - Core utilities (Supabase client, React Query hooks)
- `app/types/` - TypeScript type definitions
- `components/` - Shared UI components (Radix UI + custom)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions

### Data Layer
- **Supabase**: PostgreSQL database with Row Level Security (RLS)
- **Tables**: `creditTractor_payments`, `creditTractor_credit_cards`, `creditTractor_user_settings`
- **Additional Tables**: `incomes`, `expenses` for financial tracking
- **Authentication**: Supabase Auth with email/OAuth support

### Component Architecture
- **App Shell Pattern**: `AppWrapper` with `ClientNavShell` for navigation
- **Form Components**: `PaymentForm`, `IncomeForm`, `ExpenseForm` with react-hook-form
- **Data Components**: Table views, charts using Recharts
- **UI Components**: Radix UI primitives with custom styling

## Key Features

### Payment Management
- Track installment payments with custom schedules
- Multi-currency support with exchange rates
- Payment type options: monthly, beginning, ending, custom
- Mark installments as paid/unpaid
- Interest rate calculations

### Financial Tracking
- Income and expense management
- Category-based organization
- Recurring transaction support
- Analytics and reporting

### User Management
- Multi-language support (EN, ES, DE, FR, IT, PT)
- User settings and preferences
- Credit card management
- Secure authentication

## Database Schema

### Core Tables
- `creditTractor_payments`: Payment plans and installments
- `creditTractor_credit_cards`: User credit card information  
- `creditTractor_user_settings`: User preferences and configuration
- `incomes`: User income tracking
- `expenses`: User expense tracking

### Security
- Row Level Security (RLS) enabled on all tables
- User isolation - users can only access their own data
- Authentication required for all operations

## Development Setup

1. **Environment Variables**: Configure `.env.local` with Supabase credentials
2. **Database**: Run `supabase-schema.sql` to set up database schema
3. **Dependencies**: Install with `npm install`
4. **Development**: Start with `npm run dev`

## Configuration Notes

### Next.js Config
- ESLint and TypeScript errors ignored during builds
- Image optimization disabled
- PWA manifest configured

### Supabase Integration
- Mock client fallback when credentials not configured
- Automatic error handling for auth sessions
- Optimistic updates with TanStack Query

### Known Patterns
- Use `useQuery` for data fetching with proper error handling
- Implement optimistic updates for better UX
- Follow existing component patterns for consistency
- Use TypeScript interfaces from `app/types/payment.ts`

## File Structure Insights

### Component Organization
- Landing page components in `components/landing/`
- UI primitives in `components/ui/` (Radix UI)
- App-specific components in `app/components/`
- Many duplicate UI components exist (with "copy" suffix) - cleanup may be needed

### Data Flow
1. React Query hooks in `app/lib/queries.ts` handle all data operations
2. Supabase client in `app/lib/supabase.ts` with mock fallback
3. TypeScript types in `app/types/payment.ts` define data structures
4. Components consume data through React Query hooks

## Important Implementation Notes

- Always use the existing React Query hooks for data operations
- Follow the established TypeScript patterns for type safety
- Implement proper error handling for Supabase operations
- Use the existing currency and translation utilities
- Maintain PWA functionality when making changes
- Test authentication flows thoroughly due to mock client fallback