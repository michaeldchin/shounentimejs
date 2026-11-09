import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchImages, imageSrc, Image } from '../api';
import { EmptyState, ErrorState, Loader } from '../components/Feedback';

type Status = 'loading' | 'ready' | 'error';

export default function Images() {
  const [searchParams] = useSearchParams();
  const server = searchParams.get('server') ?? undefined;

  const [images, setImages] = useState<Image[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const load = async () => {
    setStatus('loading');
    setError('');
    try {
      setImages(await fetchImages(server));
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  };

  useEffect(() => {
    void load();
  }, [server]);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return images;
    return images.filter((image) =>
      [image.tag, image.guildId].some((value) => (value ?? '').toLowerCase().includes(term)),
    );
  }, [images, filter]);

  return (
    <section className="page">
      <div className="page-head">
        <h2>Images</h2>
        <p className="page-sub">
          {status === 'ready'
            ? `${visible.length} of ${images.length} image${images.length === 1 ? '' : 's'}${
                server ? ` · server ${server}` : ''
              }`
            : 'The visual archive'}
        </p>
        <input
          className="search"
          type="search"
          placeholder="Filter by tag or server…"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter images"
        />
      </div>

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorState message={error} onRetry={() => void load()} />}
      {status === 'ready' && visible.length === 0 && (
        <EmptyState
          title={filter ? 'No images match that filter' : 'No images yet'}
          body={filter ? 'Try a different search.' : 'Add one in Discord with /addimage.'}
        />
      )}
      {status === 'ready' && visible.length > 0 && (
        <div className="image-grid">
          {visible.map((image) => (
            <figure className="card image-card" key={image.id}>
              <a href={imageSrc(image)} target="_blank" rel="noreferrer">
                <img
                  className="image-thumb"
                  src={imageSrc(image)}
                  alt={image.tag || `Image #${image.id}`}
                  loading="lazy"
                />
              </a>
              <figcaption>
                <span className="tag" title={image.tag ?? 'untagged'}>
                  {image.tag || 'untagged'}
                </span>
                <span className="meta">#{image.id}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
