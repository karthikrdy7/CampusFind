import { useEffect, useMemo, useState } from "react";
import { deleteItem, getItems, updateItem } from "./services/api";
import ReportForm from "./components/ReportForm";
import "./App.css";

const categoryIcons = {
  Electronics: "⌁",
  "ID Cards": "▤",
  Wallet: "▱",
  Books: "▤",
  Keys: "⌘",
  Clothing: "◇",
  Accessories: "✳",
};

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getItems());
    } catch (err) {
      console.error(err);
      setError("We couldn't load reports. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = filter === "All" || item.type === filter;
      const matchesSearch =
        !query ||
        [item.itemName, item.category, item.location, item.description]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesType && matchesSearch;
    });
  }, [items, search, filter]);

  const handleReportClick = (type) => {
    setReportType(type);
    window.setTimeout(
      () => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  const handleItemCreated = (newItem) => {
    setItems((current) => [newItem, ...current]);
    setReportType(null);
    setNotice("Your report is live. Thanks for helping your campus community.");
    window.setTimeout(
      () => document.getElementById("items")?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  const handleMarkRecovered = async (item) => {
    const status = item.status === "Recovered" ? "Active" : "Recovered";
    try {
      const updatedItem = await updateItem(item._id, { status });
      setItems((current) =>
        current.map((entry) => (entry._id === item._id ? updatedItem : entry))
      );
      setNotice(status === "Recovered" ? "Marked as reunited. Nice work!" : "Report reopened.");
    } catch (err) {
      console.error(err);
      setNotice("Couldn't update this report. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report? This action cannot be undone.")) return;
    try {
      await deleteItem(id);
      setItems((current) => current.filter((item) => item._id !== id));
      setNotice("Report deleted.");
    } catch (err) {
      console.error(err);
      setNotice("Couldn't delete this report. Please try again.");
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="CampusFind home">
          <span className="brand-mark" aria-hidden="true">c</span>
          <span>campus<span className="brand-light">find</span></span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#items">Browse items</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <button className="nav-report" onClick={() => handleReportClick("Lost")}>
          Post a report <span aria-hidden="true">↗</span>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-dot" /> THE CAMPUS LOST &amp; FOUND</p>
            <h1>Lost something?<br /><span>Let’s bring it back.</span></h1>
            <p className="hero-description">
              The easiest way to reconnect with the things that make your campus feel like home.
            </p>
            <div className="hero-buttons">
              <button className="primary-btn" onClick={() => handleReportClick("Lost")}>
                I lost something <span aria-hidden="true">↗</span>
              </button>
              <button className="secondary-btn" onClick={() => handleReportClick("Found")}>
                I found something
              </button>
            </div>
            <div className="hero-note">
              <span className="avatar-stack" aria-hidden="true"><i>✳</i><i>⌂</i><i>↗</i></span>
              <span>A little help goes a long way.</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration of a lost-and-found board" role="img">
            <div className="art-sun" />
            <div className="art-cloud">✳</div>
            <div className="art-card art-card-back"><span>FOUND</span><b>your way<br />back home</b><i>✳</i></div>
            <div className="art-card art-card-front"><span>LOST &amp; FOUND · CAMPUS</span><b>Things find<br />their people.</b><i>↗</i></div>
            <div className="art-plant"><span>⌁</span></div>
            <p className="art-caption">GOOD THINGS COME BACK AROUND</p>
          </div>
        </section>

        <section className="stats-bar" aria-label="Community activity">
          <div><strong>{items.length}</strong><span>community reports</span></div>
          <div><strong>{items.filter((item) => item.status === "Recovered").length}</strong><span>items reunited</span></div>
          <p>Made for campus. Powered by kindness <span aria-hidden="true">✳</span></p>
        </section>

        {reportType && (
          <section className="report-section" id="report">
            <div className="report-heading">
              <div><p className="eyebrow">A FEW DETAILS</p><h2>Let’s get the word out.</h2></div>
              <button className="close-btn" onClick={() => setReportType(null)} aria-label="Close report form">×</button>
            </div>
            <ReportForm type={reportType} onItemCreated={handleItemCreated} />
          </section>
        )}

        <section className="reports" id="items">
          <div className="section-header">
            <div>
              <p className="eyebrow">THE COMMUNITY BOARD</p>
              <h2>Recently reported</h2>
              <p className="section-description">A little look at what’s making its way back.</p>
            </div>
            <button className="refresh-btn" onClick={fetchItems} disabled={loading}>
              <span aria-hidden="true">↻</span> Refresh
            </button>
          </div>

          <div className="board-tools">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search an item, place, or category"
                aria-label="Search reports"
              />
            </label>
            <div className="filter-tabs" aria-label="Filter reports">
              {["All", "Lost", "Found"].map((type) => (
                <button
                  key={type}
                  className={filter === type ? "filter-tab active" : "filter-tab"}
                  onClick={() => setFilter(type)}
                  aria-pressed={filter === type}
                >{type}</button>
              ))}
            </div>
          </div>

          {notice && <p className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></p>}
          {error && <div className="empty-state"><p>{error}</p><button className="secondary-btn" onClick={fetchItems}>Try again</button></div>}
          {loading && <p className="loading-state" role="status">Gathering the latest reports…</p>}
          {!loading && !error && visibleItems.length === 0 && (
            <div className="empty-state">
              <span aria-hidden="true">✳</span>
              <h3>{items.length ? "Nothing matches just yet." : "The board is yours to start."}</h3>
              <p>{items.length ? "Try a different search or filter." : "Be the first to share a lost or found item with your campus."}</p>
              {!items.length && <button className="primary-btn" onClick={() => handleReportClick("Found")}>Post the first report <span aria-hidden="true">↗</span></button>}
            </div>
          )}
          {!loading && !error && visibleItems.length > 0 && (
            <div className="item-grid">
              {visibleItems.map((item) => (
                <article className="item-card" key={item._id}>
                  <div className={`item-visual ${item.type.toLowerCase()}`}>
                    <span aria-hidden="true">{categoryIcons[item.category] || "✳"}</span>
                    <span className="item-category">{item.category}</span>
                  </div>
                  <div className="item-info">
                    <div className="item-top">
                      <span className={`badge ${item.type.toLowerCase()}`}>{item.type}</span>
                      <span className={`status ${item.status === "Recovered" ? "recovered" : ""}`}>
                        <i />{item.status === "Recovered" ? "Reunited" : "Looking for its person"}
                      </span>
                    </div>
                    <h3>{item.itemName}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-meta">
                      <span><i aria-hidden="true">⌖</i>{item.location}</span>
                      <span><i aria-hidden="true">◷</i>{new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="item-actions">
                      <button className="details-btn" onClick={() => handleMarkRecovered(item)}>
                        {item.status === "Recovered" ? "Reopen report" : "Mark reunited"}
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(item._id)} aria-label={`Delete ${item.itemName} report`}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="how-it-works" id="how-it-works">
          <div className="how-heading">
            <p className="eyebrow">SMALL STEPS, BIG RELIEF</p>
            <h2>Good things find their way.</h2>
          </div>
          <div className="steps">
            <article className="step"><span>01</span><div><h3>Put it out there</h3><p>Share a few details about what went missing—or what you picked up.</p></div></article>
            <article className="step"><span>02</span><div><h3>Look around</h3><p>Browse the board and find a report that looks familiar.</p></div></article>
            <article className="step"><span>03</span><div><h3>Make the connection</h3><p>Reach out using the contact on the report and reunite an item.</p></div></article>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#home"><span className="brand-mark" aria-hidden="true">c</span><span>campus<span className="brand-light">find</span></span></a>
        <p>A little more found. A little less lost.</p>
        <span className="copyright">Made for campus communities <i aria-hidden="true">✳</i></span>
      </footer>
    </div>
  );
}

export default App;
