import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Wallet, 
  Award, 
  Box, 
  Zap, 
  Share2, 
  Upload, 
  User, 
  CheckCircle2, 
  ExternalLink,
  Twitter,
  Disc,
  Trophy,
  Activity,
  Sparkles
} from 'lucide-react';

/* =============================================================================
  MOCK DATA & ASSETS (Simulating the API Responses provided by Mark Socrates)
  =============================================================================
*/

const MOCK_WALLET_DATA = {
  "0xb9a0236cc15c4d84aec7cf789e5c15056166ed79": {
    discordName: "MarkSocrates",
    discordId: "819230491823",
    avatar: "https://i.pravatar.cc/300?img=32", // Placeholder for specific user
    stats: {
      address: "0xb9a0236cc15c4d84aec7cf789e5c15056166ed79",
      total_xp: 108614.29,
      rank: 61,
      season_tier: "Diamond",
      badges: ["VEGGIA_BADGE", "AMBASSADOR_BADGE", "PAPA_BADGE", "FIRST_REFERRAL", "OG_USER", "DISCORD", "X", "EARLY_BADGE", "SMART_WALLET"],
      mystery_box_wins: [
        { type: "BOOSTER", value: "1.1x", time: "2h ago" },
        { type: "USDC", value: "0.20", time: "5h ago" },
        { type: "XP", value: "50", time: "1d ago" }
      ]
    }
  }
};

const RECENT_WINS_TICKER = [
  { user: "0xfd...bd12", prize: "1.25x BOOSTER", type: "BOOSTER" },
  { user: "0xbf...fe0d", prize: "5 TICKETS", type: "TICKET" },
  { user: "0x12...e38d", prize: "200,000 USDC (Micro)", type: "USDC" },
  { user: "0xe9...7080", prize: "50 XP", type: "XP" },
  { user: "0x77...be84", prize: "500 CENT", type: "CENT" },
  { user: "0xab...6517", prize: "200,000 USDC (Micro)", type: "USDC" },
  { user: "0x8d...8979", prize: "75 XP", type: "XP" },
];

/* =============================================================================
  UTILITIES
  =============================================================================
*/
const formatAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

/* =============================================================================
  COMPONENTS
  =============================================================================
*/

// The floating glass panes effect seen in the reference image
const GlassPane = ({ className, style }) => (
  <div 
    className={`absolute backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-lg pointer-events-none z-10 ${className}`}
    style={style}
  />
);

const BadgeIcon = ({ id }) => {
  const getIcon = () => {
    if (id.includes("VEGGIA")) return <span className="text-green-500">🥬</span>;
    if (id.includes("AMBASSADOR")) return <span className="text-purple-500">🤝</span>;
    if (id.includes("PAPA")) return <span className="text-blue-500">👨</span>;
    if (id.includes("OG")) return <span className="text-orange-500">👑</span>;
    if (id.includes("DISCORD")) return <span className="text-indigo-400">👾</span>;
    if (id.includes("X")) return <span className="text-black dark:text-white">𝕏</span>;
    if (id.includes("EARLY")) return <span className="text-yellow-500">🌅</span>;
    return <span className="text-gray-400">🏅</span>;
  };
  return (
    <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-lg border border-white/30 shadow-sm" title={id}>
      {getIcon()}
    </div>
  );
};

const HoloCard = ({ data, profileImage, setProfileImage, customName, setCustomName, isEditing, setIsEditing }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const rX = (0.5 - y) * 20; // Max tilt 20deg
    const rY = (x - 0.5) * 20;

    setRotation({ x: rX, y: rY });
    setGlarePosition({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative perspective-1000 w-full max-w-lg mx-auto my-12 group">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[1.58/1] rounded-3xl transition-transform duration-100 ease-out transform-style-3d shadow-2xl"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.85) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.5)'
        }}
      >
        {/* Holographic Sheen Layer */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 mix-blend-overlay z-20"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
          }}
        />
        
        {/* Iridescent Foil Effect */}
        <div className="absolute inset-0 rounded-3xl opacity-20 bg-gradient-to-tr from-transparent via-orange-300/20 to-transparent pointer-events-none z-10" />

        {/* Floating Glass Panes (Decorative) */}
        <GlassPane 
          className="w-32 h-20 right-[-20px] top-10 rotate-12 opacity-60 z-30 animate-pulse-slow" 
          style={{ transform: 'translateZ(40px)' }}
        />
        <GlassPane 
          className="w-24 h-24 right-[20%] bottom-[-10px] -rotate-6 opacity-40 z-20" 
          style={{ transform: 'translateZ(20px)' }}
        />

        {/* Content Container */}
        <div className="relative z-40 h-full p-8 flex flex-col justify-between" style={{ transform: 'translateZ(30px)' }}>
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="relative group/avatar">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-orange-400/30 shadow-lg bg-gray-100 relative">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={32} />
                    </div>
                  )}
                  {/* Edit Overlay */}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer text-white">
                    <Upload size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={customName} 
                      onChange={(e) => setCustomName(e.target.value)}
                      className="bg-white/50 border border-gray-300 rounded px-2 py-1 text-2xl font-bold text-gray-800 w-40 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{customName || "Anonymous"}</h2>
                  )}
                  <button onClick={() => setIsEditing(!isEditing)} className="text-gray-400 hover:text-orange-500 transition-colors">
                    <Sparkles size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm mt-1">
                  <span>{data.season_tier || "NO TIER"}</span>
                  <span className="text-gray-400">///</span>
                  <span>Lvl {Math.floor((data.total_xp || 0) / 1000)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
               <div className="bg-white/80 backdrop-blur-sm border border-orange-200 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                 Initiated
               </div>
               <div className="mt-2 text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-widest">Total XP</div>
                  <div className="text-xl font-black text-gray-800">{formatNumber(data.total_xp || 0)}</div>
               </div>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex gap-2 mt-4 flex-wrap">
             {(data.badges || []).slice(0, 7).map((badge, i) => (
                <BadgeIcon key={i} id={badge} />
             ))}
             {(data.badges?.length > 7) && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  +{data.badges.length - 7}
                </div>
             )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-4">
            <div className="font-mono text-xl text-gray-800 tracking-widest flex items-center gap-2">
              <span className="text-orange-500">****</span>
              {data.address.slice(-4)}
            </div>
            
            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
              <Zap className="fill-gray-800 w-5 h-5" />
              Incentiv
            </div>
          </div>
        </div>
      </div>
      
      {/* Reflection Shadow under card */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-orange-500/30 blur-2xl rounded-[100%] transition-transform duration-200"
        style={{
          transform: `translateX(-50%) scale(${1 + (Math.abs(rotation.x) / 40)})`
        }}
      ></div>
    </div>
  );
};

const TickerItem = ({ item }) => (
  <div className="flex items-center gap-3 px-6 py-2 border-r border-white/10 min-w-max">
    <div className={`w-2 h-2 rounded-full ${item.type === 'BOOSTER' ? 'bg-purple-500' : item.type === 'USDC' ? 'bg-green-500' : 'bg-orange-500'}`} />
    <span className="text-xs text-gray-400 font-mono">{item.user}</span>
    <span className="text-sm font-bold text-white ml-1">Won {item.prize}</span>
  </div>
);

const App = () => {
  const [walletInput, setWalletInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  
  // Profile Editable State
  const [profileImage, setProfileImage] = useState(null);
  const [customName, setCustomName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize with a search
const handleSearch = async (e) => {
  e.preventDefault();
  if (!walletInput) return;
  
  setIsLoading(true);
  
  try {
    // 1. Fetch Main Stats
    const xpRes = await fetch(`/api/proxy?endpoint=xp&address=${walletInput}`);
    const xpData = await xpRes.json();

    if (!xpData || xpData.error) throw new Error("User not found");

    // 2. Fetch Badges (Optional parallel fetch)
    const badgeRes = await fetch(`/api/proxy?endpoint=badges&address=${walletInput}`);
    const badgeData = await badgeRes.json();

    // 3. Map Data to State
    setActiveProfile({
      address: xpData.address,
      total_xp: xpData.total_xp,
      rank: xpData.rank,
      season_tier: xpData.season_tier,
      badges: xpData.badge_ids || [], 
      // ... map other fields
    });
    
    // Auto-detect if it's the specific wallet to show MarkSocrates details
    if(walletInput.toLowerCase() === "0xb9a0236cc15c4d84aec7cf789e5c15056166ed79") {
        setCustomName("MarkSocrates");
        // set avatar, etc.
    } else {
        setCustomName("Anon User");
        setIsEditing(true);
    }

  } catch (err) {
    console.error(err);
    // Handle error state
  } finally {
    setIsLoading(false);
  }
};

  const copyToClipboard = () => {
    if(!activeProfile) return;
    navigator.clipboard.writeText(`Check out my Incentiv Card! Address: ${activeProfile.address}`);
    // Ideally show toast here
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden flex flex-col">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-8 py-6 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg rotate-3 flex items-center justify-center font-bold text-black">
            <Zap size={20} fill="black" />
          </div>
          <span className="text-xl font-bold tracking-tight">Incentiv<span className="text-orange-500">.io</span></span>
        </div>
        <div className="flex gap-4">
           <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Leaderboard</button>
           <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Mystery Box</button>
           <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-orange-500 hover:text-white transition-colors">Connect Wallet</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 py-12">
        
        {/* Hero Text */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            HOLOGRAPHIC <br/> PROFILE
          </h1>
          <p className="text-gray-400 text-lg">
            Enter any Incentiv wallet address. We'll scour the blockchain and Discord to generate your unique identity card.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-black border border-white/10 rounded-2xl p-2 shadow-2xl">
            <Wallet className="text-gray-500 ml-4" />
            <input 
              type="text" 
              placeholder="0x..." 
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              className="flex-grow bg-transparent border-none focus:ring-0 text-white px-4 py-3 placeholder-gray-600 font-mono"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-white text-black rounded-xl px-6 py-3 font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Generate <Sparkles size={16} />
                </>
              )}
            </button>
          </div>
          
          {/* Quick Paste Hint */}
          <div className="mt-4 flex justify-center gap-2">
            <button 
              type="button"
              onClick={() => setWalletInput("0xb9a0236cc15c4d84aec7cf789e5c15056166ed79")}
              className="text-xs text-gray-500 hover:text-orange-400 transition-colors border border-white/10 rounded-full px-3 py-1"
            >
              Try Demo Wallet: 0xb9a0...ed79
            </button>
          </div>
        </form>

        {/* The Card Display Area */}
        {activeProfile && !isLoading && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <HoloCard 
              data={activeProfile} 
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              customName={customName}
              setCustomName={setCustomName}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={copyToClipboard} className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl transition-all font-semibold">
                <Share2 size={18} /> Share Card
              </button>
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-orange-900/20">
                <Twitter size={18} /> Post to X
              </button>
            </div>

            {/* Stats Breakdown (Below Card) */}
            <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Trophy size={16} /> Global Rank
                  </div>
                  <div className="text-3xl font-bold">#{activeProfile.rank || "---"}</div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Activity size={16} /> Operations XP
                  </div>
                  <div className="text-3xl font-bold">{formatNumber(activeProfile.total_xp * 0.6)}</div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Box size={16} /> Mystery Boxes
                  </div>
                  <div className="text-3xl font-bold">{activeProfile.mystery_box_wins?.length || 0} Wins</div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Ticker */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md relative z-50">
        <div className="flex items-center">
          <div className="px-6 py-3 bg-orange-600 text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live Wins
          </div>
          <div className="overflow-hidden whitespace-nowrap mask-gradient w-full">
            <div className="inline-flex animate-marquee">
              {/* Duplicated list for infinite scroll effect */}
              {[...RECENT_WINS_TICKER, ...RECENT_WINS_TICKER, ...RECENT_WINS_TICKER].map((win, i) => (
                <TickerItem key={i} item={win} />
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: scroll 30s linear infinite;
        }
        .animate-pulse-slow {
           animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default App;