import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <p className="hero-eyebrow">The shonen bot&apos;s front door</p>
      <h1>
        Every quote. Every image. <span className="accent">Zero drama.</span>
      </h1>
      <p className="hero-sub">
        Browse the quotes and images your server has collected over the years — served up fast,
        with local copies so nothing ever disappears.
      </p>
      <div className="hero-links">
        <Link className="btn" to="/quotes">
          Browse quotes
        </Link>
        <Link className="btn btn-ghost" to="/images">
          Browse images
        </Link>
      </div>
    </section>
  );
}
