import { Link, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Quotes from './pages/Quotes';
import Images from './pages/Images';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/quotes', label: 'Quotes' },
  { to: '/images', label: 'Images' },
];

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ⚡
          </span>
          ShounenTime
        </Link>
        <nav className="nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/images" element={<Images />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          ShounenTime ·{' '}
          <a href="https://shounenbot.micool.dev" target="_blank" rel="noreferrer">
            shounenbot.micool.dev
          </a>
        </p>
      </footer>
    </div>
  );
}
