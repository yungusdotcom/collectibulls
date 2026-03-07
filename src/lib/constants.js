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

export const defaultVaultCards = [];

export const defaultTradeTx = [];

export const trendData = [];

export const achievementData = [
  { id:1,title:"FIRST PULL",desc:"Added your first card",icon:"star",unlocked:false },
  { id:2,title:"CENTURY CLUB",desc:"100 cards in the vault",icon:"shield",unlocked:false },
  { id:3,title:"BIG SPENDER",desc:"Single card over $5,000",icon:"diamond",unlocked:false },
  { id:4,title:"DIVERSIFIED",desc:"Cards in 4+ categories",icon:"grid",unlocked:false },
  { id:5,title:"PROFIT KING",desc:"Realized $1,000+ profit",icon:"trophy",unlocked:false },
  { id:6,title:"GRAIL HUNTER",desc:"Own a card worth $10K+",icon:"flame",unlocked:false },
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
