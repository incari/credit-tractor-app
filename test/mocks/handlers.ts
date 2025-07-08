import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Supabase auth endpoints
  http.get('*/auth/v1/user', () => {
    return HttpResponse.json({
      user: null,
    })
  }),

  // Mock authenticated user endpoint
  http.get('*/auth/v1/user', ({ request }) => {
    const url = new URL(request.url)
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader?.includes('Bearer mock-token')) {
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
    }

    return HttpResponse.json({
      user: null,
    })
  }),

  // Mock sign out endpoint
  http.post('*/auth/v1/logout', () => {
    return HttpResponse.json({})
  }),
]