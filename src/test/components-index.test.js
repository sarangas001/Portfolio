import { describe, it, expect, vi } from 'vitest';

// Mock dependencies to isolate the barrel export
vi.mock('#constants', () => ({
  navLinks: [],
  navIcons: [],
}));

vi.mock('dayjs', () => {
  const mockDayjs = () => ({ format: () => 'Mon Jan 1 12:00 PM' });
  return { default: mockDayjs };
});

vi.mock('gsap', () => ({
  default: { to: vi.fn() },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

const { Navbar, Welcome } = await import('../components/index.js');

describe('components/index.js barrel export', () => {
  it('exports Navbar as a function (component)', () => {
    expect(typeof Navbar).toBe('function');
  });

  it('exports Welcome as a function (component)', () => {
    expect(typeof Welcome).toBe('function');
  });

  it('Navbar export has the name "Navbar"', () => {
    expect(Navbar.name).toBe('Navbar');
  });

  it('Welcome export has the name "Welcome"', () => {
    expect(Welcome.name).toBe('Welcome');
  });

  it('exports exactly the Navbar component (not undefined or null)', () => {
    expect(Navbar).toBeTruthy();
  });

  it('exports exactly the Welcome component (not undefined or null)', () => {
    expect(Welcome).toBeTruthy();
  });
});