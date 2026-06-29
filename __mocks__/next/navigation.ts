export const useRouter   = () => ({ push: jest.fn(), refresh: jest.fn(), replace: jest.fn() })
export const usePathname = () => '/dashboard'
export const useSearchParams = () => new URLSearchParams()
