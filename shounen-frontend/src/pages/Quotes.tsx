import { useEffect, useMemo, useState } from 'react';
import { fetchQuotes, Quote } from '../api';
import { EmptyState, ErrorState, Loader } from '../components/Feedback';
import { formatDate } from '../format';

type Status = 'loading' | 'ready' | 'error';

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const load = async () => {
    setStatus('loading');
    setError('');
    try {
      setQuotes(await fetchQuotes());
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return quotes;
    return quotes.filter((q) =>
      [q.quote, q.author, q.guildId].some((value) => (value ?? '').toLowerCase().includes(term)),
    );
  }, [quotes, filter]);

  return (
    <section className="page">
      <div className="page-head">
        <h2>Quotes</h2>
        <p className="page-sub">
          {status === 'ready'
            ? `${visible.length} of ${quotes.length} quote${quotes.length === 1 ? '' : 's'}`
            : 'Collected wisdom from the server'}
        </p>
        <input
          className="search"
          type="search"
          placeholder="Filter by quote, author, or server…"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter quotes"
        />
      </div>

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorState message={error} onRetry={() => void load()} />}
      {status === 'ready' && visible.length === 0 && (
        <EmptyState
          title={filter ? 'No quotes match that filter' : 'No quotes yet'}
          body={filter ? 'Try a different search.' : 'Add one in Discord with /addquote.'}
        />
      )}
      {status === 'ready' && visible.length > 0 && (
        <div className="quote-grid">
          {visible.map((quote) => (
            <figure className="card quote-card" key={quote.id}>
              <blockquote>“{quote.quote}”</blockquote>
              <figcaption>
                <span className="quote-author">— {quote.author || 'Unknown'}</span>
                <span className="meta">
                  #{quote.id} · {formatDate(quote.updatedAt)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
