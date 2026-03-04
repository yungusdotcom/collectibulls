export const c = {
  darkest: "#06060C",
  dark: "#0C0D16",
  surface: "#131520",
  surfaceAlt: "#181B28",
  border: "#252840",
  borderLight: "#323660",
  gold: "#D4A843",
  goldLight: "#F0D078",
  goldDim: "#9A7B2F",
  goldFaint: "rgba(212,168,67,0.06)",
  cyan: "#00F0FF",
  magenta: "#FF2E97",
  green: "#39FF14",
  red: "#FF3B5C",
  text1: "#F0ECE2",
  text2: "#8B8DA3",
  text3: "#4A4D65",
};

export const catColors = {
  Pokemon: "#FFD43B",
  Sports: "#60A5FA",
  MTG: "#A78BFA",
  "Yu-Gi-Oh": "#FB923C",
};

export const defaultVaultCards = [
  { id:1,name:"Charizard 1st Edition",category:"Pokemon",grade:"PSA 9",condition:"Near Mint",value:4200,change:18.4,dateAdded:"2025-12-15",set:"Base Set",year:1999,rarity:"Holo Rare",notes:"Shadowless variant." },
  { id:2,name:"Black Lotus",category:"MTG",grade:"CGC 7",condition:"Good",value:8500,change:12.1,dateAdded:"2025-11-02",set:"Alpha",year:1993,rarity:"Rare",notes:"Light play, iconic power card." },
  { id:3,name:"LeBron James Prizm Silver",category:"Sports",grade:"BGS 9.5",condition:"Gem Mint",value:1850,change:-2.3,dateAdded:"2026-01-20",set:"2019-20 Prizm",year:2019,rarity:"Silver Prizm",notes:"Clean centering." },
  { id:4,name:"Dark Magician 1st Edition",category:"Yu-Gi-Oh",grade:"PSA 8",condition:"Near Mint",value:620,change:-5.2,dateAdded:"2025-10-08",set:"Legend of Blue Eyes",year:2002,rarity:"Ultra Rare",notes:"SDY variant." },
  { id:5,name:"Pikachu Illustrator",category:"Pokemon",grade:"PSA 7",condition:"Excellent",value:32000,change:4.8,dateAdded:"2025-08-14",set:"Promo",year:1998,rarity:"Promo",notes:"One of ~40 known copies." },
  { id:6,name:"Luka Doncic Prizm Gold",category:"Sports",grade:"PSA 10",condition:"Gem Mint",value:2100,change:9.7,dateAdded:"2026-02-01",set:"2018-19 Prizm",year:2018,rarity:"Gold Prizm /10",notes:"Numbered /10." },
  { id:7,name:"Jace, the Mind Sculptor",category:"MTG",grade:"CGC 9",condition:"Near Mint",value:380,change:-3.8,dateAdded:"2025-09-22",set:"Worldwake",year:2010,rarity:"Mythic Rare",notes:"Foil version." },
  { id:8,name:"Blue-Eyes White Dragon 1st",category:"Yu-Gi-Oh",grade:"PSA 9",condition:"Near Mint",value:1450,change:6.2,dateAdded:"2025-12-30",set:"Legend of Blue Eyes",year:2002,rarity:"Ultra Rare",notes:"LOB-001 original." },
  { id:9,name:"Michael Jordan Fleer RC",category:"Sports",grade:"PSA 8",condition:"Near Mint",value:3800,change:1.1,dateAdded:"2025-07-19",set:"1986-87 Fleer",year:1986,rarity:"Base",notes:"The basketball card." },
  { id:10,name:"Mox Sapphire",category:"MTG",grade:"CGC 6",condition:"Good",value:5200,change:7.3,dateAdded:"2025-06-11",set:"Beta",year:1993,rarity:"Rare",notes:"Power Nine member." },
  { id:11,name:"Umbreon Gold Star",category:"Pokemon",grade:"PSA 10",condition:"Gem Mint",value:6800,change:22.1,dateAdded:"2026-01-05",set:"POP Series 5",year:2007,rarity:"Gold Star",notes:"Perfect 10." },
  { id:12,name:"Shohei Ohtani Bowman Chrome",category:"Sports",grade:"BGS 9.5",condition:"Gem Mint",value:950,change:15.3,dateAdded:"2026-02-18",set:"2018 Bowman Chrome",year:2018,rarity:"Refractor",notes:"Auto refractor." },
];

export const defaultTradeTx = [
  { id:1,type:"buy",card:"Charizard 1st Edition",category:"Pokemon",price:3600,date:"2025-12-15",grade:"PSA 9" },
  { id:2,type:"sell",card:"Blastoise 1st Edition",category:"Pokemon",price:1200,date:"2026-01-08",grade:"PSA 8",costBasis:800 },
  { id:3,type:"buy",card:"Black Lotus",category:"MTG",price:8500,date:"2025-11-02",grade:"CGC 7" },
  { id:4,type:"sell",card:"Ancestral Recall",category:"MTG",price:3200,date:"2026-01-22",grade:"CGC 6",costBasis:2400 },
  { id:5,type:"buy",card:"LeBron Prizm Silver",category:"Sports",price:1600,date:"2026-01-20",grade:"BGS 9.5" },
  { id:6,type:"sell",card:"LeBron Prizm Silver",category:"Sports",price:1850,date:"2026-03-01",grade:"BGS 9.5",costBasis:1600 },
  { id:7,type:"buy",card:"Dark Magician 1st",category:"Yu-Gi-Oh",price:520,date:"2025-10-08",grade:"PSA 8" },
  { id:8,type:"sell",card:"Dark Magician 1st",category:"Yu-Gi-Oh",price:620,date:"2026-02-27",grade:"PSA 8",costBasis:520 },
  { id:9,type:"buy",card:"Pikachu Illustrator",category:"Pokemon",price:3200,date:"2026-02-25",grade:"PSA 7" },
  { id:10,type:"buy",card:"Luka Doncic Prizm Gold",category:"Sports",price:1800,date:"2026-02-01",grade:"PSA 10" },
  { id:11,type:"buy",card:"Umbreon Gold Star",category:"Pokemon",price:5400,date:"2026-01-05",grade:"PSA 10" },
  { id:12,type:"sell",card:"Mox Pearl",category:"MTG",price:2800,date:"2026-02-14",grade:"CGC 5",costBasis:2100 },
  { id:13,type:"buy",card:"Shohei Ohtani Bowman Chrome",category:"Sports",price:780,date:"2026-02-18",grade:"BGS 9.5" },
  { id:14,type:"buy",card:"Jace, the Mind Sculptor",category:"MTG",price:340,date:"2025-09-22",grade:"CGC 9" },
];

export const trendData = [
  { month: "Sep", value: 18200 },
  { month: "Oct", value: 19800 },
  { month: "Nov", value: 19100 },
  { month: "Dec", value: 21400 },
  { month: "Jan", value: 22800 },
  { month: "Feb", value: 24200 },
  { month: "Mar", value: 26450 },
];

export const achievementData = [
  { id:1,title:"FIRST PULL",desc:"Added your first card",icon:"star",unlocked:true,date:"Jul 2025" },
  { id:2,title:"CENTURY CLUB",desc:"100 cards in the vault",icon:"shield",unlocked:true,date:"Dec 2025" },
  { id:3,title:"BIG SPENDER",desc:"Single card over $5,000",icon:"diamond",unlocked:true,date:"Nov 2025" },
  { id:4,title:"DIVERSIFIED",desc:"Cards in 4+ categories",icon:"grid",unlocked:true,date:"Oct 2025" },
  { id:5,title:"PROFIT KING",desc:"Realized $1,000+ profit",icon:"trophy",unlocked:true,date:"Jan 2026" },
  { id:6,title:"GRAIL HUNTER",desc:"Own a card worth $10K+",icon:"flame",unlocked:true,date:"Feb 2026" },
  { id:7,title:"STREAK",desc:"Log trades 7 days in a row",icon:"bolt",unlocked:false },
  { id:8,title:"WHALE",desc:"Portfolio over $100,000",icon:"crown",unlocked:false },
];

export const categories = ["All", "Pokemon", "Sports", "MTG", "Yu-Gi-Oh"];
export const gradeOptions = ["All Grades","PSA 10","PSA 9","PSA 8","PSA 7","BGS 9.5","CGC 9","CGC 7","CGC 6"];
export const sortOptions = [
  { label: "Value: High", key: "valueDesc" },
  { label: "Value: Low", key: "valueAsc" },
  { label: "Recent", key: "dateDesc" },
  { label: "Name", key: "nameAsc" },
];

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const formatDateLong = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
