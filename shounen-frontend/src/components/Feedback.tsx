export function Loader() {
  return (
    <div className="feedback" role="status">
      <div className="spinner" />
      <p>Loading…</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="feedback" role="alert">
      <p className="feedback-title">Something went wrong</p>
      <p className="meta">{message}</p>
      <button className="retry" type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="feedback">
      <p className="feedback-title">{title}</p>
      {body && <p className="meta">{body}</p>}
    </div>
  );
}
