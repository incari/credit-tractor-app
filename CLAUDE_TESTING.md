# Testing Setup for Credit Tractor App

## Overview

This README provides comprehensive guidance for setting up automatic unit testing for the Credit Tractor app. The app currently has no testing infrastructure in place, so this guide will help you establish a robust testing foundation.

## Recommended Testing Stack

### Core Testing Framework
- **Vitest** - Fast, modern testing framework optimized for Vite/TypeScript projects
- **React Testing Library** - For testing React components
- **Jest DOM** - Custom matchers for DOM testing
- **MSW (Mock Service Worker)** - For API mocking

### Additional Testing Tools
- **Playwright** - For E2E testing
- **Testing Library User Event** - For realistic user interactions
- **Supertest** - For API testing (if needed)

## Installation

### 1. Install Core Dependencies

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 2. Install MSW for API Mocking

```bash
npm install --save-dev msw
```

### 3. Install Playwright for E2E Testing

```bash
npm install --save-dev @playwright/test
npx playwright install
```

## Configuration Files

### 1. Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### 2. Test Setup File (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// Close server after all tests
afterAll(() => server.close())
```

### 3. MSW Server Setup (`src/test/mocks/server.ts`)

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### 4. MSW Handlers (`src/test/mocks/handlers.ts`)

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Supabase auth endpoints
  http.get('*/auth/v1/user', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
      },
    })
  }),

  // Mock payments endpoints
  http.get('*/rest/v1/creditTractor_payments', () => {
    return HttpResponse.json([
      {
        id: 'test-payment-id',
        user_id: 'test-user-id',
        name: 'Test Payment',
        price: 1000,
        installments: 12,
        first_payment_date: '2024-01-01',
        credit_card: '1234',
        currency: 'EUR',
        paid_installments: [],
      },
    ])
  }),

  // Mock credit cards endpoints
  http.get('*/rest/v1/creditTractor_credit_cards', () => {
    return HttpResponse.json([
      {
        id: 'test-card-id',
        user_id: 'test-user-id',
        name: 'Test Card',
        last_four: '1234',
        limit: 5000,
      },
    ])
  }),
]
```

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Testing Patterns & Examples

### 1. Utility Function Tests (`app/utils/__tests__/payment-utils.test.ts`)

```typescript
import { describe, it, expect } from 'vitest'
import { generatePaymentSchedule, calculatePaymentSummary } from '../payment-utils'
import type { Payment } from '../../types/payment'

describe('Payment Utils', () => {
  const mockPayment: Payment = {
    id: 'test-id',
    name: 'Test Payment',
    price: 1000,
    installments: 12,
    firstPaymentDate: '2024-01-01',
    creditCard: '1234',
    initialPayment: 0,
    interestRate: 0,
    paymentType: 'monthly',
    currency: 'EUR',
    paidInstallments: [],
  }

  describe('generatePaymentSchedule', () => {
    it('should generate correct number of installments', () => {
      const schedule = generatePaymentSchedule(mockPayment)
      expect(schedule).toHaveLength(12)
    })

    it('should calculate installment amounts correctly', () => {
      const schedule = generatePaymentSchedule(mockPayment)
      schedule.forEach(installment => {
        expect(installment.amount).toBe(1000 / 12)
      })
    })

    it('should handle initial payment correctly', () => {
      const paymentWithInitial = { ...mockPayment, initialPayment: 200 }
      const schedule = generatePaymentSchedule(paymentWithInitial)
      
      expect(schedule[0].amount).toBe(200)
      expect(schedule[1].amount).toBe(800 / 11)
    })

    it('should handle interest rate correctly', () => {
      const paymentWithInterest = { ...mockPayment, interestRate: 10 }
      const schedule = generatePaymentSchedule(paymentWithInterest)
      
      schedule.forEach(installment => {
        expect(installment.amount).toBe(1100 / 12)
      })
    })
  })

  describe('calculatePaymentSummary', () => {
    it('should calculate total amount correctly', () => {
      const payments = [mockPayment, { ...mockPayment, price: 500 }]
      const summary = calculatePaymentSummary(payments)
      
      expect(summary.totalAmount).toBe(1500)
      expect(summary.totalPaid).toBe(0)
      expect(summary.totalToPay).toBe(1500)
    })
  })
})
```

### 2. Component Tests (`app/components/__tests__/payment-form.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PaymentForm } from '../payment-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockUserSettings = {
  language: 'EN' as const,
  currency: 'EUR',
  creditCards: [
    { id: '1', name: 'Test Card', lastFour: '1234', limit: 5000 }
  ],
  lastUsedCard: '1234',
  monthsToShow: 12,
}

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('PaymentForm', () => {
  it('should render form fields correctly', () => {
    const mockOnSubmit = vi.fn()
    
    renderWithQueryClient(
      <PaymentForm
        onSubmit={mockOnSubmit}
        userSettings={mockUserSettings}
      />
    )

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/installments/i)).toBeInTheDocument()
  })

  it('should submit form with correct data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()

    renderWithQueryClient(
      <PaymentForm
        onSubmit={mockOnSubmit}
        userSettings={mockUserSettings}
      />
    )

    await user.type(screen.getByLabelText(/name/i), 'Test Payment')
    await user.type(screen.getByLabelText(/price/i), '1000')
    await user.type(screen.getByLabelText(/installments/i), '12')
    
    await user.click(screen.getByRole('button', { name: /add payment/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Payment',
          price: 1000,
          installments: 12,
        })
      )
    })
  })
})
```

### 3. Hook Tests (`app/lib/__tests__/queries.test.ts`)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePayments } from '../queries'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Query Hooks', () => {
  describe('usePayments', () => {
    it('should fetch payments successfully', async () => {
      const { result } = renderHook(() => usePayments(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual([
        expect.objectContaining({
          id: 'test-payment-id',
          name: 'Test Payment',
          price: 1000,
        })
      ])
    })
  })
})
```

### 4. E2E Tests (`tests/e2e/payment-flow.spec.ts`)

```typescript
import { test, expect } from '@playwright/test'

test.describe('Payment Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'mock-token')
    })
  })

  test('should create a new payment', async ({ page }) => {
    await page.click('text=Add Payment')
    
    await page.fill('[data-testid="payment-name"]', 'Test Payment')
    await page.fill('[data-testid="payment-price"]', '1000')
    await page.fill('[data-testid="payment-installments"]', '12')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Test Payment')).toBeVisible()
  })

  test('should mark installment as paid', async ({ page }) => {
    await page.click('text=Test Payment')
    await page.click('[data-testid="installment-checkbox"]:first-child')
    
    await expect(page.locator('[data-testid="installment-paid"]:first-child')).toBeVisible()
  })
})
```

## Continuous Integration Setup

### GitHub Actions (`.github/workflows/test.yml`)

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:run
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      if: always()
```

## Testing Best Practices

### 1. Test Structure
- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Test complete user workflows

### 2. Mock Strategy
- Mock external dependencies (Supabase, APIs)
- Use MSW for HTTP request mocking
- Mock complex utility functions when testing components

### 3. Test Data Management
- Create reusable test fixtures
- Use factories for generating test data
- Reset mocks between tests

### 4. Coverage Goals
- Aim for 80%+ code coverage
- Focus on critical business logic
- Test error scenarios and edge cases

### 5. Testing Patterns
- **AAA Pattern**: Arrange, Act, Assert
- **Given-When-Then**: For behavior-driven tests
- **Test-Driven Development**: Write tests before implementation

## Common Testing Scenarios

### 1. Payment Calculations
```typescript
// Test payment schedule generation
// Test interest calculations
// Test installment amount calculations
// Test payment summary calculations
```

### 2. Form Validation
```typescript
// Test required field validation
// Test numeric input validation
// Test date validation
// Test custom validation rules
```

### 3. User Interactions
```typescript
// Test form submission
// Test payment marking as paid/unpaid
// Test currency selection
// Test credit card selection
```

### 4. Data Persistence
```typescript
// Test payment creation
// Test payment updates
// Test payment deletion
// Test optimistic updates
```

## Troubleshooting

### Common Issues
1. **MSW handlers not matching**: Check URL patterns and HTTP methods
2. **React Query cache issues**: Reset query client between tests
3. **Component not rendering**: Check for missing providers
4. **Async operations**: Use proper async/await patterns

### Debugging Tips
1. Use `screen.debug()` to inspect rendered components
2. Use `console.log()` in MSW handlers to debug requests
3. Check network tab in browser for E2E tests
4. Use Vitest UI for interactive debugging

## Next Steps

1. **Set up basic configuration**: Install dependencies and create config files
2. **Start with utility tests**: Test pure functions first
3. **Add component tests**: Test React components with React Testing Library
4. **Implement E2E tests**: Test critical user workflows
5. **Set up CI/CD**: Automate testing in your deployment pipeline

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)