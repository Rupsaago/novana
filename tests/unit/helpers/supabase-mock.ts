/**
 * Creates a chainable Supabase query builder mock.
 * Pass `result` to control what the terminal operation resolves to.
 * Pass `single` to override just the .single() result.
 */
export function mockQuery(
  result: { data: unknown; error: unknown } = { data: null, error: null },
) {
  const q = {
    select:      jest.fn().mockReturnThis(),
    eq:          jest.fn().mockReturnThis(),
    neq:         jest.fn().mockReturnThis(),
    gte:         jest.fn().mockReturnThis(),
    lte:         jest.fn().mockReturnThis(),
    lt:          jest.fn().mockReturnThis(),
    gt:          jest.fn().mockReturnThis(),
    in:          jest.fn().mockReturnThis(),
    not:         jest.fn().mockReturnThis(),
    is:          jest.fn().mockReturnThis(),
    order:       jest.fn().mockReturnThis(),
    limit:       jest.fn().mockReturnThis(),
    insert:      jest.fn().mockReturnThis(),
    upsert:      jest.fn().mockReturnThis(),
    update:      jest.fn().mockReturnThis(),
    // Terminal operations
    single:      jest.fn().mockResolvedValue(result),
    maybeSingle: jest.fn().mockResolvedValue(result),
  }
  // Make the whole builder awaitable for queries that don't end in .single()
  return Object.assign(q, {
    then: (resolve: (v: typeof result) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject),
  })
}

/** Creates a mock Supabase server client. */
export function mockSupabaseClient(
  fromResult: { data: unknown; error: unknown } = { data: null, error: null },
) {
  const query = mockQuery(fromResult)
  return { from: jest.fn().mockReturnValue(query) }
}

/** A test session object. */
export const TEST_SESSION = {
  user: {
    id:    'test-user-id',
    email: 'test@novana.app',
    user_metadata: { full_name: 'Test User' },
  },
}
