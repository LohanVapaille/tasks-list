import { useState } from "react";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import AppProvider from "./context/AppContext";
import useAppContext from "./context/useAppContext";
import "./App.css";

function AppContent() {
  const { notes, isDarkMode, session, syncError } = useAppContext();
  const [todayOnly, setTodayOnly] = useState(false);
  const [mobileTab, setMobileTab] = useState("fast");

  const pendingCount = (category) =>
    notes.filter(
      (note) => !note.completed && (note.category || "fast") === category,
    ).length;
  const hiddenOnMobile = (tab) => (mobileTab === tab ? "" : "hidden-mobile");
  const mobileTabs = [
    { id: "fast", label: `⚡ Rapides (${pendingCount("fast")})` },
    { id: "long", label: `📅 Long terme (${pendingCount("long")})` },
    { id: "agenda", label: "🗓️ Agenda" },
  ];

  if (session === undefined) {
    return <div className={`app ${isDarkMode ? "dark" : "light"}`} />;
  }

  if (!session) {
    return (
      <div className={`app ${isDarkMode ? "dark" : "light"}`}>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <Header
        todayOnly={todayOnly}
        onToggleTodayOnly={() => setTodayOnly((active) => !active)}
      />

      {syncError && (
        <p className="sync-error" role="alert">
          {syncError}
        </p>
      )}

      <nav className="mobile-tabs" aria-label="Sections">
        {mobileTabs.map((tab) => (
          <button
            key={tab.id}
            className={`mobile-tab${mobileTab === tab.id ? " active" : ""}`}
            aria-pressed={mobileTab === tab.id}
            onClick={() => setMobileTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-layout">
        <section className={`tasks-row ${mobileTab === "agenda" ? "hidden-mobile" : ""}`}>
          <div className={`task-column task-column--fast ${hiddenOnMobile("fast")}`}>
            <div className="task-column-header">
              <span className="task-icon">⚡</span>
              <h2>Tâches Rapides</h2>
            </div>
            <NoteForm category="fast" />
            <div className="scrollable-list">
              <NoteList category="fast" todayOnly={todayOnly} />
            </div>
          </div>

          <div className="tasks-divider-vertical" />

          <div className={`task-column task-column--long ${hiddenOnMobile("long")}`}>
            <div className="task-column-header">
              <span className="task-icon">📅</span>
              <h2>Tâches Long Terme</h2>
            </div>
            <NoteForm category="long" />
            <div className="scrollable-list">
              <NoteList category="long" todayOnly={todayOnly} />
            </div>
          </div>
        </section>

        <section className={`calendar-section ${hiddenOnMobile("agenda")}`}>
          <h3 className="calendar-title">🗓️ Agenda</h3>
          <div className="right-panel">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=579ef670bc51f337df94849c37c2da46f3cd26bc7c5710a455f33f334ede0b47%40group.calendar.google.com&ctz=Europe%2FParis"
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
