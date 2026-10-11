import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM PIXEL CURSOR COMPONENT ---
function PixelCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Spawn pixel trail particle on move
      if (Math.random() > 0.4) {
        const newParticle = {
          id: Math.random(),
          x: e.clientX + (Math.random() * 10 - 5),
          y: e.clientY + (Math.random() * 10 - 5),
          color: ['#00FFCC', '#FF007F', '#FFFF00', '#9900FF'][Math.floor(Math.random() * 4)]
        };
        setParticles(prev => [...prev.slice(-15), newParticle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Custom Retro Pointer */}
      <div style={{
        position: 'fixed',
        top: mousePosition.y,
        left: mousePosition.x,
        width: '18px',
        height: '18px',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-2px, -2px)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpolygon points='0,0 0,14 4,10 8,15 10,13 6,8 12,8' fill='%2300FFCC' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Particle Trail */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.3, y: p.y + 15 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: p.y,
            left: p.x,
            width: '6px',
            height: '6px',
            backgroundColor: p.color,
            pointerEvents: 'none',
            zIndex: 9998,
            boxShadow: `0 0 6px ${p.color}`
          }}
        />
      ))}
    </>
  );
}

const INITIAL_CARDS = [
  { id: 1, topic: 'NEURO-01', front: 'WHAT IS SYNAPTIC PLASTICITY?', back: 'The ability of synapses to strengthen or weaken over time. Core mechanism of memory & learning.' },
  { id: 2, topic: 'ALG-02', front: 'TIME COMPLEXITY OF QUICKSORT?', back: 'Average: O(n log n). Worst Case: O(n²) when pivot selection is sub-optimal.' },
  { id: 3, topic: 'BIO-03', front: 'PRIMARY FUNCTION OF ATP?', back: 'Adenosine Triphosphate: Cellular energy currency powering metabolic & mechanical work.' }
];

export default function App() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState('console'); // 'console' | 'roadmap' | 'analytics' | 'creator'
  
  // New Card Form
  const [newTopic, setNewTopic] = useState('');
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newFront || !newBack) return;
    const item = { id: Date.now(), topic: newTopic.toUpperCase() || 'CUSTOM-01', front: newFront.toUpperCase(), back: newBack };
    setCards([...cards, item]);
    setNewTopic(''); setNewFront(''); setNewBack('');
    setViewMode('console');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0518',
      color: '#00FFCC',
      fontFamily: '"Courier New", Courier, monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      overflowX: 'hidden',
      position: 'relative',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #1a0b2e 0%, #0a0518 100%)'
    }}>
      <PixelCursor />

      {/* CRT Scanline Overlay Effect */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 998,
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
        backgroundSize: '100% 4px, 6px 100%'
      }} />

      {/* TOP HUD BAR */}
      <header style={{
        width: '100%', maxWidth: '650px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: '3px solid #FF007F', padding: '10px 18px', backgroundColor: '#14082C',
        boxShadow: '0 0 15px rgba(255, 0, 127, 0.4)', marginBottom: '25px', zIndex: 2
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF007F', textShadow: '0 0 8px #FF007F' }}>
          PLAYER 1
        </div>
        <div style={{ fontSize: '13px', color: '#00FFCC', textShadow: '0 0 8px #00FFCC', letterSpacing: '1px' }}>
          GLITCH LEVEL 01
        </div>
        <div style={{ fontSize: '13px', color: '#FFFF00' }}>
          11:00 🔋
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { id: 'console', label: '🎮 STUDY STATION' },
          { id: 'roadmap', label: '🗺️ DECK ROADMAP' },
          { id: 'analytics', label: '📊 GLITCH STATS' },
          { id: 'creator', label: '⚡ ADD CARD' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id)}
            style={{
              padding: '8px 14px',
              backgroundColor: viewMode === tab.id ? '#00FFCC' : '#1F103A',
              color: viewMode === tab.id ? '#0A0518' : '#00FFCC',
              border: '2px solid #00FFCC',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '12px',
              boxShadow: viewMode === tab.id ? '0 0 12px #00FFCC' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW 1: RETRO CONSOLE & STUDY STATION */}
      {viewMode === 'console' && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%', maxWidth: '580px', zIndex: 2 }}>
          {/* Handheld Console Chassis */}
          <div style={{
            backgroundColor: '#FF2A85',
            border: '4px solid #FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 0 35px rgba(255, 42, 133, 0.6), inset 0 0 15px rgba(0,0,0,0.4)',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '12px', letterSpacing: '2px' }}>
              STUDY STATION.EXE - CARD [{currentIndex + 1}/{cards.length}]
            </div>

            {/* SCREEN VIEW (FLIP CARD) */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                backgroundColor: '#05020D',
                border: '4px solid #00FFCC',
                borderRadius: '12px',
                height: '240px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: 'inset 0 0 20px rgba(0, 255, 204, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#FFFF00' }}>
                <span>{currentCard.topic}</span>
                <span>{isFlipped ? 'STATUS: ANSWER' : 'STATUS: QUERY'}</span>
              </div>

              <div style={{ textAlign: 'center', padding: '10px' }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={isFlipped ? 'back' : 'front'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{
                      fontSize: isFlipped ? '14px' : '17px',
                      color: isFlipped ? '#00FFCC' : '#FFFFFF',
                      fontWeight: 'bold',
                      lineHeight: '1.5',
                      textShadow: '0 0 6px currentColor',
                      margin: 0
                    }}
                  >
                    {isFlipped ? currentCard.back : currentCard.front}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div style={{ textAlign: 'center', fontSize: '10px', color: '#FF007F', letterSpacing: '1px' }}>
                [ CLICK SCREEN TO FLIP ]
              </div>
            </div>

            {/* CONSOLE CONTROLS & BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              {/* D-Pad Simulation */}
              <div style={{ width: '60px', height: '60px', backgroundColor: '#110322', borderRadius: '8px', border: '2px solid #FFFFFF', display: 'grid', placeItems: 'center', fontSize: '10px', color: '#FFF' }}>
                ✚
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleNext}
                  style={{
                    backgroundColor: '#110322',
                    border: '2px solid #FF007F',
                    color: '#FF007F',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(255,0,127,0.4)'
                  }}
                >
                  NEED REVIEW
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    backgroundColor: '#00FFCC',
                    border: '2px solid #FFFFFF',
                    color: '#0A0518',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: 'pointer',
                    boxShadow: '0 0 12px #00FFCC'
                  }}
                >
                  MASTERED
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW 2: ROADMAP */}
      {viewMode === 'roadmap' && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%', maxWidth: '580px', backgroundColor: '#14082C', border: '3px solid #00FFCC', padding: '24px', zIndex: 2, boxShadow: '0 0 20px rgba(0,255,204,0.3)' }}>
          <h2 style={{ fontSize: '16px', color: '#FFFF00', textAlign: 'center', marginBottom: '20px' }}>🗺️ DECK ROADMAP.MAP</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {cards.map((c, idx) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '2px dashed #FF007F', backgroundColor: '#0A0518' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#00FFCC' }}>CHECKPOINT 0{idx + 1}</span>
                  <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 'bold' }}>{c.topic}</div>
                </div>
                <button onClick={() => { setCurrentIndex(idx); setViewMode('console'); }} style={{ background: '#00FFCC', border: 'none', padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
                  JUMP 🚀
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* VIEW 3: GLITCH ANALYTICS */}
      {viewMode === 'analytics' && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%', maxWidth: '580px', backgroundColor: '#14082C', border: '3px solid #FF007F', padding: '24px', zIndex: 2, boxShadow: '0 0 20px rgba(255,0,127,0.3)' }}>
          <h2 style={{ fontSize: '16px', color: '#00FFCC', textAlign: 'center', marginBottom: '20px' }}>📊 GLITCH ANALYTICS.EXE</h2>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <span>TOTAL DECK ITEMS: {cards.length}</span>
              <div style={{ width: '100%', height: '10px', background: '#0A0518', border: '1px solid #00FFCC', marginTop: '6px' }}>
                <div style={{ width: '100%', height: '100%', background: '#00FFCC' }} />
              </div>
            </div>
            <div>
              <span>MASTERY SYNCHRONIZATION: 100%</span>
              <div style={{ width: '100%', height: '10px', background: '#0A0518', border: '1px solid #FF007F', marginTop: '6px' }}>
                <div style={{ width: '85%', height: '100%', background: '#FF007F' }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW 4: CREATOR */}
      {viewMode === 'creator' && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: '100%', maxWidth: '580px', backgroundColor: '#14082C', border: '3px solid #FFFF00', padding: '24px', zIndex: 2, boxShadow: '0 0 20px rgba(255,255,0,0.3)' }}>
          <h2 style={{ fontSize: '16px', color: '#FFFF00', textAlign: 'center', marginBottom: '20px' }}>⚡ UPLOAD NEW FLASHCARD</h2>
          <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="text" placeholder="TOPIC CODE (e.g. QUANTUM-01)" value={newTopic} onChange={e => setNewTopic(e.target.value)}
              style={{ background: '#0A0518', border: '2px solid #00FFCC', padding: '10px', color: '#FFF', fontFamily: 'inherit' }} 
            />
            <textarea 
              rows={2} placeholder="FRONT QUESTION..." value={newFront} onChange={e => setNewFront(e.target.value)}
              style={{ background: '#0A0518', border: '2px solid #00FFCC', padding: '10px', color: '#FFF', fontFamily: 'inherit' }} 
            />
            <textarea 
              rows={3} placeholder="BACK EXPLANATION..." value={newBack} onChange={e => setNewBack(e.target.value)}
              style={{ background: '#0A0518', border: '2px solid #00FFCC', padding: '10px', color: '#FFF', fontFamily: 'inherit' }} 
            />
            <button type="submit" style={{ backgroundColor: '#FF007F', color: '#FFF', border: '2px solid #FFF', padding: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 10px #FF007F' }}>
              INITIALIZE CARD TO DECK 🚀
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}