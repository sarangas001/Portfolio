import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock child components to isolate App rendering
vi.mock('../components', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
  Welcome: () => <section data-testid="welcome">Welcome</section>,
}));

const { default: App } = await import('../App.jsx');

describe('App component', () => {
  it('renders a main element as the root', () => {
    const { container } = render(<App />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('renders the Navbar component', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders the Welcome component', () => {
    render(<App />);
    expect(screen.getByTestId('welcome')).toBeInTheDocument();
  });

  it('renders Navbar before Welcome in the DOM', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');
    const children = Array.from(main.children);
    const navbarIndex = children.findIndex((el) => el.getAttribute('data-testid') === 'navbar');
    const welcomeIndex = children.findIndex((el) => el.getAttribute('data-testid') === 'welcome');
    expect(navbarIndex).toBeLessThan(welcomeIndex);
  });

  it('renders both Navbar and Welcome inside main', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');
    expect(main.querySelector('[data-testid="navbar"]')).toBeInTheDocument();
    expect(main.querySelector('[data-testid="welcome"]')).toBeInTheDocument();
  });

  it('main element contains exactly two direct children (Navbar and Welcome)', () => {
    const { container } = render(<App />);
    const main = container.querySelector('main');
    expect(main.children.length).toBe(2);
  });
});