(function () {
  const scholarUrl = 'https://scholar.google.com/citations?user=AnUqsdkAAAAJ&hl=en';
  const dataUrl = './assets/data/publications.json';
  const cacheKey = 'scholar-publications-cache';
  const cacheDuration = 24 * 60 * 60 * 1000;

  function readCache() {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (!parsed || !parsed.timestamp) return null;
      if (Date.now() - parsed.timestamp < cacheDuration) {
        return parsed;
      }
    } catch (err) {
      console.warn('Scholar cache read failed:', err);
    }
    return null;
  }

  function writeCache(data) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), ...data }));
    } catch (err) {
      console.warn('Scholar cache write failed:', err);
    }
  }

  function renderPublications(data) {
    const list = document.getElementById('publications-list');
    const citations = document.getElementById('scholar-citations');
    const publicationCount = document.getElementById('scholar-publication-count');
    const updated = document.getElementById('publications-updated');
    const graph = document.getElementById('citation-graph');
    const graphNote = document.getElementById('graph-note');

    if (!list || !citations || !publicationCount || !updated || !graph || !graphNote) {
      return;
    }

    citations.textContent = data.citations || '0';
    publicationCount.textContent = data.publications ? data.publications.length : '0';
    updated.textContent = '';

    list.innerHTML = '';
    if (!data.publications || !data.publications.length) {
      list.innerHTML = '<div class="publication-card"><h4>No publications available yet.</h4><p class="publication-meta">Please check the Scholar profile directly.</p></div>';
      return;
    }

    data.publications.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'publication-card';
      card.innerHTML = `
        <h4>${item.title || 'Untitled publication'}</h4>
        <div class="publication-meta">
          ${item.year ? `<span>Year: ${item.year}</span>` : ''}
          ${item.citations !== undefined ? `<span>Citations: ${item.citations}</span>` : ''}
        </div>
      `;
      list.appendChild(card);
    });

    const values = data.graph || [];
    if (values.length) {
      const width = 320;
      const height = 180;
      const padding = 24;
      const maxValue = Math.max(...values.map((v) => Number(v.count) || 0), 1);
      const stepX = (width - padding * 2) / Math.max(values.length - 1, 1);
      const points = values.map((point, index) => {
        const x = padding + index * stepX;
        const y = height - padding - ((Number(point.count) || 0) / maxValue) * (height - padding * 2);
        return `${x},${y}`;
      });

      graph.innerHTML = `
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="currentColor" stroke-opacity="0.25"></line>
        <polyline fill="none" stroke="#1a73e8" stroke-width="3" points="${points.join(' ')}"></polyline>
        ${values.map((point, index) => {
          const x = padding + index * stepX;
          const y = height - padding - ((Number(point.count) || 0) / maxValue) * (height - padding * 2);
          return `<g><circle cx="${x}" cy="${y}" r="4" fill="#1a73e8"></circle><text x="${x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="currentColor">${point.label}</text></g>`;
        }).join('')}
      `;
    } else {
      graph.innerHTML = '<text x="160" y="90" text-anchor="middle" fill="currentColor">No graph data available</text>';
    }

    graphNote.textContent = values.length ? 'Cited-by trend refreshed from Scholar.' : 'The graph will populate on the next refresh.';
  }

  async function loadScholarData() {
    const fallback = window.__SCHOLAR_PUBLICATIONS_DATA__ || null;
    const cached = readCache();
    const initialData = cached || fallback;
    if (initialData) {
      renderPublications(initialData);
    }

    try {
      const response = await fetch(dataUrl + '?t=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Unable to load publication data.');
      }
      const data = await response.json();
      writeCache(data);
      renderPublications(data);
    } catch (err) {
      console.warn('Scholar publication fetch failed:', err);
      if (!initialData) {
        document.getElementById('publications-updated').textContent = 'The Scholar publication feed is temporarily unavailable.';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', loadScholarData);
})();
