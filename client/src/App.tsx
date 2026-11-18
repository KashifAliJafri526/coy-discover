
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  X,
  House,
  Compass,
  MessageCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LoaderCircle,
  Check,
  Users,
  RotateCcw
} from "lucide-react";

import "./App.css";

const API_URL = "http://localhost:5000/api";

interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  interests: string[];
}

interface Match {
  id: string;
  createdAt: string;
  profile: Profile;
}

type Tab = "home" | "discover" | "matches";
type SwipeAction = "like" | "pass";

interface SwipeResponse {
  success: boolean;
  matched: boolean;
  match: (Match & { profile: Profile }) | null;
  message: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [feed, setFeed] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [error, setError] = useState("");
  const [matchPopup, setMatchPopup] = useState<Profile | null>(null);

  const loadFeed = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/feed`);
      setFeed(response.data.profiles);
      setError("");
    } catch {
      setError("Couldn't connect to Coy. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/matches`);
      setMatches(response.data.matches);
    } catch {
      console.error("Unable to load matches.");
    }
  }, []);

  useEffect(() => {
    void loadFeed();
    void loadMatches();
  }, [loadFeed, loadMatches]);

  const handleSwipe = async (action: SwipeAction) => {
    const currentProfile = feed[0];

    if (!currentProfile || swiping) return;

    setSwiping(true);
    setError("");

    try {
      const response = await axios.post<SwipeResponse>(
        `${API_URL}/swipe`,
        {
          profileId: currentProfile.id,
          action
        }
      );

      setFeed((previous) =>
        previous.filter((profile) => profile.id !== currentProfile.id)
      );

      if (response.data.matched && response.data.match) {
        setMatchPopup(response.data.match.profile);
        await loadMatches();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        await loadFeed();
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSwiping(false);
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    if (info.offset.x > 110) {
      void handleSwipe("like");
    } else if (info.offset.x < -110) {
      void handleSwipe("pass");
    }
  };

  const currentProfile = feed[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setActiveTab("discover")}
          aria-label="Coy Discover home"
        >
          <span className="brand-mark">
            <Heart size={19} fill="currentColor" />
          </span>
          <span>coy<span className="brand-light">.</span></span>
        </button>

        <div className="topbar-right">
          <span className="online-indicator">
            <span />
            Your space to connect
          </span>
          <div className="avatar-placeholder">K</div>
        </div>
      </header>

      <main className="main-content">
        <div className="page-heading">
          <div>
            <span className="eyebrow">A LITTLE SPARK CAN GO A LONG WAY</span>
            <h1>
              Discover <span>your people.</span>
            </h1>
            <p>Good connections start with a little curiosity.</p>
          </div>
          <div className="heading-decoration">
            <Sparkles size={22} />
          </div>
        </div>

        <div className="content-layout">
          <aside className="sidebar">
            <div className="sidebar-label">MENU</div>

            <button
              className={`nav-item ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              <House size={19} />
              <span>Home</span>
            </button>

            <button
              className={`nav-item ${activeTab === "discover" ? "active" : ""}`}
              onClick={() => setActiveTab("discover")}
            >
              <Compass size={19} />
              <span>Discover</span>
              <span className="nav-dot" />
            </button>

            <button
              className={`nav-item ${activeTab === "matches" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("matches");
                void loadMatches();
              }}
            >
              <MessageCircle size={19} />
              <span>Matches</span>
              {matches.length > 0 && (
                <span className="nav-count">{matches.length}</span>
              )}
            </button>

            <div className="sidebar-divider" />

            <div className="privacy-card">
              <div className="privacy-icon">
                <Heart size={17} />
              </div>
              <strong>Keep it genuine.</strong>
              <p>Your connections are private. Only mutual likes become matches.</p>
            </div>

            <div className="sidebar-footer">
              MADE FOR MEANINGFUL CONNECTIONS
              <span>COY DISCOVER © 2026</span>
            </div>
          </aside>

          <section className="workspace">
            <AnimatePresence mode="wait">
              {activeTab === "home" && (
                <motion.div
                  key="home"
                  className="placeholder-page"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="placeholder-icon">
                    <House size={28} />
                  </div>
                  <span className="eyebrow">YOUR PERSONAL SPACE</span>
                  <h2>Something good starts here.</h2>
                  <p>
                    Your home for all things Coy. Head over to Discover and
                    see who you might connect with.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => setActiveTab("discover")}
                  >
                    Explore Discover <ArrowRight size={17} />
                  </button>
                </motion.div>
              )}

              {activeTab === "discover" && (
                <motion.div
                  key="discover"
                  className="discover-page"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">THE DISCOVERY SPACE</span>
                      <h2>Someone new, maybe?</h2>
                    </div>
                    <div className="profile-counter">
                      <Users size={15} />
                      {feed.length} to discover
                    </div>
                  </div>

                  {loading ? (
                    <div className="state-message">
                      <LoaderCircle className="spin" size={30} />
                      <p>Finding your people...</p>
                    </div>
                  ) : error && feed.length === 0 ? (
                    <div className="state-message error-state">
                      <MessageCircle size={30} />
                      <p>{error}</p>
                      <button className="secondary-button" onClick={() => {
                        setLoading(true);
                        void loadFeed();
                      }}>
                        <RotateCcw size={15} /> Try again
                      </button>
                    </div>
                  ) : currentProfile ? (
                    <div className="discovery-stage">
                      <div className="swipe-hint swipe-hint-left">
                        <X size={17} /> PASS
                      </div>
                      <div className="swipe-hint swipe-hint-right">
                        LIKE <Heart size={17} />
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.article
                          key={currentProfile.id}
                          className="profile-card"
                          drag={swiping ? false : "x"}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.8}
                          onDragEnd={handleDragEnd}
                          initial={{ opacity: 0, scale: 0.94, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            x: 250,
                            rotate: 12,
                            scale: 0.9
                          }}
                          transition={{ duration: 0.28 }}
                          whileDrag={{ scale: 1.03, rotate: 2 }}
                        >
                          <div className="profile-image-wrap">
                            <img
                              src={currentProfile.photo}
                              alt={currentProfile.name}
                              className="profile-image"
                              draggable={false}
                            />
                            <div className="image-overlay" />
                            <div className="profile-top-tag">
                              <Sparkles size={13} />
                              NEW CONNECTION
                            </div>
                            <div className="profile-image-info">
                              <div className="profile-name-line">
                                <h3>{currentProfile.name}</h3>
                                <span>{currentProfile.age}</span>
                              </div>
                              <div className="profile-location">
                                <MapPin size={14} />
                                {currentProfile.city}
                              </div>
                            </div>
                          </div>

                          <div className="profile-details">
                            <p className="profile-bio">{currentProfile.bio}</p>
                            <div className="interest-list">
                              {currentProfile.interests.map((interest) => (
                                <span key={interest}>{interest}</span>
                              ))}
                            </div>
                          </div>
                        </motion.article>
                      </AnimatePresence>

                      <div className="swipe-controls">
                        <button
                          className="swipe-button pass-button"
                          onClick={() => void handleSwipe("pass")}
                          disabled={swiping}
                          aria-label="Pass profile"
                        >
                          <X size={25} />
                        </button>
                        <button
                          className="swipe-button like-button"
                          onClick={() => void handleSwipe("like")}
                          disabled={swiping}
                          aria-label="Like profile"
                        >
                          <Heart size={25} fill="currentColor" />
                        </button>
                      </div>

                      <p className="gesture-caption">
                        <ArrowLeft size={13} /> Drag to pass
                        <span>•</span>
                        Drag to like <ArrowRight size={13} />
                      </p>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Check size={32} />
                      </div>
                      <span className="eyebrow">YOU'RE ALL CAUGHT UP</span>
                      <h3>That's everyone for now.</h3>
                      <p>
                        You've explored all available profiles. Check back
                        later for new connections.
                      </p>
                    </div>
                  )}
                  {error && feed.length > 0 && (
                    <p className="inline-error">{error}</p>
                  )}
                </motion.div>
              )}

              {activeTab === "matches" && (
                <motion.div
                  key="matches"
                  className="matches-page"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">THE GOOD PART</span>
                      <h2>Your connections.</h2>
                    </div>
                    <div className="profile-counter">
                      <Heart size={15} />
                      {matches.length} mutual
                    </div>
                  </div>

                  {matches.length === 0 ? (
                    <div className="empty-state matches-empty">
                      <div className="empty-icon">
                        <Heart size={30} />
                      </div>
                      <span className="eyebrow">NOT YET, BUT SOON</span>
                      <h3>Your story starts with a spark.</h3>
                      <p>
                        When someone you've liked likes you back, you'll find
                        your match right here.
                      </p>
                      <button
                        className="primary-button"
                        onClick={() => setActiveTab("discover")}
                      >
                        Discover people <ArrowRight size={17} />
                      </button>
                    </div>
                  ) : (
                    <div className="matches-grid">
                      {matches.map((match) => (
                        <motion.div
                          className="match-card"
                          key={match.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <img src={match.profile.photo} alt={match.profile.name} />
                          <div className="match-card-info">
                            <h3>{match.profile.name}, {match.profile.age}</h3>
                            <p><MapPin size={13} /> {match.profile.city}</p>
                            <span><Heart size={12} fill="currentColor" /> It's mutual</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <nav className="mobile-nav">
        <button
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          <House size={20} />
          <span>Home</span>
        </button>
        <button
          className={activeTab === "discover" ? "active" : ""}
          onClick={() => setActiveTab("discover")}
        >
          <Compass size={20} />
          <span>Discover</span>
        </button>
        <button
          className={activeTab === "matches" ? "active" : ""}
          onClick={() => {
            setActiveTab("matches");
            void loadMatches();
          }}
        >
          <MessageCircle size={20} />
          <span>Matches</span>
          {matches.length > 0 && <i />}
        </button>
      </nav>

      <AnimatePresence>
        {matchPopup && (
          <motion.div
            className="match-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="match-modal"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <div className="match-sparkle"><Sparkles size={24} /></div>
              <span className="eyebrow">SOMETHING JUST CLICKED</span>
              <h2>It's a <span>match!</span></h2>
              <p>Turns out the feeling was mutual.</p>
              <div className="match-photos">
                <div className="match-photo-you">K</div>
                <div className="match-heart"><Heart size={20} fill="currentColor" /></div>
                <img src={matchPopup.photo} alt={matchPopup.name} />
              </div>
              <h3>You and {matchPopup.name}</h3>
              <p className="match-subtitle">A new connection begins here.</p>
              <button
                className="primary-button match-continue"
                onClick={() => {
                  setMatchPopup(null);
                  setActiveTab("matches");
                }}
              >
                See your matches <ArrowRight size={17} />
              </button>
              <button
                className="match-dismiss"
                onClick={() => setMatchPopup(null)}
              >
                Keep discovering
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
