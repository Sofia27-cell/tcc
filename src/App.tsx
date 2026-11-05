import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Screen = "home" | "linhas" | "mapa" | "horarios" | "perfil" | "pesquisa";

const lines = [
  { id: "101", name: "1A — São Pedro — Jardim — Terminal", color: "#1565C0", stops: 18, time: "5 min", status: "Em operação" },
  { id: "204", name: "4 — Emílio Gardenal x Terra Nova x São Guilherme x Jardim da Serra x Altos do Tietê", color: "#00897B", stops: 12, time: "12 min", status: "Em operação" },
  { id: "315", name: "2 — Cohab — Terminal — Terras de Santa Maria", color: "#E53935", stops: 22, time: "Aguardando", status: "Atrasado" },
  { id: "408", name: "3A — Povo Feliz — Terminal", color: "#7B1FA2", stops: 15, time: "3 min", status: "Em operação" },
];

const schedules = [
  { line: "101", dest: "1A — São Pedro — Jardim — Terminal", times: ["05:30", "06:00", "06:30", "07:00", "07:30", "08:00"] },
  { line: "204", dest: "4 — Emílio Gardenal x Terra Nova x São Guilherme x Jardim da Serra x Altos do Tietê", times: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"] },
  { line: "315", dest: "2 — Cohab — Terminal — Terras de Santa Maria", times: ["06:15", "07:15", "08:15", "09:15", "10:15"] },
];

const favorites = [
  { id: "101", name: "1A — São Pedro — Jardim — Terminal", color: "#1565C0" },
  { id: "204", name: "4 — Emílio Gardenal x Terra Nova x São Guilherme x Jardim da Serra x Altos do Tietê", color: "#00897B" },
];


function PesquisaScreen() {
  const [query, setQuery] = useState("");
  const [recent] = useState(["Linha 101 - 1A — São Pedro — Jardim — Terminal", "Rodoviária ", "São Roque"]);

  const results = query.length > 0
    ? lines.filter(
        (l) => l.name.toLowerCase().includes(query.toLowerCase()) || l.id.includes(query)
      )
    : [];

  const stops = [
    { name: "1A — São Pedro — Jardim — Terminal", lines: ["101"] },
    { name: "4 — Emílio Gardenal x Terra Nova x São Guilherme x Jardim da Serra x Altos do Tietê", lines: ["204"] },
    { name: "2 — Cohab — Terminal — Terras de Santa Maria", lines: ["315"] },
    { name: "6 — Terminal x Sete Fogões", lines: ["606"] },
    { name: "3A — Povo Feliz — Terminal", lines: ["408"] },
    { name: "5 — Terminal x Jardim", lines: ["512"] },
  ].filter((s) => query.length > 0 && s.name.toLowerCase().includes(query.toLowerCase()));

  const hasResults = results.length > 0 || stops.length > 0;

  return (
    <div className="transition-screen flex flex-col h-full pb-24">
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #0D47A1 0%, #1565C0 100%)" }} className="px-6 pt-14 pb-6 rounded-b-[36px]">
        <h1 className="text-white text-xl font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Pesquisar</h1>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Linha, parada ou destino..."
            className="w-full bg-white/15 text-white placeholder-blue-200 rounded-2xl py-3 pl-10 pr-10 text-sm border border-white/20 focus:border-white/50 transition-all"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
          {query && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white"
              onClick={() => setQuery("")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-4">
        {/* No query: show recents */}
        {!query && (
          <>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                Buscas recentes
              </p>
              <div className="flex flex-col gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r.replace(/^Linha \d+ - /, ""))}
                    className="card px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-gray-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </span>
                    <span className="flex-1 text-sm text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>{r}</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                Sugestões populares
              </p>
              <div className="flex flex-wrap gap-2">
                {["Rodoviária", "São Pedro", "Linha 204", "Terminal", "Rua Tenente Gelás", "Linha 315"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* With query and results */}
        {query && hasResults && (
          <>
            {results.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Linhas · {results.length} resultado{results.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-col gap-2">
                  {results.map((line) => (
                    <div key={line.id} className="card px-4 py-3 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: line.color }}>
                        <span className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{line.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{line.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs" style={{ color: line.status === "Atrasado" ? "#E53935" : "#2E7D32" }}>● {line.status}</span>
                          <span className="text-xs text-gray-400">{line.stops} paradas</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold shrink-0" style={{ color: line.color, fontFamily: "Outfit, sans-serif" }}>{line.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stops.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Paradas · {stops.length} resultado{stops.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-col gap-2">
                  {stops.map((stop) => (
                    <div key={stop.name} className="card px-4 py-3 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "Outfit, sans-serif" }}>{stop.name}</p>
                        <div className="flex gap-1 mt-1">
                          {stop.lines.map((l) => {
                            const lineData = lines.find((ld) => ld.id === l);
                            return (
                              <span key={l} className="tag text-white text-[10px]" style={{ background: lineData?.color || "#1565C0" }}>
                                {l}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No results */}
        {query && !hasResults && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <p className="font-bold text-gray-700 mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Nenhum resultado</p>
            <p className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>Tente buscar por número da linha ou nome do destino</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="transition-screen flex flex-col h-full pb-24">
      {/* Header */}
      <div
        style={{ background: "linear-gradient(160deg, #0D47A1 0%, #1565C0 60%, #1E88E5 100%)" }}
        className="px-6 pt-14 pb-8 rounded-b-[36px]"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>
              {greeting}, Usuário 👋
            </p>
            <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
              BusLine
            </h1>
          </div>
          <button
            onClick={() => navigate("perfil")}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 bg-blue-400 flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>R</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar linha ou destino..."
            className="w-full bg-white/15 backdrop-blur text-white placeholder-blue-200 rounded-2xl py-3 pl-10 pr-4 text-sm border border-white/20 focus:border-white/50 transition-all"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Linhas e Rotas", icon: RouteIcon, screen: "linhas" as Screen, color: "#1565C0", bg: "#E3EFFE" },
            { label: "Mapa da Cidade", icon: MapIcon, screen: "mapa" as Screen, color: "#0D47A1", bg: "#DDEEFF" },
            { label: "Horários", icon: ClockIcon, screen: "horarios" as Screen, color: "#00695C", bg: "#E0F2F1" },
            { label: "Favoritos", icon: StarIcon, screen: "pesquisa" as Screen, color: "#F57C00", bg: "#FFF3E0" },
          ].map(({ label, icon: Icon, screen, color, bg }) => (
            <button
              key={label}
              onClick={() => navigate(screen)}
              className="card p-4 flex flex-col gap-3 text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon color={color} />
              </div>
              <span className="font-semibold text-sm text-gray-800" style={{ fontFamily: "Outfit, sans-serif" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      <div className="px-5 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: "Outfit, sans-serif" }}>Favoritos</h2>
          <button className="text-xs text-blue-600 font-medium">Ver todos</button>
        </div>
        <div className="flex flex-col gap-2">
          {favorites.map((fav) => (
            <div key={fav.id} className="card px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: fav.color }}>
                <span className="text-white text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{fav.id}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: "Outfit, sans-serif" }}>{fav.name}</p>
              </div>
              <StarFilledIcon color="#F57C00" />
            </div>
          ))}
        </div>
      </div>

      {/* Nearby stops */}
      <div className="px-5 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800" style={{ fontFamily: "Outfit, sans-serif" }}>Próximos ônibus</h2>
          <span className="text-xs text-gray-400">Agora · 14h32</span>
        </div>
        <div className="flex flex-col gap-2">
          {lines.slice(0, 3).map((line) => (
            <div key={line.id} className="card px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: line.color }}>
                <span className="text-white text-xs font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{line.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{line.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{line.stops} paradas</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold" style={{ color: line.time === "Aguardando" ? "#E53935" : "#1565C0", fontFamily: "Outfit, sans-serif" }}>
                  {line.time}
                </p>
                <p className="text-xs text-gray-400">chegada</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinhasScreen() {
  const [search, setSearch] = useState("");
  const filtered = lines.filter(
    (l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.id.includes(search)
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="transition-screen flex flex-col h-full pb-24">
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #0D47A1 0%, #1565C0 100%)" }} className="px-6 pt-14 pb-6 rounded-b-[36px]">
        <h1 className="text-white text-xl font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Linhas e Rotas</h1>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar linha..."
            className="w-full bg-white/15 text-white placeholder-blue-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm border border-white/20 focus:border-white/50 transition-all"
          />
        </div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-3">
        <p className="text-xs text-gray-400 font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>
          {filtered.length} linha{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
        </p>
        {filtered.map((line) => (
          <div key={line.id} className="card overflow-hidden">
            <button
              className="w-full px-4 py-4 flex items-center gap-3 text-left"
              onClick={() => setExpanded(expanded === line.id ? null : line.id)}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: line.color }}>
                <span className="text-white font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{line.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{line.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="tag text-white" style={{ background: line.status === "Atrasado" ? "#FFEBEE" : "#E8F5E9", color: line.status === "Atrasado" ? "#C62828" : "#2E7D32" }}>
                    {line.status}
                  </span>
                  <span className="text-xs text-gray-400">{line.stops} paradas</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm" style={{ color: line.color, fontFamily: "Outfit, sans-serif" }}>{line.time}</p>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"
                  className="ml-auto mt-1 transition-transform duration-200"
                  style={{ transform: expanded === line.id ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </button>
            {expanded === line.id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide" style={{ fontFamily: "Outfit, sans-serif" }}>Trajeto</p>
                <div className="flex flex-col gap-0">
                  {["Ponto Inicial", "Parada Intermediária A", "Parada Intermediária B", "Parada Final"].map((stop, i, arr) => (
                    <div key={stop} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full mt-0.5" style={{ background: i === 0 || i === arr.length - 1 ? line.color : "#CBD5E1" }} />
                        {i < arr.length - 1 && <div className="w-0.5 h-6 mt-0.5" style={{ background: "#E2E8F0" }} />}
                      </div>
                      <p className="text-sm text-gray-700 pb-2" style={{ fontFamily: "Inter, sans-serif" }}>{stop}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const ROUTE_LINES = [
  {
    id: "1a", name: "Linha 1A", desc: "S. Pedro x Jd. x Terminal", color: "#1565C0",
    coords: [[-23.102084,-47.712008],[-23.099943,-47.713036],[-23.099604,-47.715766],[-23.095543,-47.717437],[-23.092059,-47.717861],[-23.089518,-47.717786],[-23.088101,-47.718054],[-23.084060,-47.720822],[-23.082560,-47.722201],[-23.082416,-47.724175],[-23.082643,-47.725352],[-23.081693,-47.727750],[-23.082182,-47.728802],[-23.082202,-47.727128],[-23.079174,-47.727214],[-23.077797,-47.725768],[-23.075591,-47.726924],[-23.075870,-47.728161],[-23.076613,-47.728660],[-23.077748,-47.728005],[-23.079283,-47.729169],[-23.080566,-47.728456],[-23.080008,-47.726905],[-23.079258,-47.724288],[-23.088062,-47.718161],[-23.090894,-47.717721],[-23.092079,-47.717984],[-23.095296,-47.718011],[-23.099505,-47.715629],[-23.101920,-47.711936],[-23.105387,-47.713730],[-23.105727,-47.717861],[-23.111113,-47.718145],[-23.113121,-47.714532],[-23.116572,-47.713012],[-23.116858,-47.710989],[-23.114643,-47.711043],[-23.110372,-47.709914],[-23.105579,-47.710437],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "1b", name: "Linha 1B", desc: "S. Pedro x Jd. Bonanza x Terminal", color: "#29B6F6",
    coords: [[-23.102084,-47.712008],[-23.099943,-47.713036],[-23.099604,-47.715766],[-23.095543,-47.717437],[-23.092059,-47.717861],[-23.091099,-47.714685],[-23.084060,-47.720822],[-23.082560,-47.722201],[-23.082416,-47.724175],[-23.082643,-47.725352],[-23.081693,-47.727750],[-23.082182,-47.728802],[-23.082202,-47.727128],[-23.079174,-47.727214],[-23.077797,-47.725768],[-23.075591,-47.726924],[-23.075870,-47.728161],[-23.076613,-47.728660],[-23.077748,-47.728005],[-23.079283,-47.729169],[-23.080566,-47.728456],[-23.080008,-47.726905],[-23.079258,-47.724288],[-23.088062,-47.718161],[-23.090894,-47.717721],[-23.092079,-47.717984],[-23.095296,-47.718011],[-23.099505,-47.715629],[-23.101920,-47.711936],[-23.105387,-47.713730],[-23.105727,-47.717861],[-23.111113,-47.718145],[-23.113121,-47.714532],[-23.116572,-47.713012],[-23.116858,-47.710989],[-23.114643,-47.711043],[-23.110372,-47.709914],[-23.105579,-47.710437],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "2", name: "Linha 2", desc: "Cohab x Terminal x Terras de Santa Maria", color: "#E53935",
    coords: [[-23.102084,-47.712008],[-23.104864,-47.711059],[-23.105387,-47.713730],[-23.105727,-47.717861],[-23.111113,-47.718145],[-23.111201,-47.715670],[-23.113121,-47.714532],[-23.116582,-47.712947],[-23.127559,-47.697492],[-23.127739,-47.698243],[-23.126875,-47.699233],[-23.127492,-47.700217],[-23.128484,-47.701824],[-23.129228,-47.703006],[-23.128701,-47.703439],[-23.128538,-47.708184],[-23.125423,-47.711381],[-23.120578,-47.712024],[-23.116838,-47.711016],[-23.114655,-47.711037],[-23.112479,-47.710758],[-23.110370,-47.709908],[-23.109183,-47.709619],[-23.105582,-47.710434],[-23.101920,-47.711936],[-23.100428,-47.709814],[-23.093850,-47.702757],[-23.093458,-47.701829],[-23.092279,-47.700861],[-23.092434,-47.699112],[-23.091573,-47.698412],[-23.091363,-47.697744],[-23.093004,-47.695762],[-23.091595,-47.694180],[-23.090075,-47.695127],[-23.089236,-47.696138],[-23.088442,-47.695958],[-23.086503,-47.696406],[-23.086048,-47.697323],[-23.086986,-47.697642],[-23.087931,-47.697967],[-23.088740,-47.698426],[-23.089313,-47.699820],[-23.090621,-47.700512],[-23.091938,-47.701398],[-23.099848,-47.709203],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "3a", name: "Linha 3A", desc: "Povo Feliz x Terminal", color: "#43A047",
    coords: [[-23.101920,-47.711936],[-23.099943,-47.713036],[-23.099604,-47.715766],[-23.095511,-47.717402],[-23.096818,-47.721503],[-23.096261,-47.723950],[-23.097837,-47.725857],[-23.099636,-47.724693],[-23.103467,-47.725014],[-23.105848,-47.725017],[-23.107605,-47.724980],[-23.109230,-47.724942],[-23.110644,-47.724556],[-23.112213,-47.724945],[-23.111850,-47.726345],[-23.110471,-47.726468],[-23.109018,-47.726782],[-23.107572,-47.726991],[-23.105133,-47.726496],[-23.103726,-47.726648],[-23.102557,-47.726353],[-23.100763,-47.726122],[-23.097837,-47.725733],[-23.096441,-47.724121],[-23.097016,-47.721651],[-23.095854,-47.717909],[-23.099495,-47.715600],[-23.102084,-47.712008],[-23.104864,-47.711059],[-23.105387,-47.713730],[-23.105727,-47.717861],[-23.111113,-47.718145],[-23.111201,-47.715670],[-23.113121,-47.714532],[-23.116582,-47.712947],[-23.116838,-47.711016],[-23.114655,-47.711037],[-23.112479,-47.710758],[-23.110370,-47.709908],[-23.109183,-47.709619],[-23.105582,-47.710434],[-23.101920,-47.711936]] as [number,number][]
  },
  {
    id: "3b", name: "Linha 3B", desc: "Povo Feliz x Terminal x São Roque", color: "#8E24AA",
    coords: [[-23.102084,-47.712008],[-23.099943,-47.713036],[-23.099604,-47.715766],[-23.095511,-47.717402],[-23.096818,-47.721503],[-23.096261,-47.723950],[-23.097837,-47.725857],[-23.099636,-47.724693],[-23.103467,-47.725014],[-23.105848,-47.725017],[-23.107605,-47.724980],[-23.109230,-47.724942],[-23.110644,-47.724556],[-23.112213,-47.724945],[-23.111850,-47.726345],[-23.110471,-47.726468],[-23.109018,-47.726782],[-23.107572,-47.726991],[-23.105133,-47.726496],[-23.103726,-47.726648],[-23.102557,-47.726353],[-23.100763,-47.726122],[-23.097837,-47.725733],[-23.096441,-47.724121],[-23.097016,-47.721651],[-23.095854,-47.717909],[-23.099495,-47.715600],[-23.101920,-47.711936],[-23.105387,-47.713730],[-23.105727,-47.717861],[-23.111113,-47.718145],[-23.119682,-47.712078],[-23.123168,-47.715321],[-23.128940,-47.717957],[-23.129853,-47.718057],[-23.132559,-47.721318],[-23.131429,-47.722909],[-23.133876,-47.723110],[-23.135479,-47.723024],[-23.138404,-47.724695],[-23.135679,-47.722748],[-23.128836,-47.717652],[-23.121683,-47.713594],[-23.116838,-47.711016],[-23.114655,-47.711037],[-23.112479,-47.710758],[-23.110370,-47.709908],[-23.109183,-47.709619],[-23.105582,-47.710434],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "4", name: "Linha 4", desc: "Emílio Gardenal x Terra Nova x São Guilherme x Jd. Serra x Altos do Tietê", color: "#FB8C00",
    coords: [[-23.102084,-47.712008],[-23.105387,-47.713730],[-23.105727,-47.717807],[-23.111113,-47.718145],[-23.111201,-47.715670],[-23.111944,-47.713223],[-23.109196,-47.709600],[-23.107878,-47.708723],[-23.108278,-47.705343],[-23.109938,-47.702092],[-23.111384,-47.703734],[-23.113496,-47.701915],[-23.114569,-47.700609],[-23.116579,-47.700697],[-23.118313,-47.701521],[-23.117391,-47.702288],[-23.116128,-47.703420],[-23.114278,-47.704375],[-23.112087,-47.705834],[-23.105582,-47.710434],[-23.101888,-47.711920],[-23.099943,-47.713036],[-23.098790,-47.714320],[-23.096643,-47.714103],[-23.095656,-47.711861],[-23.088945,-47.704219],[-23.086855,-47.702996],[-23.086359,-47.703651],[-23.084657,-47.703747],[-23.083991,-47.705845],[-23.085274,-47.706687],[-23.086991,-47.705888],[-23.093855,-47.699761],[-23.095498,-47.700240],[-23.097492,-47.701969],[-23.099885,-47.699131],[-23.101336,-47.698785],[-23.102397,-47.699308],[-23.101851,-47.700123],[-23.100882,-47.700207],[-23.101346,-47.700829],[-23.102251,-47.702157],[-23.103591,-47.709589],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "4h", name: "Linha 4 (10h/14h)", desc: "Variante de horário - Emílio Gardenal / Altos do Tietê", color: "#F9A825", dashed: true,
    coords: [[-23.102084,-47.712008],[-23.105387,-47.713730],[-23.105727,-47.717807],[-23.111113,-47.718145],[-23.111201,-47.715670],[-23.111944,-47.713223],[-23.109196,-47.709600],[-23.107878,-47.708723],[-23.108278,-47.705343],[-23.109938,-47.702092],[-23.111384,-47.703734],[-23.112901,-47.703731],[-23.112087,-47.705834],[-23.105582,-47.710434],[-23.101888,-47.711920],[-23.099943,-47.713036],[-23.098790,-47.714320],[-23.096643,-47.714103],[-23.095656,-47.711861],[-23.088945,-47.704219],[-23.086855,-47.702996],[-23.086359,-47.703651],[-23.084657,-47.703747],[-23.083991,-47.705845],[-23.085274,-47.706687],[-23.086991,-47.705888],[-23.093855,-47.699761],[-23.095498,-47.700240],[-23.097492,-47.701969],[-23.099885,-47.699131],[-23.101336,-47.698785],[-23.102397,-47.699308],[-23.101851,-47.700123],[-23.100882,-47.700207],[-23.101346,-47.700829],[-23.102251,-47.702157],[-23.103591,-47.709589],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "6", name: "Linha 6", desc: "Terminal x Sete Fogões", color: "#6D4C41",
    coords: [[-23.102084,-47.712008],[-23.088508,-47.673181],[-23.095363,-47.659418],[-23.096843,-47.652002],[-23.096631,-47.649105],[-23.099401,-47.633269],[-23.102989,-47.624684],[-23.093830,-47.611603],[-23.093547,-47.606128],[-23.093453,-47.609135],[-23.116858,-47.710989],[-23.114643,-47.711043],[-23.112479,-47.710758],[-23.110372,-47.709914],[-23.109186,-47.709605],[-23.105579,-47.710437],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "7", name: "Linha 7", desc: "Terminal x Distrito Industrial", color: "#D81B60",
    coords: [[-23.102084,-47.712008],[-23.099604,-47.715766],[-23.096821,-47.721495],[-23.092042,-47.717802],[-23.089495,-47.717689],[-23.088091,-47.717990],[-23.045246,-47.715769],[-23.075554,-47.726838],[-23.075821,-47.728201],[-23.076640,-47.728705],[-23.077785,-47.728051],[-23.079265,-47.729228],[-23.080573,-47.728504],[-23.080055,-47.726876],[-23.079246,-47.724277],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "8", name: "Linha 8", desc: "Terminal x Cruz das Almas", color: "#00897B",
    coords: [[-23.102084,-47.712008],[-23.104864,-47.711059],[-23.106309,-47.710268],[-23.113533,-47.711078],[-23.126658,-47.685935],[-23.121510,-47.674506],[-23.158462,-47.659536],[-23.159506,-47.661157],[-23.160876,-47.663318],[-23.102084,-47.712008]] as [number,number][]
  },
  {
    id: "9", name: "Linha 9", desc: "Povo Feliz x São Pedro x Jd. Bonanza x São Roque", color: "#9E9E9E",
    coords: [] as [number,number][]
  },
  {
    id: "10", name: "Linha 10", desc: "Santa Maria x Altos do Tietê x Terminal x Emílio Gardenal x Cohab x São Guilherme x Jd. da Serra", color: "#3949AB",
    coords: [[-23.102084,-47.712008],[-23.099943,-47.713036],[-23.098790,-47.714320],[-23.096643,-47.714103],[-23.095656,-47.711861],[-23.088945,-47.704219],[-23.086855,-47.702996],[-23.086359,-47.703651],[-23.084657,-47.703747],[-23.083991,-47.705845],[-23.085274,-47.706687],[-23.086991,-47.705888],[-23.093850,-47.702757],[-23.093458,-47.701829],[-23.092279,-47.700861],[-23.092434,-47.699112],[-23.091573,-47.698412],[-23.091363,-47.697744],[-23.093004,-47.695762],[-23.091595,-47.694180],[-23.090075,-47.695127],[-23.089236,-47.696138],[-23.088442,-47.695958],[-23.086503,-47.696406],[-23.086048,-47.697323],[-23.086986,-47.697642],[-23.087931,-47.697967],[-23.088740,-47.698426],[-23.089313,-47.699820],[-23.090621,-47.700512],[-23.091938,-47.701398],[-23.093855,-47.699761],[-23.095498,-47.700240],[-23.097492,-47.701969],[-23.099885,-47.699131],[-23.101336,-47.698785],[-23.102397,-47.699308],[-23.101851,-47.700123],[-23.100882,-47.700207],[-23.101346,-47.700829],[-23.102251,-47.702157],[-23.103591,-47.709589],[-23.102084,-47.712008],[-23.105387,-47.713730],[-23.105727,-47.717807],[-23.111113,-47.718145],[-23.111201,-47.715670],[-23.113121,-47.714532],[-23.116572,-47.713012],[-23.127559,-47.697492],[-23.127739,-47.698243],[-23.126875,-47.699233],[-23.127492,-47.700217],[-23.128484,-47.701824],[-23.129228,-47.703006],[-23.128701,-47.703439],[-23.128538,-47.708184],[-23.125423,-47.711381],[-23.120578,-47.712024],[-23.113496,-47.701915],[-23.114569,-47.700609],[-23.116579,-47.700697],[-23.118313,-47.701521],[-23.117391,-47.702288],[-23.116128,-47.703420],[-23.114278,-47.704375],[-23.112087,-47.705834],[-23.105582,-47.710434],[-23.102084,-47.712008]] as [number,number][]
  },
];

const TERMINALS: { name: string; coords: [number, number] }[] = [
  { name: "Velho Terminal Rodoviário Germínio Simon", coords: [-23.102084, -47.712008] },
  { name: "Novo Terminal Rodoviário Oswaldo de Moraes", coords: [-23.111113, -47.718145] },
];

function MapaScreen() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const layerRefs = useRef<Record<string, L.Polyline | null>>({});
  const labelRefs = useRef<Record<string, L.Marker | null>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ROUTE_LINES.map((l) => [l.id, l.coords.length > 0]))
  );

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, { zoomControl: true }).setView([-23.102084, -47.712008], 13);
    leafletMap.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const terminalIcon = L.divIcon({
      html: '<div style="width:14px;height:14px;border-radius:50%;background:#0D47A1;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
      className: "",
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    TERMINALS.forEach((t) => {
      L.marker(t.coords, { icon: terminalIcon }).addTo(map).bindPopup(`<b>${t.name}</b>`);
    });

    ROUTE_LINES.forEach((line) => {
      if (!line.coords.length) { layerRefs.current[line.id] = null; labelRefs.current[line.id] = null; return; }

      const poly = L.polyline(line.coords, {
        color: line.color,
        weight: 4,
        opacity: 0.85,
        dashArray: (line as { dashed?: boolean }).dashed ? "8 6" : undefined,
        lineJoin: "round",
      }).bindPopup(`<b>${line.name}</b><br>${line.desc}`);
      poly.addTo(map);
      layerRefs.current[line.id] = poly;

      const midPoint = line.coords[Math.floor(line.coords.length / 2)];
      const labelIcon = L.divIcon({
        html: `<div style="display:inline-flex;align-items:center;gap:4px;background:white;border:2px solid ${line.color};color:${line.color};font-family:'Outfit',sans-serif;font-weight:800;font-size:10px;white-space:nowrap;padding:2px 7px 2px 5px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,0.2);transform:translate(-50%,-50%);"><span style="width:7px;height:7px;border-radius:50%;background:${line.color};flex-shrink:0;"></span>${line.name}</div>`,
        className: "",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      const label = L.marker(midPoint, { icon: labelIcon, interactive: false, keyboard: false }).addTo(map);
      labelRefs.current[line.id] = label;
    });

    const allCoords = ROUTE_LINES.flatMap((l) => l.coords);
    if (allCoords.length) map.fitBounds(allCoords, { padding: [20, 20] });

    return () => { map.remove(); leafletMap.current = null; };
  }, []);

  const toggleLine = (id: string) => {
    const map = leafletMap.current;
    if (!map) return;
    const next = !visible[id];
    setVisible((v) => ({ ...v, [id]: next }));
    const layer = layerRefs.current[id];
    const label = labelRefs.current[id];
    if (!layer) return;
    if (next) { layer.addTo(map); if (label) label.addTo(map); }
    else { map.removeLayer(layer); if (label) map.removeLayer(label); }
  };

  const showAll = () => {
    const map = leafletMap.current;
    if (!map) return;
    ROUTE_LINES.forEach((l) => {
      if (!l.coords.length) return;
      layerRefs.current[l.id]?.addTo(map);
      labelRefs.current[l.id]?.addTo(map);
    });
    setVisible(Object.fromEntries(ROUTE_LINES.map((l) => [l.id, l.coords.length > 0])));
  };

  const hideAll = () => {
    const map = leafletMap.current;
    if (!map) return;
    ROUTE_LINES.forEach((l) => {
      if (!l.coords.length) return;
      const layer = layerRefs.current[l.id];
      const label = labelRefs.current[l.id];
      if (layer) map.removeLayer(layer);
      if (label) map.removeLayer(label);
    });
    setVisible(Object.fromEntries(ROUTE_LINES.map((l) => [l.id, false])));
  };

  return (
    <div className="transition-screen flex flex-col h-full pb-24">
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #0D47A1 0%, #1565C0 100%)" }} className="px-6 pt-14 pb-4 rounded-b-[36px]">
        <h1 className="text-white text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Mapa da Cidade</h1>
        <p className="text-blue-200 text-sm mt-0.5">Toque em uma linha para mostrar/ocultar</p>
      </div>

      {/* Leaflet Map */}
      <div ref={mapRef} style={{ width: "100%", height: 300, flexShrink: 0 }} />

      {/* Panel */}
      <div className="px-4 pt-3 pb-2 flex-1 overflow-y-auto">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Linhas</p>
        {/* Toolbar */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={showAll}
            className="flex-1 bg-white text-blue-900 font-bold text-xs py-2.5 rounded-xl shadow-sm border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Mostrar todas
          </button>
          <button
            onClick={hideAll}
            className="flex-1 bg-white text-blue-900 font-bold text-xs py-2.5 rounded-xl shadow-sm border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Ocultar todas
          </button>
        </div>

        {/* Line list */}
        <div className="flex flex-col gap-2">
          {ROUTE_LINES.map((line) => {
            const hasRoute = line.coords.length > 0;
            const isOn = visible[line.id];
            return (
              <div
                key={line.id}
                onClick={() => hasRoute && toggleLine(line.id)}
                className="bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3 shadow-sm transition-opacity"
                style={{ opacity: hasRoute && !isOn ? 0.45 : 1, cursor: hasRoute ? "pointer" : "default" }}
              >
                <div className="w-3 h-3 rounded-full border-2 border-white shrink-0" style={{ background: line.color, boxShadow: `0 0 0 1.5px ${line.color}55` }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[13px] text-gray-900 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>{line.name}</p>
                  <p className="text-[10.5px] text-gray-400 truncate" style={{ fontFamily: "Inter, sans-serif" }}>{line.desc}</p>
                </div>
                {hasRoute ? (
                  <div
                    className="w-9 h-5 rounded-full shrink-0 relative transition-colors duration-150"
                    style={{ background: isOn ? "#1565C0" : "#DCE6F8" }}
                  >
                    <div
                      className="theme-toggle-thumb absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-150"
                      style={{ left: isOn ? "calc(100% - 18px)" : "2px" }}
                    />
                  </div>
                ) : (
                  <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>sem trajeto</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HorariosScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  return (
    <div className="transition-screen flex flex-col h-full pb-24">
      <div style={{ background: "linear-gradient(160deg, #0D47A1 0%, #1565C0 100%)" }} className="px-6 pt-14 pb-5 rounded-b-[36px]">
        <h1 className="text-white text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Horários e Eventos</h1>
        <p className="text-blue-200 text-sm mt-1">Hoje, segunda-feira · {String(currentHour).padStart(2,"0")}:{String(currentMin).padStart(2,"0")}</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-5">
        <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm">
          {schedules.map((s, i) => (
            <button
              key={s.line}
              onClick={() => setActiveTab(i)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                fontFamily: "Outfit, sans-serif",
                background: activeTab === i ? "#1565C0" : "transparent",
                color: activeTab === i ? "white" : "#64748B",
              }}
            >
              {s.line}
            </button>
          ))}
        </div>

        {/* Schedule card */}
        <div className="card mt-4 p-5">
          <p className="font-bold text-gray-800 mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
            {schedules[activeTab].dest}
          </p>
          <p className="text-xs text-gray-400 mb-5">Próximas partidas do Terminal Central</p>

          <div className="grid grid-cols-3 gap-3">
            {schedules[activeTab].times.map((t) => {
              const [h, m] = t.split(":").map(Number);
              const isPast = h < currentHour || (h === currentHour && m < currentMin);
              const isNext = !isPast && (h > currentHour || (h === currentHour && m >= currentMin));
              const isFirst = schedules[activeTab].times.findIndex(x => {
                const [hh, mm] = x.split(":").map(Number);
                return hh > currentHour || (hh === currentHour && mm >= currentMin);
              }) === schedules[activeTab].times.indexOf(t);

              return (
                <div
                  key={t}
                  className="rounded-2xl p-3 text-center"
                  style={{
                    background: isFirst && isNext ? "#1565C0" : isPast ? "#F8FAFC" : "#EFF6FF",
                    opacity: isPast ? 0.45 : 1,
                  }}
                >
                  <p
                    className="text-base font-bold"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      color: isFirst && isNext ? "white" : isPast ? "#94A3B8" : "#1565C0",
                    }}
                  >
                    {t}
                  </p>
                  {isFirst && isNext && (
                    <p className="text-xs text-blue-200 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>Próximo</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events */}
        <div className="mt-5">
          <p className="font-bold text-gray-800 mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Eventos e Avisos</p>
          {[
            { icon: "🚧", title: "Desvio na Av. Central", desc: "Obra até 18h · Linhas 101, 204 afetadas", color: "#FFF3E0", border: "#FFCC80" },
            { icon: "🎉", title: "Evento na Praça da Sé", desc: "Sábado e domingo · Linhas com frequência reforçada", color: "#E8F5E9", border: "#A5D6A7" },
            { icon: "ℹ️", title: "Horário especial feriado", desc: "Próxima quinta-feira · Todas as linhas", color: "#E3F2FD", border: "#90CAF9" },
          ].map((ev) => (
            <div
              key={ev.title}
              className="event-card rounded-2xl p-4 mb-2 border"
              style={{ background: ev.color, borderColor: ev.border }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{ev.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800" style={{ fontFamily: "Outfit, sans-serif" }}>{ev.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{ev.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerfilScreen({
  darkMode,
  onDarkModeChange,
}: {
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
}) {
  const [notif, setNotif] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <div className="transition-screen flex flex-col h-full pb-24">
      <div style={{ background: "linear-gradient(160deg, #0D47A1 0%, #1565C0 100%)" }} className="px-6 pt-14 pb-8 rounded-b-[36px]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-300/30 border-2 border-white/40 flex items-center justify-center">
            <span className="text-white text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>U</span>
          </div>
          <div>
            <h2 className="text-white text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Usuário</h2>
            <p className="text-blue-200 text-sm">usuário@gmail.com</p>
            <span className="tag mt-1" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>Usuário Comum</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: "Favoritos", value: "2" },
            { label: "Linhas usadas", value: "8" },
            { label: "Viagens", value: "47" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-white text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{value}</p>
              <p className="text-blue-200 text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-4">
        {/* Settings */}
        <div className="card p-5">
          <p className="font-bold text-gray-800 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Configurações</p>
          {[
            { label: "Notificações", value: notif, toggle: () => setNotif(!notif) },
            { label: "Localização", value: location, toggle: () => setLocation(!location) },
            { label: "Modo escuro", value: darkMode, toggle: () => onDarkModeChange(!darkMode) },
          ].map(({ label, value, toggle }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>
              <button
                onClick={toggle}
                type="button"
                role="switch"
                aria-checked={value}
                aria-label={label}
                className="relative w-12 h-6 rounded-full transition-all duration-200"
                style={{ background: value ? "#1565C0" : "#CBD5E1" }}
              >
                <div
                  className="theme-toggle-thumb absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: value ? "calc(100% - 20px)" : "4px" }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="card overflow-hidden">
          {[
            { icon: "🔔", label: "Alertas de linha" },
            { icon: "❓", label: "Ajuda e suporte" },
            { icon: "📋", label: "Termos de uso" },
            { icon: "⭐", label: "Avaliar o app" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>

        <button className="card px-5 py-4 text-red-500 font-semibold text-sm text-center hover:bg-red-50 transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}

// Icons
function RouteIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8"/><circle cx="3" cy="17" r="1.5" fill={color} stroke="none"/><circle cx="21" cy="7" r="1.5" fill={color} stroke="none"/>
    </svg>
  );
}
function MapIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  );
}
function ClockIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function StarIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function StarFilledIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

const NAV_ITEMS: { screen: Screen; label: string; icon: (active: boolean) => ReactElement }[] = [
  {
    screen: "home",
    label: "Início",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#1565C0" : "none"} stroke={active ? "#1565C0" : "#90A4C8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    screen: "linhas",
    label: "Linhas",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1565C0" : "#90A4C8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    screen: "mapa",
    label: "Mapa",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1565C0" : "#90A4C8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
  },
  {
    screen: "pesquisa",
    label: "Pesquisa",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1565C0" : "#90A4C8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    screen: "horarios",
    label: "Horários",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1565C0" : "#90A4C8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    screen: "perfil",
    label: "Perfil",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#1565C0" : "#90A4C8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const savedPreference = window.localStorage.getItem("busline-dark-mode");
      if (savedPreference !== null) return savedPreference === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    try {
      window.localStorage.setItem("busline-dark-mode", String(darkMode));
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }, [darkMode]);

  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomeScreen navigate={setScreen} />;
      case "linhas": return <LinhasScreen />;
      case "mapa": return <MapaScreen />;
      case "horarios": return <HorariosScreen />;
      case "perfil": return <PerfilScreen darkMode={darkMode} onDarkModeChange={setDarkMode} />;
      case "pesquisa": return <PesquisaScreen />;
    }
  };

  return (
    <div className={`app-shell min-h-screen flex items-center justify-center py-8 ${darkMode ? "dark" : ""}`}>
      <div className="phone-frame relative">
        <div className="overflow-y-auto" style={{ height: 844 }}>
          {renderScreen()}
        </div>

        {/* Bottom navigation */}
        <nav className="bottom-nav">
          {NAV_ITEMS.map(({ screen: s, label, icon }) => (
            <button key={s} className={`nav-item ${screen === s ? "active" : ""}`} onClick={() => setScreen(s)}>
              {icon(screen === s)}
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
