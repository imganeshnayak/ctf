import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './LobbyPage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://ctf-zubh.onrender.com';

/* ── Deterministic hash helpers ─────────────────────────────────────── */
function hashStr(s, seed = 31) {
  let h = 0;
  for (let c of s) h = (h * seed + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(h);
}

/* ── Avatar initials ─────────────────────────────────────────────────── */
function avatarInitials(username) {
  const parts = username.replace(/[^a-z0-9]/gi, ' ').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return username.slice(0, 2).toUpperCase();
}

/* ─────────────────────────────────────────────────────────────────────
   CHIBI CHARACTER SVG
   Full-body cute 2D bot inspired by Wayground Qbit style:
   - Big round chibi head
   - Colored hat / beanie / cap
   - Colored outfit
   - Stumpy arms & legs
   - Optional backpack
   - Dark oval pedestal
   - Spotlight cone from above
────────────────────────────────────────────────────────────────────── */
const HAT_PALETTE = ['#00bfae', '#e63946', '#3a86ff', '#8338ec', '#f77f00', '#06d6a0', '#ec4899', '#ffd166'];
const SHIRT_PALETTE = ['#c9184a', '#3a86ff', '#7209b7', '#06d6a0', '#e85d04', '#ec4899', '#264653', '#4361ee'];
const PANTS_PALETTE = ['#1d3557', '#264653', '#3d405b', '#2d3a59', '#1b1b2f', '#1a2744', '#1e2a38', '#0d1117'];
const SHOE_PALETTE = ['#1c1c1c', '#2d2d2d', '#3a3a3a', '#111827', '#1f1f2e'];
const HAT_TYPES = ['beanie', 'cap', 'headband', 'antenna', 'cowboy'];

function ChibiCharacter({ username, size = 110, glowColor = '#00f5d4', animate = true }) {
  const h1 = hashStr(username, 31);
  const h2 = hashStr(username, 17);
  const h3 = hashStr(username, 7);
  const h4 = hashStr(username, 13);

  const hatColor = HAT_PALETTE[h1 % HAT_PALETTE.length];
  const shirtColor = SHIRT_PALETTE[h2 % SHIRT_PALETTE.length];
  const pantsColor = PANTS_PALETTE[h3 % PANTS_PALETTE.length];
  const shoeColor = SHOE_PALETTE[h4 % SHOE_PALETTE.length];
  const hatType = HAT_TYPES[h1 % HAT_TYPES.length];
  const hasBackpack = h2 % 3 === 0;
  const hasBlush = h3 % 2 === 0;
  const hasBadge = h4 % 3 !== 0;

  const skinColor = '#f0ece3';
  const eyeColor = '#111';

  // Spotlight colour (lighter version of hat)
  const spotAlpha = 0.07;

  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 80 108"
      style={{ overflow: 'visible', animation: animate ? 'chibiFloat 3.5s ease-in-out infinite' : undefined }}
    >
      <defs>
        {/* Spotlight cone */}
        <radialGradient id={`spot-${username}`} cx="50%" cy="0%" r="90%" fx="50%" fy="0%">
          <stop offset="0%" stopColor="white" stopOpacity={spotAlpha * 2} />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        {/* Platform glow */}
        <radialGradient id={`pglow-${username}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
        {/* Shirt gradient */}
        <linearGradient id={`shirt-${username}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shirtColor} />
          <stop offset="100%" stopColor={shirtColor} stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* ── SPOTLIGHT CONE ─────────────────────────────────── */}
      <ellipse cx="40" cy="5" rx="22" ry="4" fill={`url(#spot-${username})`} />
      <path d="M18,0 Q40,-8 62,0 L68,92 L12,92 Z" fill={`url(#spot-${username})`} />

      {/* ── PLATFORM ──────────────────────────────────────── */}
      {/* Glow halo under platform */}
      <ellipse cx="40" cy="97" rx="30" ry="9" fill={`url(#pglow-${username})`} />
      {/* Platform body */}
      <ellipse cx="40" cy="96" rx="26" ry="7" fill="#0d1117" />
      <ellipse cx="40" cy="93" rx="26" ry="6" fill="#161b22" />
      <ellipse cx="40" cy="91" rx="26" ry="5.5" fill="#1c2333" />
      {/* Platform rim highlight */}
      <ellipse cx="40" cy="91" rx="26" ry="5.5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />

      {/* ── BACKPACK (behind, drawn first) ──────────────── */}
      {hasBackpack && (
        <g>
          <rect x="54" y="48" width="12" height="20" rx="4" fill="#2d3a59" />
          <rect x="55" y="50" width="10" height="4" rx="2" fill="#374151" />
          {/* Strap */}
          <path d="M56,48 Q63,44 63,52" fill="none" stroke="#4b5563" strokeWidth="1.5" />
        </g>
      )}

      {/* ── LEFT ARM ─────────────────────────────────────── */}
      <rect x="6" y="51" width="13" height="22" rx="6.5" fill={skinColor} />
      {/* Sleeve cuff */}
      <rect x="6" y="51" width="13" height="6" rx="4" fill={shirtColor} opacity="0.9" />

      {/* ── RIGHT ARM ────────────────────────────────────── */}
      <rect x="61" y="51" width="13" height="22" rx="6.5" fill={skinColor} />
      {/* Sleeve cuff */}
      <rect x="61" y="51" width="13" height="6" rx="4" fill={shirtColor} opacity="0.9" />

      {/* ── BODY / SHIRT ─────────────────────────────────── */}
      <rect x="18" y="50" width="44" height="32" rx="11" fill={`url(#shirt-${username})`} />
      {/* Shirt shine */}
      <ellipse cx="28" cy="57" rx="5" ry="3" fill="rgba(255,255,255,0.12)" transform="rotate(-20,28,57)" />
      {/* Shirt pattern/badge */}
      {hasBadge && (
        <>
          <circle cx="44" cy="61" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
          <line x1="38" y1="60" x2="40" y2="63" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {/* Neck / collar */}
      <rect x="33" y="46" width="14" height="8" rx="4" fill={skinColor} />
      <rect x="33" y="49" width="14" height="4" rx="2" fill={shirtColor} opacity="0.7" />

      {/* ── PANTS / LEGS ─────────────────────────────────── */}
      <rect x="20" y="79" width="16" height="18" rx="6" fill={pantsColor} />
      <rect x="44" y="79" width="16" height="18" rx="6" fill={pantsColor} />
      {/* Pants divider line */}
      <line x1="40" y1="80" x2="40" y2="86" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* ── SHOES ────────────────────────────────────────── */}
      <rect x="16" y="91" width="20" height="10" rx="5" fill={shoeColor} />
      <rect x="44" y="91" width="20" height="10" rx="5" fill={shoeColor} />
      {/* Shoe highlight */}
      <rect x="18" y="92" width="9" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
      <rect x="46" y="92" width="9" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />

      {/* ── HEAD ─────────────────────────────────────────── */}
      {/* Head shadow drop */}
      <ellipse cx="41" cy="37" rx="23" ry="21" fill="rgba(0,0,0,0.2)" transform="translate(1,2)" />
      {/* Main head */}
      <ellipse cx="40" cy="36" rx="23" ry="21" fill={skinColor} />
      {/* Head shine */}
      <ellipse cx="33" cy="26" rx="6" ry="4" fill="rgba(255,255,255,0.2)" transform="rotate(-30,33,26)" />

      {/* Cheek blush */}
      {hasBlush && (
        <>
          <ellipse cx="25" cy="41" rx="6" ry="3.5" fill="#ffb3b3" opacity="0.35" />
          <ellipse cx="55" cy="41" rx="6" ry="3.5" fill="#ffb3b3" opacity="0.35" />
        </>
      )}

      {/* Eyes */}
      <circle cx="33" cy="37" r="5" fill={eyeColor} />
      <circle cx="47" cy="37" r="5" fill={eyeColor} />
      {/* Eye shines */}
      <circle cx="31" cy="34.5" r="2" fill="white" />
      <circle cx="45" cy="34.5" r="2" fill="white" />
      {/* Small lower shine */}
      <circle cx="35.5" cy="39.5" r="1" fill="rgba(255,255,255,0.5)" />
      <circle cx="49.5" cy="39.5" r="1" fill="rgba(255,255,255,0.5)" />

      {/* ── HAT ─────────────────────────────────────────── */}
      {hatType === 'beanie' && (
        <g>
          {/* Beanie dome */}
          <path d="M17,34 Q17,8 40,8 Q63,8 63,34 Z" fill={hatColor} />
          {/* Beanie ribbing lines */}
          <line x1="26" y1="10" x2="22" y2="33" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
          <line x1="33" y1="8.5" x2="31" y2="33" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
          <line x1="40" y1="8" x2="40" y2="33" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
          <line x1="47" y1="8.5" x2="49" y2="33" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
          <line x1="54" y1="10" x2="58" y2="33" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
          {/* Pom pom */}
          <circle cx="40" cy="9" r="7" fill={hatColor} filter="url(#soften)" />
          <circle cx="40" cy="9" r="7" fill="rgba(255,255,255,0.15)" />
          <circle cx="37" cy="7" r="2.5" fill="rgba(255,255,255,0.25)" />
          {/* Band */}
          <rect x="17" y="31" width="46" height="6" rx="3" fill={hatColor} opacity="0.85" />
          <rect x="17" y="31" width="46" height="3" rx="3" fill="rgba(255,255,255,0.1)" />
        </g>
      )}

      {hatType === 'cap' && (
        <g>
          {/* Cap dome */}
          <path d="M18,34 Q18,10 40,10 Q62,10 62,34 Z" fill={hatColor} />
          <ellipse cx="40" cy="10" rx="10" ry="3" fill="rgba(255,255,255,0.2)" />
          {/* Brim */}
          <rect x="12" y="31" width="36" height="6" rx="3" fill={hatColor} />
          <rect x="12" y="31" width="36" height="3" rx="2" fill="rgba(255,255,255,0.18)" />
          {/* Logo on cap */}
          <circle cx="40" cy="22" r="4" fill="rgba(255,255,255,0.2)" />
        </g>
      )}

      {hatType === 'headband' && (
        <g>
          <rect x="17" y="26" width="46" height="9" rx="4.5" fill={hatColor} />
          <rect x="17" y="26" width="46" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
          {/* Side bow effect */}
          <ellipse cx="63" cy="30" rx="6" ry="4" fill={hatColor} transform="rotate(20,63,30)" />
        </g>
      )}

      {hatType === 'antenna' && (
        <g>
          {/* Antenna rod */}
          <line x1="40" y1="15" x2="40" y2="2" stroke={hatColor} strokeWidth="2" strokeLinecap="round" />
          {/* Antenna ball */}
          <circle cx="40" cy="2" r="4.5" fill={hatColor}>
            <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="38.5" cy="0.8" r="1.5" fill="rgba(255,255,255,0.5)" />
          {/* Hair-like bump */}
          <path d="M18,35 Q18,12 40,12 Q62,12 62,35 Z" fill={hatColor} opacity="0.6" />
        </g>
      )}

      {hatType === 'cowboy' && (
        <g>
          {/* Brim (wide) */}
          <ellipse cx="40" cy="30" rx="30" ry="5" fill={hatColor} />
          {/* Crown */}
          <path d="M24,30 Q24,10 40,10 Q56,10 56,30 Z" fill={hatColor} />
          {/* Crown crease */}
          <line x1="40" y1="10" x2="40" y2="28" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          {/* Brim highlight */}
          <ellipse cx="40" cy="30" rx="30" ry="5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}

/* ── Floating background bots  ───────────────────────────────────────── */
function FloatingBots({ bots }) {
  return (
    <div className="lobby-floating-bots" aria-hidden="true">
      {bots.map(b => (
        <div key={b.id} className="fbot" style={{
          left: `${b.x}%`, top: `${b.y}%`,
          animationDuration: `${b.dur}s`,
          animationDelay: `${b.delay}s`,
          opacity: b.opacity,
          pointerEvents: 'none',
        }}>
          {/* Tiny silhouette chibi */}
          <svg width={b.size} height={b.size * 1.3} viewBox="0 0 40 52">
            <ellipse cx="20" cy="16" rx="11" ry="10" fill={b.color} />
            <rect x="10" y="24" width="20" height="14" rx="5" fill={b.color} />
            <rect x="5" y="25" width="7" height="10" rx="3.5" fill={b.color} />
            <rect x="28" y="25" width="7" height="10" rx="3.5" fill={b.color} />
            <rect x="12" y="37" width="7" height="9" rx="3" fill={b.color} />
            <rect x="21" y="37" width="7" height="9" rx="3" fill={b.color} />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ── Radar scanner  ──────────────────────────────────────────────────── */
function RadarPing() {
  return (
    <div className="lobby-radar" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="90" height="90">
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,245,212,0.1)" strokeWidth="1" />
        <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,245,212,0.08)" strokeWidth="1" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(0,245,212,0.07)" strokeWidth="1" />
        <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(0,245,212,0.05)" strokeWidth="1" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(0,245,212,0.05)" strokeWidth="1" />
        <path d="M50,50 L50,2 A48,48 0 0,1 98,50 Z" fill="rgba(0,245,212,0.05)">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
        </path>
        <circle cx="50" cy="50" r="3" fill="#00f5d4" opacity="0.9" />
      </svg>
    </div>
  );
}

/* ── Countdown overlay ───────────────────────────────────────────────── */
function CountdownOverlay({ onDone }) {
  const [count, setCount] = useState(5);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onDone]);

  const names = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'ZETA'];

  return (
    <div className="lobby-countdown-overlay">
      <div className="lcd-launch">
        {/* Row of chibi bots above */}
        <div className="lcd-bots-row">
          {names.map((n, i) => (
            <div key={i} className="lcd-mini-chibi" style={{ animationDelay: `${i * 0.12}s` }}>
              <ChibiCharacter username={n} size={50} animate={false} />
            </div>
          ))}
        </div>
        <div className="lcd-title">⚡ CTF IS STARTING!</div>
        <div className="lcd-number">{count || '🔥'}</div>
        <div className="lcd-sub">Deploying all bots to the arena...</div>
        <div className="lcd-bar"><div className="lcd-fill" style={{ width: `${((5 - count) / 5) * 100}%` }} /></div>
      </div>
    </div>
  );
}


/* ── Scene Bot — roaming chibi on the playground ──────────────────────── */
function SceneBot({ participant, isMe, pos }) {
  const glowColor = HAT_PALETTE[hashStr(participant.username, 31) % HAT_PALETTE.length];
  return (
    <div
      className={`scene-bot ${isMe ? 'scene-bot--me' : ''}`}
      style={{ left: `${pos.x}%`, bottom: `${pos.y}px` }}
    >
      {/* Tooltip */}
      <div className="scene-bot__tooltip">
        <div className="scene-bot__tooltip-name">{participant.username}{isMe ? ' (YOU)' : ''}</div>
        <div className="scene-bot__tooltip-row"><span>STAGE</span><span>{participant.currentStage ?? 1}</span></div>
        <div className="scene-bot__tooltip-row"><span>SCORE</span><span>{participant.totalScore ?? 0} pts</span></div>
        <div className="scene-bot__tooltip-row"><span>STATUS</span><span>ONLINE</span></div>
      </div>

      {/* Chibi */}
      <ChibiCharacter username={participant.username} size={isMe ? 80 : 68} glowColor={glowColor} animate={false} />

      {/* Nametag */}
      <div className="scene-bot__nametag">{participant.username.slice(0, 12)}{isMe ? ' ★' : ''}</div>

      {/* Shadow */}
      <div className="scene-bot__shadow" />
    </div>
  );
}

/* ── Playground scene SVG props ──────────────────────────────────────────── */
function PlaygroundProps() {
  return (
    <>
      {/* Lamppost left */}
      <div className="lobby-prop" style={{ left: '4%' }}>
        <svg width="28" height="90" viewBox="0 0 28 90">
          <rect x="12" y="10" width="4" height="75" rx="2" fill="#1e2d3d" />
          <path d="M14,10 Q22,4 24,14" stroke="#1e2d3d" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="24" cy="14" rx="5" ry="3" fill="#00f5d4" opacity="0.8" />
          <ellipse cx="24" cy="14" rx="10" ry="6" fill="#00f5d4" opacity="0.08" />
          <rect x="9" y="82" width="10" height="4" rx="2" fill="#152235" />
        </svg>
      </div>

      {/* WiFi tower */}
      <div className="lobby-prop" style={{ left: '22%' }}>
        <svg width="36" height="80" viewBox="0 0 36 80">
          <rect x="15" y="20" width="6" height="55" rx="2" fill="#1e2d3d" />
          <line x1="18" y1="20" x2="4" y2="50" stroke="#1e2d3d" strokeWidth="2" />
          <line x1="18" y1="20" x2="32" y2="50" stroke="#1e2d3d" strokeWidth="2" />
          <circle cx="18" cy="12" r="4" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.7" />
          <circle cx="18" cy="12" r="7" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.4" />
          <circle cx="18" cy="12" r="10" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.2" />
          <circle cx="18" cy="12" r="2" fill="#7c3aed" opacity="0.9" />
          <rect x="11" y="72" width="14" height="5" rx="2" fill="#152235" />
        </svg>
      </div>

      {/* Terminal kiosk */}
      <div className="lobby-prop" style={{ left: '48%' }}>
        <svg width="56" height="80" viewBox="0 0 56 80">
          <rect x="4" y="12" width="48" height="38" rx="5" fill="#0d1525" stroke="#1e3a4a" strokeWidth="1.5" />
          <rect x="8" y="16" width="40" height="28" rx="3" fill="#020810" />
          <text x="12" y="26" fontSize="5" fill="#00f5d4" fontFamily="monospace">$ CTF_v7</text>
          <text x="12" y="34" fontSize="4.5" fill="#475569" fontFamily="monospace">{'>'} scanning...</text>
          <text x="12" y="41" fontSize="4" fill="#00f5d4" fontFamily="monospace" opacity="0.6">▌</text>
          <rect x="18" y="52" width="20" height="10" rx="2" fill="#0f1e30" />
          <rect x="20" y="62" width="16" height="14" rx="1" fill="#152235" />
          <rect x="6" y="74" width="44" height="5" rx="2" fill="#0d1a2a" />
        </svg>
      </div>

      {/* Bench */}
      <div className="lobby-prop" style={{ left: '68%' }}>
        <svg width="72" height="45" viewBox="0 0 72 45">
          <rect x="2" y="16" width="68" height="8" rx="3" fill="#1a3050" />
          <rect x="8" y="24" width="56" height="5" rx="2" fill="#132540" />
          <rect x="6" y="29" width="6" height="14" rx="2" fill="#1a3050" />
          <rect x="60" y="29" width="6" height="14" rx="2" fill="#1a3050" />
          <rect x="0" y="10" width="72" height="6" rx="3" fill="#0f2038" />
        </svg>
      </div>

      {/* Lamppost right */}
      <div className="lobby-prop" style={{ right: '4%' }}>
        <svg width="28" height="90" viewBox="0 0 28 90">
          <rect x="12" y="10" width="4" height="75" rx="2" fill="#1e2d3d" />
          <path d="M14,10 Q6,4 4,14" stroke="#1e2d3d" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="4" cy="14" rx="5" ry="3" fill="#ec4899" opacity="0.7" />
          <ellipse cx="4" cy="14" rx="10" ry="6" fill="#ec4899" opacity="0.07" />
          <rect x="9" y="82" width="10" height="4" rx="2" fill="#152235" />
        </svg>
      </div>
    </>
  );
}

/* ── Wander position hook ─────────────────────────────────────────────── */
function useWanderPositions(participants) {
  const posRef = useRef({});
  const timerRef = useRef({});
  const [positions, setPositions] = useState({});

  useEffect(() => {
    // Assign initial positions
    participants.forEach(p => {
      if (!posRef.current[p.userId]) {
        posRef.current[p.userId] = {
          x: 5 + Math.random() * 85,
          y: 105 + Math.random() * 30,
        };
      }
    });
    setPositions({ ...posRef.current });

    // Start wander for each
    participants.forEach(p => {
      if (timerRef.current[p.userId]) return; // already running
      const wander = () => {
        posRef.current[p.userId] = {
          x: 5 + Math.random() * 85,
          y: 100 + Math.random() * 40,
        };
        setPositions(prev => ({ ...prev, [p.userId]: { ...posRef.current[p.userId] } }));
        const delay = 2200 + Math.random() * 3500;
        timerRef.current[p.userId] = setTimeout(wander, delay);
      };
      timerRef.current[p.userId] = setTimeout(wander, 800 + Math.random() * 2000);
    });

    // Cleanup removed participants
    return () => {
      Object.keys(timerRef.current).forEach(id => {
        if (!participants.find(p => p.userId === id)) {
          clearTimeout(timerRef.current[id]);
          delete timerRef.current[id];
          delete posRef.current[id];
        }
      });
    };
  }, [participants]);

  return positions;
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function LobbyPage() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const feedRef = useRef(null);

  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ctf_user')); } catch { return null; }
  });

  const [participants, setParticipants] = useState([]);
  const [ctfStarted, setCtfStarted] = useState(false);
  const [feed, setFeed] = useState([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [connected, setConnected] = useState(false);

  const [floatingBots] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i, x: Math.random() * 95, y: Math.random() * 95,
      size: 18 + Math.random() * 22, dur: 14 + Math.random() * 14,
      delay: Math.random() * 10, opacity: 0.02 + Math.random() * 0.06,
      color: HAT_PALETTE[i % HAT_PALETTE.length],
    }))
  );

  const wanderPositions = useWanderPositions(participants);

  const addFeed = useCallback((text, type = 'info') => {
    const ts = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setFeed(f => [{ id: Date.now() + Math.random(), text, type, ts }, ...f].slice(0, 60));
  }, []);

  const handleCountdownDone = useCallback(() => navigate('/challenges'), [navigate]);

  useEffect(() => { if (!user) navigate('/challenges'); }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const socket = io(API_BASE, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-lobby', { userId: user._id, username: user.username });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('lobby-update', (snapshot) => {
      setParticipants(snapshot.users || []);
      setCtfStarted(prev => {
        if (snapshot.ctfStarted && !prev) setShowCountdown(true);
        return snapshot.ctfStarted ?? prev;
      });
    });
    socket.on('system-message', ({ text }) => addFeed(text, 'system'));
    socket.on('ctf-start', ({ message }) => { addFeed(message, 'launch'); setCtfStarted(true); setShowCountdown(true); });
    socket.on('ctf-stop', ({ message }) => { setCtfStarted(false); setShowCountdown(false); addFeed(message, 'warn'); });

    fetch(`${API_BASE}/api/lobby/status`)
      .then(r => r.json())
      .then(({ data }) => {
        if (data?.ctfStarted) { setCtfStarted(true); navigate('/challenges'); }
      })
      .catch(() => { });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => { if (feedRef.current) feedRef.current.scrollTop = 0; }, [feed]);
  if (!user) return null;

  const myGlow = HAT_PALETTE[hashStr(user.username, 31) % HAT_PALETTE.length];

  return (
    <div className="lobby-root">
      <div className="lobby-circuit-bg" aria-hidden="true" />
      <FloatingBots bots={floatingBots} />
      {showCountdown && <CountdownOverlay onDone={handleCountdownDone} />}

      <div className="lobby-layout">

        {/* ══ SIDEBAR ═══════════════════════════════════════ */}
        <aside className="lobby-sidebar">

          {/* My card */}
          <div className="lobby-me-card glass">
            <div className="lobby-me-chibi">
              <ChibiCharacter username={user.username} size={68} glowColor={myGlow} />
            </div>
            <div className="lobby-me-info">
              <div className="lobby-me-name">{user.username}</div>
              <div className="lobby-me-sub">
                <span className={`lobby-conn-dot ${connected ? 'connected' : 'disconnected'}`} />
                {connected ? 'CONNECTED' : 'CONNECTING...'}
              </div>
              {user.totalScore > 0 && <div className="lobby-me-score">⭐ {user.totalScore} PTS</div>}
            </div>
          </div>

          {/* CTF Status */}
          <div className={`lobby-status-banner glass ${ctfStarted ? 'started' : 'waiting'}`}>
            <RadarPing />
            <div className="lsb-content">
              <div className="lsb-label">{ctfStarted ? '⚡ CTF IN PROGRESS' : '📡 AWAITING SIGNAL'}</div>
              <div className="lsb-sub">{ctfStarted ? 'All bots — deploy to arena!' : 'Stand by. Admin will fire the launch signal.'}</div>
            </div>
          </div>

          {/* Count */}
          <div className="lobby-count-chip glass">
            <div className="lobby-count-left">
              <span className="lobby-count-num">{participants.length}</span>
              <span className="lobby-count-label">BOTS ONLINE</span>
            </div>
            <div className="lobby-count-right">
              <span className="lobby-count-pulse" />
              <span className="lobby-count-pulse-ring" />
            </div>
          </div>

          {/* Terminal feed */}
          <div className="lobby-feed glass">
            <div className="lobby-feed__header">
              <span className="feed-header-dot" />
              <span className="feed-header-dot" style={{ background: '#ffd166' }} />
              <span className="feed-header-dot" style={{ background: '#2affa0' }} />
              <span style={{ marginLeft: 8 }}>🖥 SYSTEM TERMINAL</span>
            </div>
            <div className="lobby-feed__scroll" ref={feedRef}>
              {feed.length === 0 && (
                <div className="lobby-feed__empty">
                  <span className="feed-cursor">█</span> Waiting for transmissions...
                </div>
              )}
              {feed.map(item => (
                <div key={item.id} className={`lobby-feed__item feed--${item.type}`}>
                  <span className="feed-prompt">{'>'}</span>
                  <span className="feed-ts">[{item.ts}]</span>
                  <span className="feed-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA when started */}
          {ctfStarted && (
            <button
              className="btn-primary"
              style={{ padding: '0.8rem 1.4rem', borderRadius: '10px', fontSize: '0.9rem', letterSpacing: '0.06em', width: '100%' }}
              onClick={() => navigate('/challenges')}
            >
              ⚔️ ENTER ARENA →
            </button>
          )}
        </aside>

        {/* ══ MAIN ══════════════════════════════════════════ */}
        <main className="lobby-main">
          <div className="lobby-header-top">
            <div>
              <div className="lobby-eyebrow">🤖 BOT DEPLOYMENT ZONE</div>
              <h1 className="lobby-title"><span className="lobby-title-grad">CTF Playground</span></h1>
              <p className="lobby-subtitle">Agents are roaming the field. Hover a bot for their intel.</p>
            </div>
            <div className="lobby-header-actions">
              <button className="lobby-btn-secondary" onClick={() => { localStorage.removeItem('ctf_user'); navigate('/'); }}>
                🚪 Disconnect
              </button>
              <a href="/leaderboard" className="lobby-btn-ghost">🏆 Rankings</a>
            </div>
          </div>

          {/* ── PLAYGROUND SCENE ─────────────────────────── */}
          <div className="lobby-playground-wrap glass">
            <div className="lobby-playground-header">
              <div className="lobby-pg-title">
                🌐 LIVE PLAYGROUND
                <span className="lobby-pg-badge">{participants.length} ACTIVE</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#1e293b', fontFamily: 'monospace' }}>
                HOVER BOT → VIEW STATS
              </div>
            </div>

            <div className="lobby-scene">
              {/* Props */}
              <PlaygroundProps />

              {/* Ground */}
              <div className="lobby-ground" />

              {/* Bots */}
              {participants.length === 0 ? (
                <div className="lobby-scene-empty">
                  <ChibiCharacter username="GHOST" size={60} glowColor="#7c3aed" animate />
                  <span>NO AGENTS DETECTED — BE THE FIRST</span>
                </div>
              ) : (
                participants.map((p) => {
                  const pos = wanderPositions[p.userId] ?? { x: 50, y: 110 };
                  return (
                    <SceneBot
                      key={p.userId}
                      participant={p}
                      isMe={p.userId === user._id}
                      pos={pos}
                    />
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


