import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock gsap before importing Welcome
const mockGsapTo = vi.fn();
vi.mock('gsap', () => ({
  default: {
    to: mockGsapTo,
  },
}));

vi.mock('@gsap/react', () => ({
  useGSAP: (callback) => {
    // Execute the callback immediately and store cleanup
    React.useEffect(() => {
      const cleanup = callback();
      return cleanup;
    }, []);
  },
}));

// Import after mocks are set up
const { default: Welcome } = await import('../components/Welcome.jsx');

// Re-export renderText and setupTextHover for direct testing by reimplementing them
// (they are internal functions, so we test them via the component)

describe('Welcome component', () => {
  beforeEach(() => {
    mockGsapTo.mockClear();
  });

  describe('render structure', () => {
    it('renders a section with id="welcome"', () => {
      const { container } = render(<Welcome />);
      const section = container.querySelector('section#welcome');
      expect(section).toBeInTheDocument();
    });

    it('renders a subtitle paragraph with the correct text', () => {
      render(<Welcome />);
      // The subtitle text is split into individual characters
      const section = document.querySelector('section#welcome');
      const subtitleP = section.querySelector('p');
      expect(subtitleP).toBeInTheDocument();
      // Reconstruct text content (non-breaking spaces replace regular spaces)
      const text = subtitleP.textContent.replace(/\u00A0/g, ' ');
      expect(text).toBe("Hey, I'm Saranga! Welcome to my");
    });

    it('renders an h1 with "Portfolio" text', () => {
      render(<Welcome />);
      const h1 = document.querySelector('section#welcome h1');
      expect(h1).toBeInTheDocument();
      const text = h1.textContent.replace(/\u00A0/g, ' ');
      expect(text).toBe('Portfolio');
    });

    it('renders the small-screen fallback message', () => {
      render(<Welcome />);
      expect(
        screen.getByText('This portfolio is designed for desktop/tabled screens only.')
      ).toBeInTheDocument();
    });

    it('renders the small-screen div', () => {
      const { container } = render(<Welcome />);
      const smallScreen = container.querySelector('.small-screen');
      expect(smallScreen).toBeInTheDocument();
    });

    it('h1 has className "mt-7"', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveClass('mt-7');
    });
  });

  describe('renderText character rendering', () => {
    it('subtitle spans have the class "text-3xl font-georama"', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');
      const spans = p.querySelectorAll('span');
      spans.forEach((span) => {
        expect(span).toHaveClass('text-3xl');
        expect(span).toHaveClass('font-georama');
      });
    });

    it('title spans have the class "text-9xl italic font-georama"', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');
      const spans = h1.querySelectorAll('span');
      spans.forEach((span) => {
        expect(span).toHaveClass('text-9xl');
        expect(span).toHaveClass('italic');
        expect(span).toHaveClass('font-georama');
      });
    });

    it('subtitle spans have fontVariationSettings with weight 100 (default for subtitle)', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');
      const spans = p.querySelectorAll('span');
      spans.forEach((span) => {
        expect(span.style.fontVariationSettings).toBe('"wght" 100');
      });
    });

    it('title spans have fontVariationSettings with weight 400 (default for title)', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');
      const spans = h1.querySelectorAll('span');
      spans.forEach((span) => {
        expect(span.style.fontVariationSettings).toBe('"wght" 400');
      });
    });

    it('renders the correct number of spans in subtitle (one per character)', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');
      const spans = p.querySelectorAll('span');
      expect(spans.length).toBe("Hey, I'm Saranga! Welcome to my".length);
    });

    it('renders the correct number of spans in title', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');
      const spans = h1.querySelectorAll('span');
      expect(spans.length).toBe('Portfolio'.length);
    });

    it('replaces space characters with non-breaking spaces (\u00A0)', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');
      const spans = Array.from(p.querySelectorAll('span'));
      // "Hey, I'm Saranga! Welcome to my" has spaces at indices 4, 7, 16, 24, 27
      const originalText = "Hey, I'm Saranga! Welcome to my";
      const spaceIndices = [];
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ') spaceIndices.push(i);
      }
      spaceIndices.forEach((idx) => {
        expect(spans[idx].textContent).toBe('\u00A0');
      });
    });

    it('renders non-space characters without replacement', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');
      const spans = Array.from(h1.querySelectorAll('span'));
      const text = 'Portfolio';
      text.split('').forEach((char, i) => {
        expect(spans[i].textContent).toBe(char);
      });
    });
  });

  describe('hover interaction via mousemove and mouseleave events', () => {
    it('calls gsap.to on mousemove over the subtitle', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');

      fireEvent.mouseMove(p, { clientX: 100 });
      expect(mockGsapTo).toHaveBeenCalled();
    });

    it('calls gsap.to for each letter on mousemove over subtitle', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');
      const spans = p.querySelectorAll('span');

      mockGsapTo.mockClear();
      fireEvent.mouseMove(p, { clientX: 50 });
      expect(mockGsapTo).toHaveBeenCalledTimes(spans.length);
    });

    it('calls gsap.to on mouseleave of subtitle to reset weights', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');
      const spans = p.querySelectorAll('span');

      mockGsapTo.mockClear();
      fireEvent.mouseLeave(p);
      // Each span gets reset
      expect(mockGsapTo).toHaveBeenCalledTimes(spans.length);
    });

    it('calls gsap.to on mousemove over the title', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');

      mockGsapTo.mockClear();
      fireEvent.mouseMove(h1, { clientX: 100 });
      expect(mockGsapTo).toHaveBeenCalled();
    });

    it('calls gsap.to for each letter on mousemove over title', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');
      const spans = h1.querySelectorAll('span');

      mockGsapTo.mockClear();
      fireEvent.mouseMove(h1, { clientX: 100 });
      expect(mockGsapTo).toHaveBeenCalledTimes(spans.length);
    });

    it('calls gsap.to on mouseleave of title to reset weights', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');
      const spans = h1.querySelectorAll('span');

      mockGsapTo.mockClear();
      fireEvent.mouseLeave(h1);
      expect(mockGsapTo).toHaveBeenCalledTimes(spans.length);
    });

    it('gsap.to is called with duration 0.25 on mousemove', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');

      mockGsapTo.mockClear();
      fireEvent.mouseMove(p, { clientX: 0 });

      const calls = mockGsapTo.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      calls.forEach((call) => {
        expect(call[1].duration).toBe(0.25);
      });
    });

    it('gsap.to is called with duration 0.3 on mouseleave', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');

      mockGsapTo.mockClear();
      fireEvent.mouseLeave(p);

      const calls = mockGsapTo.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      calls.forEach((call) => {
        expect(call[1].duration).toBe(0.3);
      });
    });

    it('gsap.to uses "power2.out" ease on mousemove', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');

      mockGsapTo.mockClear();
      fireEvent.mouseMove(p, { clientX: 50 });

      mockGsapTo.mock.calls.forEach((call) => {
        expect(call[1].ease).toBe('power2.out');
      });
    });

    it('subtitle mouseleave resets spans to base weight 100', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');

      mockGsapTo.mockClear();
      fireEvent.mouseLeave(p);

      mockGsapTo.mock.calls.forEach((call) => {
        expect(call[1].fontVariationSettings).toContain('100');
      });
    });

    it('title mouseleave resets spans to base weight 400', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');

      mockGsapTo.mockClear();
      fireEvent.mouseLeave(h1);

      mockGsapTo.mock.calls.forEach((call) => {
        expect(call[1].fontVariationSettings).toContain('400');
      });
    });

    it('mousemove weight for subtitle stays within min (100) and max (400) range', () => {
      const { container } = render(<Welcome />);
      const p = container.querySelector('p');

      mockGsapTo.mockClear();
      fireEvent.mouseMove(p, { clientX: 0 });

      mockGsapTo.mock.calls.forEach((call) => {
        const settings = call[1].fontVariationSettings;
        const match = settings.match(/'wght'\s+([\d.]+)/);
        if (match) {
          const weight = parseFloat(match[1]);
          expect(weight).toBeGreaterThanOrEqual(100);
          expect(weight).toBeLessThanOrEqual(400);
        }
      });
    });

    it('mousemove weight for title stays within min (400) and max (900) range', () => {
      const { container } = render(<Welcome />);
      const h1 = container.querySelector('h1');

      mockGsapTo.mockClear();
      fireEvent.mouseMove(h1, { clientX: 0 });

      mockGsapTo.mock.calls.forEach((call) => {
        const settings = call[1].fontVariationSettings;
        const match = settings.match(/'wght'\s+([\d.]+)/);
        if (match) {
          const weight = parseFloat(match[1]);
          expect(weight).toBeGreaterThanOrEqual(400);
          expect(weight).toBeLessThanOrEqual(900);
        }
      });
    });
  });
});