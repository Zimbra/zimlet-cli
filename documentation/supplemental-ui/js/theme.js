(function () {
  var KEY = 'zimlet-docs-theme';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var BROWSER_COLORS = { light: '#ffffff', dark: '#14171c' };

  function saved() {
    try {
      var value = window.localStorage.getItem(KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function current() {
    return saved() || (media.matches ? 'dark' : 'light');
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    // The meta tag is not in the page yet on the first call, so the DOMContentLoaded call sets it.
    var browserColor = document.getElementById('theme-color-meta');
    if (browserColor) browserColor.setAttribute('content', BROWSER_COLORS[theme]);
    var button = document.getElementById('theme-toggle');
    if (button) {
      var label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    }
  }

  // Runs in the head, before the first paint, so the page does not flash the wrong theme.
  apply(current());

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest || !event.target.closest('#theme-toggle')) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try {
      window.localStorage.setItem(KEY, next);
    } catch (e) {
      // The choice applies to this page only when storage is blocked.
    }
    apply(next);
  });

  media.addEventListener('change', function () {
    if (!saved()) apply(current());
  });
})();
