import { describe, it, expect, afterEach } from 'vitest';

// The logic mirrored from main.js, exercised directly.
function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

describe('copyright year update', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('sets #year to the current year', () => {
    document.body.innerHTML = '<span id="year">2000</span>';
    updateYear();
    expect(document.getElementById('year').textContent).toBe(
      String(new Date().getFullYear())
    );
  });

  it('does nothing when #year element is absent', () => {
    document.body.innerHTML = '';
    expect(() => updateYear()).not.toThrow();
    expect(document.getElementById('year')).toBeNull();
  });
});

