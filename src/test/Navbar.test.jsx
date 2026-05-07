import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock #constants with known test data
vi.mock('#constants', () => ({
  navLinks: [
    { id: 1, name: 'Home' },
    { id: 2, name: 'About' },
    { id: 3, name: 'Projects' },
  ],
  navIcons: [
    { id: 'github', img: '/icons/github.svg' },
    { id: 'linkedin', img: '/icons/linkedin.svg' },
  ],
}));

// Mock dayjs to return a fixed formatted string
vi.mock('dayjs', () => {
  const mockDayjs = () => ({
    format: () => 'Thu May 7 12:00 PM',
  });
  mockDayjs.default = mockDayjs;
  return { default: mockDayjs };
});

const { default: Navbar } = await import('../components/Navbar.jsx');

describe('Navbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('structural rendering', () => {
    it('renders a nav element', () => {
      const { container } = render(<Navbar />);
      expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('renders the logo image with alt="Logo"', () => {
      render(<Navbar />);
      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo.tagName).toBe('IMG');
    });

    it('renders the logo image with src="/images/logo.svg"', () => {
      render(<Navbar />);
      const logo = screen.getByAltText('Logo');
      expect(logo).toHaveAttribute('src', '/images/logo.svg');
    });

    it('renders the portfolio name text', () => {
      render(<Navbar />);
      expect(screen.getByText("Saranga's Portfolio")).toBeInTheDocument();
    });

    it('portfolio name paragraph has "font-bold" class', () => {
      const { container } = render(<Navbar />);
      const p = container.querySelector('p.font-bold');
      expect(p).toBeInTheDocument();
      expect(p.textContent).toBe("Saranga's Portfolio");
    });

    it('renders a time element', () => {
      const { container } = render(<Navbar />);
      expect(container.querySelector('time')).toBeInTheDocument();
    });

    it('time element displays dayjs formatted output', () => {
      render(<Navbar />);
      const timeEl = screen.getByText('Thu May 7 12:00 PM');
      expect(timeEl.tagName).toBe('TIME');
    });
  });

  describe('navLinks rendering', () => {
    it('renders all nav links', () => {
      render(<Navbar />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    it('renders navLinks inside li elements', () => {
      const { container } = render(<Navbar />);
      const navUl = container.querySelector('ul');
      const items = navUl.querySelectorAll('li');
      expect(items.length).toBe(3);
    });

    it('each navLink li has "hover:underline" class', () => {
      const { container } = render(<Navbar />);
      const navUl = container.querySelector('ul');
      const items = navUl.querySelectorAll('li');
      items.forEach((li) => {
        expect(li).toHaveClass('hover:underline');
      });
    });

    it('renders navLinks in the correct order', () => {
      const { container } = render(<Navbar />);
      const navUl = container.querySelector('ul');
      const items = Array.from(navUl.querySelectorAll('li'));
      expect(items[0].textContent).toBe('Home');
      expect(items[1].textContent).toBe('About');
      expect(items[2].textContent).toBe('Projects');
    });
  });

  describe('navIcons rendering', () => {
    it('renders all icon images', () => {
      render(<Navbar />);
      expect(screen.getByAltText('icon-github')).toBeInTheDocument();
      expect(screen.getByAltText('icon-linkedin')).toBeInTheDocument();
    });

    it('icon images have correct src attributes', () => {
      render(<Navbar />);
      expect(screen.getByAltText('icon-github')).toHaveAttribute('src', '/icons/github.svg');
      expect(screen.getByAltText('icon-linkedin')).toHaveAttribute('src', '/icons/linkedin.svg');
    });

    it('icon images have "icon-hover" class', () => {
      render(<Navbar />);
      const githubIcon = screen.getByAltText('icon-github');
      const linkedinIcon = screen.getByAltText('icon-linkedin');
      expect(githubIcon).toHaveClass('icon-hover');
      expect(linkedinIcon).toHaveClass('icon-hover');
    });

    it('icon images are inside li elements', () => {
      render(<Navbar />);
      const githubIcon = screen.getByAltText('icon-github');
      expect(githubIcon.closest('li')).toBeInTheDocument();
    });

    it('renders the correct number of icon list items', () => {
      const { container } = render(<Navbar />);
      const uls = container.querySelectorAll('ul');
      // Second ul holds icons
      const iconUl = uls[1];
      expect(iconUl.querySelectorAll('li').length).toBe(2);
    });
  });

  describe('empty data edge cases', () => {
    it('renders without crashing when navLinks is empty', async () => {
      vi.doMock('#constants', () => ({
        navLinks: [],
        navIcons: [{ id: 'github', img: '/icons/github.svg' }],
      }));
      // Re-import Navbar with empty navLinks
      const { default: NavbarEmpty } = await import('../components/Navbar.jsx?empty-links');
      const { container } = render(<NavbarEmpty />);
      const firstUl = container.querySelector('ul');
      expect(firstUl.querySelectorAll('li').length).toBe(0);
    });

    it('renders without crashing when navIcons is empty', async () => {
      vi.doMock('#constants', () => ({
        navLinks: [{ id: 1, name: 'Home' }],
        navIcons: [],
      }));
      const { default: NavbarNoIcons } = await import('../components/Navbar.jsx?empty-icons');
      const { container } = render(<NavbarNoIcons />);
      const uls = container.querySelectorAll('ul');
      expect(uls[1].querySelectorAll('li').length).toBe(0);
    });
  });
});