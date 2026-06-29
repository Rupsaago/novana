import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WaitlistForm from '@/components/WaitlistForm'

global.fetch = jest.fn()

beforeEach(() => {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
  })
})

describe('WaitlistForm', () => {
  it('renders email input and submit button', () => {
    render(<WaitlistForm feature="Premium" />)
    expect(screen.getByPlaceholderText(/your@email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /join waitlist/i })).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<WaitlistForm feature="Premium" />)
    expect(screen.getByText(/early beta access/i)).toBeInTheDocument()
  })

  it('submit button is disabled while submitting', async () => {
    const user = userEvent.setup()
    // Make fetch hang so we can observe loading state
    let resolve: (v: unknown) => void
    ;(global.fetch as jest.Mock).mockReturnValue(new Promise(r => { resolve = r }))
    render(<WaitlistForm feature="Premium" />)
    await user.type(screen.getByPlaceholderText(/your@email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /join waitlist/i }))
    expect(screen.getByRole('button')).toBeDisabled()
    resolve!({ ok: true, status: 200, json: async () => ({ success: true }) })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    render(<WaitlistForm feature="Premium" />)
    await user.type(screen.getByPlaceholderText(/your@email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /join waitlist/i }))
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument())
  })

  it('shows already-on-list message for 409 response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 409, json: async () => ({ error: 'already_on_list' }) })
    const user = userEvent.setup()
    render(<WaitlistForm feature="Premium" />)
    await user.type(screen.getByPlaceholderText(/your@email/i), 'existing@example.com')
    await user.click(screen.getByRole('button', { name: /join waitlist/i }))
    await waitFor(() => expect(screen.getByText(/already on the list/i)).toBeInTheDocument())
  })

  it('shows error message if API fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
    const user = userEvent.setup()
    render(<WaitlistForm feature="Premium" />)
    await user.type(screen.getByPlaceholderText(/your@email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /join waitlist/i }))
    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument())
  })

  it('calls the correct endpoint', async () => {
    ;(global.fetch as jest.Mock).mockClear()
    const user = userEvent.setup()
    render(<WaitlistForm feature="Circle Community" />)
    await user.type(screen.getByPlaceholderText(/your@email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /join waitlist/i }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/waitlist', expect.objectContaining({ method: 'POST' })))
    const calls = (global.fetch as jest.Mock).mock.calls
    const lastCall = calls[calls.length - 1]
    const body = JSON.parse(lastCall[1].body)
    expect(body.feature).toBe('Circle Community')
    expect(body.email).toBe('test@example.com')
  })
})
