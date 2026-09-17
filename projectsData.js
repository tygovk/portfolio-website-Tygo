/**
 * projectsData.js - Centrale Datastructuur voor Portfolio Projecten & Beheer
 * 
 * Beheer hier je projecten. Elk project bevat:
 * - id: unieke url-vriendelijke identifier (bijv. "dagboek-app")
 * - titel: naam van het project
 * - korteOmschrijving: beknopte tekst voor de homepage kaart
 * - langeOmschrijving: uitgebreide beschrijving (probleem, rol, unieke functies)
 * - afbeeldingUrl: URL of relatief pad naar de projectafbeelding
 * - tags: array van technologieën en trefwoorden
 * - liveDemoUrl: link naar werkende demo
 * - githubUrl: link naar GitHub repository
 * - probleem: specifieke probleemstelling
 * - mijnRol: jouw rol en focusgebied
 * - uniekeFuncties: array van opvallende features
 */

export const defaultProjects = [
  {
    id: "dagboek-app",
    titel: "Slimme Dagboek & Reflectie App",
    korteOmschrijving: "Een intuïtieve dagboek-applicatie die met behulp van taalmodellen en sentimentanalyse persoonlijke reflecties categoriseert en wekelijkse emotionele trends visualiseert.",
    langeOmschrijving: "Tijdens mijn studie AI merkte ik hoe waardevol journaling is voor mentale helderheid, maar ook hoe lastig het is om patronen in je eigen notities te herkennen. In deze dagboek-applicatie schrijven gebruikers vrijuit, waarna een lokaal draaiend AI-model helpt bij het samenvatten van de dag, het extraheren van kernthema's en het signaleren van stemmingsverschuivingen. Mijn rol omvatte het ontwerpen van de privacy-first architectuur, het bouwen van de frontend in React/Tailwind en het integreren van de empathische prompt pipelines.",
    probleem: "Traditionele dagboeken zijn statisch en geven weinig dieper inzicht in lange-termijn patronen in stress, energie en emotionele gesteldheid.",
    mijnRol: "Full-stack AI developer: van concept en UI/UX ontwerp tot lokale gegevensopslag en taalmodel-integratie.",
    uniekeFuncties: [
      "Automatische sentiment- en thema-extractie met lokale privacy-waarborging",
      "Wekelijkse AI-synthese met stimulerende reflectievragen op maat",
      "Interactieve stemmingsgrafiek en energietracker over tijd",
      "Offline-first werking met veilige encryptie in de browser"
    ],
    afbeeldingUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    afbeeldingen: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507842229451-7f01be45c06b?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["AI", "React", "Python", "Sentiment Analysis", "Tailwind CSS"],
    liveDemoUrl: "https://example.com/demo/dagboek-app",
    githubUrl: "https://github.com/tygovk/slimme-dagboek-app"
  },
  {
    id: "ai-studieassistent",
    titel: "Interactieve AI Studiepartner",
    korteOmschrijving: "Een adaptieve studietool die complexe wetenschappelijke papers en collegedictaten omzet in interactieve flashcards, samenvattingen en oefentoetsen met directe feedback.",
    langeOmschrijving: "Studenten verwerken enorme hoeveelheden collegeslides en vakliteratuur, wat vaak leidt tot inefficiënt en passief leren. Dit platform past 'active recall' en 'spaced repetition' toe door studiemateriaal automatisch om te vormen tot gepersonaliseerde leertrajecten. Als AI-student ontwikkelde ik de RAG (Retrieval-Augmented Generation) pipeline die documenten accuraat doorzoekbaar maakt en hallucinaties minimaliseert door altijd de bronalinea's te citeren.",
    probleem: "Studenten besteden veel tijd aan het handmatig maken van uittreksels in plaats van hun begrip te testen met gerichte vragen.",
    mijnRol: "Machine Learning & Full-stack Engineer: vector embeddings, chunks-indexering en een responsieve studenten-dashboard interface.",
    uniekeFuncties: [
      "RAG-gestuurde documentanalyse met directe bronverwijzingen per alinea",
      "Automatische quiz- en flashcard-generatie met variabele moeilijkheidsgraad",
      "Spaced repetition algoritme afgestemd op individuele vergeetcurves",
      "Ondersteuning voor PDF's, Markdown-aantekeningen en college-opnames"
    ],
    afbeeldingUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    afbeeldingen: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Python", "FastAPI", "Gemini API", "TypeScript", "Vector Search"],
    liveDemoUrl: "https://example.com/demo/studieassistent",
    githubUrl: "https://github.com/tygovk/ai-studieassistent"
  },
  {
    id: "ecotrack-ai",
    titel: "EcoTrack: Slim Energie Voorspelmodel",
    korteOmschrijving: "Machine learning model dat energieconsumptie en zonnestroomopwekking 48 uur vooruit voorspelt om batterij-opslag en dynamische energiecontracten te optimaliseren.",
    langeOmschrijving: "Met de opkomst van volatiele energieprijzen en netcongestie is inzicht in toekomstig energieverbruik cruciaal voor zowel particulieren als bedrijven. Voor dit project trainde ik tijdreeksmodellen op historische KNMI weerdata, zonnestraling en huishoudelijk stroomverbruik. De applicatie adviseert gebruikers wanneer het financieel en ecologisch het gunstigst is om zware apparaten aan te zetten of energie terug te leveren aan het net.",
    probleem: "Onvoorspelbaarheid van hernieuwbare energiebronnen leidt tot netonbalans en onnodig hoge energiekosten voor huishoudens.",
    mijnRol: "Data scientist & backend ontwikkelaar: data cleaning, feature engineering op meteorologische data en modelselectie (LSTM & XGBoost).",
    uniekeFuncties: [
      "48-uurs rolling forecast voor zonne-opwekking en vraag met 93% accuratesse",
      "Geoptimaliseerd laadadvies voor thuisbatterijen op basis van dynamische uurprijzen",
      "Interactieve visualisaties van realtime meetwaarden en betrouwbaarheidsintervallen",
      "Eenvoudige webhook-koppeling voor Home Assistant en domoticasystemen"
    ],
    afbeeldingUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
    afbeeldingen: [
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Python", "PyTorch", "Data Science", "D3.js", "Time Series"],
    liveDemoUrl: "https://example.com/demo/ecotrack",
    githubUrl: "https://github.com/tygovk/ecotrack-ai"
  },
  {
    id: "voetbaltoernooi-manager",
    titel: "Voetbaltoernooi Manager",
    korteOmschrijving: "Een interactieve webapplicatie voor het eenvoudig organiseren en bijhouden van een voetbaltoernooi. Wedstrijden, uitslagen en standen worden automatisch overzichtelijk bijgehouden.",
    langeOmschrijving: "Voor dit project heb ik een interactieve voetbaltoernooi-applicatie ontwikkeld waarmee een compleet toernooi eenvoudig digitaal kan worden georganiseerd en gevolgd. De applicatie toont live standen, wedstrijden, uitslagen, doelpunten en de knock-outfase, zodat deelnemers en toeschouwers altijd de actuele situatie kunnen bekijken.",
    probleem: "Het handmatig bijhouden van wedstrijden, uitslagen en standen kost tijd en maakt het gemakkelijk om fouten te maken.",
    mijnRol: "Full-stack ontwikkelaar: van de gebruikersinterface en toernooilogica tot realtime synchronisatie van wedstrijden, uitslagen en standen.",
    uniekeFuncties: [
      "Automatische groepsstanden op basis van punten en doelsaldo",
      "Live wedstrijdprogramma met uitslagen en doelpunten",
      "Automatische koppeling van halve finales, finale en troostfinale",
      "Toeschouwersmodus en beheerdersmodus voor wedstrijdbeheer"
    ],
    afbeeldingUrl: "https://voetbaltoernooi-eight.vercel.app/",
    afbeeldingen: [
      "https://images.unsplash.com/photo-1579952363873-27f3bde9be8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["TypeScript", "React", "Vite", "Firebase", "Realtime Data"],
    liveDemoUrl: "https://voetbaltoernooi-eight.vercel.app/",
    githubUrl: "https://github.com/tygovk/voetbaltoernooi"
  }
];

// Helper functies voor veilige opslag & beheer (inclusief in-memory fallback)
const STORAGE_KEY = 'custom_projectsData';
const ADMIN_SESSION_KEY = 'tygo_admin_session';
const ADMIN_PASS_HASH_KEY = 'tygo_admin_hash';
const ADMIN_PASS_PLAIN_KEY = 'tygo_admin_plain';

export const DEFAULT_PASS = 'tygo2026';
// Correct SHA-256 hash for 'tygo2026':
// node: crypto.createHash("sha256").update("tygo2026").digest("hex")
export const DEFAULT_HASH = '12bf52fa8b99f659d16a749a4f8639670fabb9d8ffbae268fc1624cd90810c68';
const OLD_FAULTY_HASH = 'e4d55dae4bb1d55169a92447936a7eb2dbcf264d1f22e8ad23263009a7b93198';

const memStorage = new Map();

function safeGetItem(key, preferSession = false) {
  try {
    if (preferSession && typeof sessionStorage !== 'undefined') {
      const val = sessionStorage.getItem(key);
      if (val !== null) return val;
    }
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    // blocked or security sandbox error
  }
  return memStorage.has(key) ? memStorage.get(key) : null;
}

function safeSetItem(key, value, useSession = false) {
  try {
    if (useSession && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, String(value));
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, String(value));
    }
  } catch (e) {
    // blocked
  }
  memStorage.set(key, String(value));
}

function safeRemoveItem(key) {
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key);
  } catch (e) {}
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch (e) {}
  memStorage.delete(key);
}

// Automatische opruiming van eventuele oude incorrecte hash
try {
  const cur = safeGetItem(ADMIN_PASS_HASH_KEY);
  if (cur === OLD_FAULTY_HASH) {
    safeRemoveItem(ADMIN_PASS_HASH_KEY);
  }
} catch (e) {
  // ignore
}

export async function hashText(str) {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    try {
      const enc = new TextEncoder();
      const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
      const arr = Array.from(new Uint8Array(buf));
      return arr.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      console.warn('Web Crypto subtle API faalde, gebruik fallback:', err);
    }
  }
  // Fallback voor browsers/iframes zonder Web Crypto API
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'fallback_' + Math.abs(hash).toString(16);
}

export function normalizeProject(project) {
  if (!project) return project;
  let images = Array.isArray(project.afbeeldingen) ? [...project.afbeeldingen] : [];
  if (images.length === 0 && project.afbeeldingUrl) {
    images = [project.afbeeldingUrl];
  }
  // Maximaal 10 foto's per project
  images = images.filter(Boolean).slice(0, 10);
  const primaryImage = images[0] || project.afbeeldingUrl || '';
  return {
    ...project,
    afbeeldingen: images,
    afbeeldingUrl: primaryImage
  };
}

export function getProjectsData() {
  try {
    const saved = safeGetItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProject);
      }
    }
  } catch (err) {
    console.warn('Kon projecten niet uit opslag laden:', err);
  }
  return defaultProjects.map(normalizeProject);
}

export function saveProjectsData(projects) {
  try {
    const normalized = (projects || []).map(normalizeProject);
    safeSetItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.error('Fout bij opslaan van projecten:', err);
  }
}

export function addProject(newProject) {
  const current = getProjectsData();
  const normalizedNew = normalizeProject(newProject);
  const updated = [normalizedNew, ...current.filter(p => p.id !== normalizedNew.id)];
  saveProjectsData(updated);
  return updated;
}

export function updateProject(projectId, updatedData) {
  const current = getProjectsData();
  const updated = current.map(p => {
    if (p.id === projectId) {
      return normalizeProject({ ...p, ...updatedData, id: projectId });
    }
    return p;
  });
  saveProjectsData(updated);
  return updated;
}

export function deleteProject(projectId) {
  const current = getProjectsData();
  const updated = current.filter(p => p.id !== projectId);
  saveProjectsData(updated);
  return updated;
}

export function resetProjectsData() {
  safeRemoveItem(STORAGE_KEY);
  return defaultProjects;
}

// ==========================================================================
// Beheerders Authenticatie & Beveiliging (Alleen voor Tygo)
// ==========================================================================

export function isAdminLoggedIn() {
  return safeGetItem(ADMIN_SESSION_KEY, true) === 'true';
}

export async function verifyAdminPassword(inputPassword) {
  if (!inputPassword) return false;
  const trimmed = String(inputPassword).trim();

  // Verwijder eventuele oude foute hash
  const cur = safeGetItem(ADMIN_PASS_HASH_KEY);
  if (cur === OLD_FAULTY_HASH) {
    safeRemoveItem(ADMIN_PASS_HASH_KEY);
  }

  const storedHash = safeGetItem(ADMIN_PASS_HASH_KEY);
  const storedPlain = safeGetItem(ADMIN_PASS_PLAIN_KEY);

  // 1. Directe controle indien nog het standaard wachtwoord van kracht is
  if (!storedHash && !storedPlain) {
    if (trimmed === DEFAULT_PASS || trimmed.toLowerCase() === DEFAULT_PASS.toLowerCase()) {
      return true;
    }
  }

  // 2. Directe controle op opgeslagen plaintext backup
  if (storedPlain && (trimmed === storedPlain || trimmed.toLowerCase() === storedPlain.toLowerCase())) {
    return true;
  }

  // 3. Standaardwachtwoord 'tygo2026' altijd laten werken als de storedHash de DEFAULT_HASH is
  if (trimmed === DEFAULT_PASS || trimmed.toLowerCase() === DEFAULT_PASS.toLowerCase()) {
    if (!storedHash || storedHash === DEFAULT_HASH) {
      return true;
    }
  }

  // 4. Cryptografische SHA-256 hash vergelijking
  try {
    const inputHash = await hashText(trimmed);
    const targetHash = storedHash || DEFAULT_HASH;
    if (inputHash === targetHash) {
      return true;
    }
  } catch (err) {
    console.warn('Hash verificatie fout:', err);
  }

  return false;
}

export function setAdminSession(remember = true) {
  safeSetItem(ADMIN_SESSION_KEY, 'true', !remember);
}

export function logoutAdmin() {
  safeRemoveItem(ADMIN_SESSION_KEY);
}

export async function changeAdminPassword(newPassword) {
  if (!newPassword || newPassword.trim().length < 4) {
    throw new Error('Het nieuwe wachtwoord moet minimaal 4 tekens bevatten.');
  }
  const trimmed = newPassword.trim();
  try {
    const newHash = await hashText(trimmed);
    safeSetItem(ADMIN_PASS_HASH_KEY, newHash);
  } catch (err) {
    console.warn('Kon wachtwoord hash niet genereren:', err);
  }
  safeSetItem(ADMIN_PASS_PLAIN_KEY, trimmed);
  return true;
}
