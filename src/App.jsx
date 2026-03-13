import { useState, useEffect } from 'react'
import { supabase } from './supabase'

// ─── STYLING ──────────────────────────────────────────────────────────────────
const GR  = 'bg-gradient-to-r from-red-600 to-orange-400'
const GRB = 'bg-gradient-to-r from-red-600 to-orange-400 hover:from-red-700 hover:to-orange-500'
const P   = { fontFamily: "'Poppins', sans-serif" }

// Toegestane emaildomeinen
const ALLOWED_DOMAINS = ['student.kdg.be']
const isAllowedEmail = (email) => {
  if (!email || !email.includes('@')) return false
  const domain = email.split('@')[1]?.toLowerCase()
  return ALLOWED_DOMAINS.includes(domain)
}
const DOMAIN_HINT = '@student.kdg.be'

// ─── FONT LOADER ──────────────────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    if (document.getElementById('poppins-font')) return
    const link = document.createElement('link')
    link.id = 'poppins-font'
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])
  return null
}

// ─── BLOBKE MASCOTTE ─────────────────────────────────────────────────────────
const Blobke = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="34" rx="26" ry="24" fill="#E53E3E"/>
    <ellipse cx="50" cy="64" rx="30" ry="34" fill="#E53E3E"/>
    <ellipse cx="50" cy="76" rx="21" ry="20" fill="#FC8181"/>
    <ellipse cx="21" cy="66" rx="8" ry="11" transform="rotate(-15 21 66)" fill="#E53E3E"/>
    <ellipse cx="79" cy="66" rx="8" ry="11" transform="rotate(15 79 66)" fill="#E53E3E"/>
    <ellipse cx="38" cy="100" rx="10" ry="7" fill="#C53030"/>
    <ellipse cx="62" cy="100" rx="10" ry="7" fill="#C53030"/>
    <circle cx="42" cy="31" r="4" fill="#1A202C"/>
    <circle cx="58" cy="31" r="4" fill="#1A202C"/>
    <circle cx="43.5" cy="29.5" r="1.5" fill="white"/>
    <circle cx="59.5" cy="29.5" r="1.5" fill="white"/>
    <path d="M44 40 Q50 46 56 40" stroke="#1A202C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <ellipse cx="35" cy="37" rx="5" ry="3" fill="#FEB2B2" opacity="0.75"/>
    <ellipse cx="65" cy="37" rx="5" ry="3" fill="#FEB2B2" opacity="0.75"/>
    <rect x="60" y="44" width="17" height="21" rx="4" fill="#805AD5"/>
    <rect x="62" y="41" width="13" height="5" rx="2.5" fill="#9F7AEA"/>
    <rect x="75" y="46" width="3" height="15" rx="1.5" fill="#6B46C1"/>
    <rect x="65" y="39" width="3" height="5" rx="1.5" fill="#6B46C1"/>
    <rect x="60" y="38" width="17" height="6" rx="3" fill="#D53F8C"/>
  </svg>
)

// ─── YUNO LOGO ────────────────────────────────────────────────────────────────
const YunoLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="14" fill="url(#lg1)"/>
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E53E3E"/><stop offset="1" stopColor="#ED8936"/>
      </linearGradient>
    </defs>
    <path d="M14 12 L24 26 L34 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="24" y1="26" x2="24" y2="38" stroke="white" strokeWidth="4" strokeLinecap="round"/>
  </svg>
)

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EUROPEAN_CITIES = [
  'Antwerpen','Brussel','Gent','Leuven','Hasselt','Luik','Brugge','Namen',
  'Amsterdam','Rotterdam','Utrecht','Den Haag','Eindhoven','Groningen','Maastricht','Tilburg',
  'Berlijn','München','Hamburg','Frankfurt','Keulen','Stuttgart','Düsseldorf','Leipzig',
  'Parijs','Lyon','Marseille','Toulouse','Bordeaux','Lille','Straatsburg','Nantes',
  'Madrid','Barcelona','Valencia','Sevilla','Bilbao','Granada','Salamanca',
  'Rome','Milaan','Napels','Bologna','Florence','Turijn','Venetië','Padua',
  'Lissabon','Porto','Coimbra',
  'Londen','Manchester','Edinburgh','Bristol','Birmingham','Leeds',
  'Dublin','Cork','Galway',
  'Stockholm','Kopenhagen','Oslo','Helsinki','Göteborg','Tampere',
  'Praag','Wenen','Boedapest','Warschau','Krakau','Bratislava','Ljubljana',
  'Athene','Thessaloniki','Zagreb','Belgrado','Boekarest','Sofia',
  'Tallinn','Riga','Vilnius',
  'Zürich','Genève','Bazel','Luxemburg','Reykjavik',
].sort()

const MONTHS = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
const HOBBIES = ['🏃 Sport','🎉 Feestjes','🎭 Cultuur','🎮 Gamen','✈️ Reizen','🎵 Muziek','📚 Studeren','🎨 Kunst','🍕 Eten','🌿 Natuur']

// ─── SCREEN: EMAIL ────────────────────────────────────────────────────────────
const ScreenEmail = ({ onContinue }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Voer een geldig e-mailadres in.')
      return
    }
    if (!isAllowedEmail(email)) {
      setError(`Alleen ${DOMAIN_HINT} adressen zijn toegestaan.`)
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      })
      if (err) throw err
      onContinue(email)
    } catch (e) {
      setError(e.message || 'Er is iets misgegaan. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={P} className="flex flex-col min-h-screen bg-white">
      <div className={`${GR} p-8 rounded-b-[3rem] shadow-lg flex flex-col items-center pb-10`}>
        <YunoLogo size={52}/>
        <h1 className="text-4xl font-extrabold text-white mt-3 mb-1">Yuno</h1>
        <p className="text-white/80 text-sm text-center">Verbind met studenten in heel Europa 🇪🇺</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 -mt-6">
        <Blobke size={96}/>
        <h2 className="text-xl font-bold text-gray-800 mt-3 mb-1">Welkom bij Yuno!</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Vul je KdG studentenadres in.<br/>
          <span className="font-medium text-gray-500">{DOMAIN_HINT}</span>
        </p>
        <div className="w-full space-y-3">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{error}</div>
          )}
          <input
            type="email"
            placeholder={`voornaam.naam${DOMAIN_HINT}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-2xl shadow-md transition-opacity ${GRB} ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Even geduld...' : 'Verdergaan →'}
          </button>
        </div>
        <p className="text-xs text-gray-300 mt-5 text-center">
          Door verder te gaan ga je akkoord met onze voorwaarden.
        </p>
      </div>
    </div>
  )
}

// ─── SCREEN: OTP ──────────────────────────────────────────────────────────────
const ScreenOtp = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleVerify = async () => {
    if (otp.length < 6) { setMessage('❌ Voer de 6-cijferige code in.'); return }
    setLoading(true); setMessage('')
    try {
      const { data, error: err } = await supabase.auth.verifyOtp({
        email, token: otp, type: 'email',
      })
      if (err) throw err
      onVerified(data.session, data.user)
    } catch {
      setMessage('❌ Ongeldige code. Controleer je e-mail en probeer opnieuw.')
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    setMessage('✅ Nieuwe code verstuurd!')
  }

  return (
    <div style={P} className="flex flex-col min-h-screen bg-white">
      <div className={`${GR} p-8 rounded-b-[3rem] shadow-lg`}>
        <button onClick={onBack} className="text-white/80 mb-4 text-sm font-medium">← Terug</button>
        <h1 className="text-2xl font-extrabold text-white mb-1">Check je inbox</h1>
        <p className="text-white/80 text-sm">We stuurden een code naar<br/><strong>{email}</strong></p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-5xl mb-5">📬</div>
        <div className="w-full space-y-3">
          {message && (
            <div className={`p-3 rounded-xl text-sm ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}
          <input
            type="number"
            placeholder="123456"
            value={otp}
            onChange={e => setOtp(e.target.value.slice(0, 6))}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-center text-2xl font-bold tracking-widest"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-2xl shadow-md ${GRB} ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Bezig...' : 'Verifiëren ✓'}
          </button>
          <button onClick={handleResend} className="w-full py-2 text-gray-400 text-sm font-medium">
            Geen code? Opnieuw sturen
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: PROFILE SETUP ────────────────────────────────────────────────────
const ScreenProfile = ({ email, userId, onComplete }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [citySearch, setCitySearch] = useState('')
  const [showCities, setShowCities] = useState(false)
  const [formData, setFormData] = useState({
    name: '', dob: '', study: '', phase: 'bachelor',
    city: '', startMonth: 'September', endMonth: 'Juni',
    hobbies: [], bio: '',
  })

  const filteredCities = EUROPEAN_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 8)

  const handleNext = async () => {
    if (step === 1 && (!formData.name || !formData.dob)) {
      setError('Vul je naam en geboortedatum in.'); return
    }
    if (step === 2 && (!formData.study || !formData.city)) {
      setError('Vul je studie en stad in.'); return
    }
    setError('')
    if (step < 3) { setStep(step + 1); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.from('profiles').upsert({
        id: userId,
        email,
        name: formData.name,
        dob: formData.dob,
        study: formData.study,
        phase: formData.phase,
        city: formData.city,
        start_month: formData.startMonth,
        end_month: formData.endMonth,
        hobbies: formData.hobbies,
        bio: formData.bio,
        updated_at: new Date().toISOString(),
      })
      if (err) throw err
      onComplete(formData)
    } catch (e) {
      setError(e.message || 'Opslaan mislukt. Probeer opnieuw.')
    } finally { setLoading(false) }
  }

  return (
    <div style={P} className="flex flex-col min-h-screen bg-white">
      <div className={`p-8 text-white ${GR} rounded-b-[3rem] shadow-lg`}>
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            className={`text-white/80 font-medium text-sm ${step === 1 ? 'invisible' : ''}`}
          >← Terug</button>
          <div className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">Stap {step} van 3</div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
          <div className="h-1.5 rounded-full bg-white transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}/>
        </div>
        <h1 className="text-2xl font-extrabold mb-1">Maak je profiel</h1>
        <p className="opacity-80 text-sm">
          {step === 1 ? 'Basis info' : step === 2 ? 'Studie & locatie' : 'Interesses & bio'}
        </p>
      </div>

      <div className="p-7 flex-1 flex flex-col">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                <span className="text-3xl">📸</span>
              </div>
            </div>
            <input
              type="text" placeholder="Volledige naam" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
            />
            <div>
              <label className="text-sm text-gray-400 font-medium mb-1 block">Geboortedatum</label>
              <input
                type="date" value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-red-400 outline-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text" placeholder="Studierichting (bv. Informatica)" value={formData.study}
              onChange={e => setFormData({ ...formData, study: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
            />
            <div className="flex gap-2">
              {['bachelor', 'master', 'phd'].map(p => (
                <button
                  key={p}
                  onClick={() => setFormData({ ...formData, phase: p })}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${formData.phase === p ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-500'}`}
                >
                  {p === 'phd' ? 'PhD' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Zoek een Europese stad..."
                value={formData.city ? formData.city : citySearch}
                onFocus={() => { setShowCities(true); if (formData.city) setCitySearch('') }}
                onBlur={() => setTimeout(() => setShowCities(false), 150)}
                onChange={e => { setCitySearch(e.target.value); setFormData({ ...formData, city: '' }); setShowCities(true) }}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
              />
              {showCities && filteredCities.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-44 overflow-y-auto">
                  {filteredCities.map(c => (
                    <button
                      key={c}
                      onMouseDown={() => { setFormData({ ...formData, city: c }); setCitySearch(''); setShowCities(false) }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-gray-700 font-medium text-sm border-b border-gray-50 last:border-0"
                    >
                      📍 {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Periode in de stad</p>
              <div className="flex items-center gap-2">
                <select
                  value={formData.startMonth}
                  onChange={e => setFormData({ ...formData, startMonth: e.target.value })}
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <span className="text-gray-300 font-bold">→</span>
                <select
                  value={formData.endMonth}
                  onChange={e => setFormData({ ...formData, endMonth: e.target.value })}
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm"
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Interesses (kies er minstens 1)</p>
              <div className="flex flex-wrap gap-2">
                {HOBBIES.map(h => (
                  <button
                    key={h}
                    onClick={() => {
                      const nh = formData.hobbies.includes(h)
                        ? formData.hobbies.filter(i => i !== h)
                        : [...formData.hobbies, h]
                      setFormData({ ...formData, hobbies: nh })
                    }}
                    className={`px-3 py-2 rounded-full font-medium text-sm transition-colors ${formData.hobbies.includes(h) ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Bio (optioneel)</p>
              <textarea
                placeholder="Vertel iets over jezelf..." value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-28 focus:ring-2 focus:ring-red-400 outline-none resize-none text-sm"
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <button
            onClick={handleNext}
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-2xl shadow-md ${GRB} ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Opslaan...' : step === 3 ? 'Profiel afronden 🎉' : 'Volgende →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN: CHAT ─────────────────────────────────────────────────────────────
const ScreenChat = ({ chat, userId, onBack }) => {
  const [messages, setMessages] = useState([{ from: 'them', text: 'Hey! Leuk dat we geconnect zijn 👋' }])
  const [input, setInput] = useState('')

  const send = async () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { from: 'me', text: input }])
    const text = input
    setInput('')
    try {
      await supabase.from('messages').insert({ sender_id: userId, chat_id: chat.id, content: text })
    } catch (_) {}
  }

  return (
    <div style={{ ...P, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F9FAFB' }}>
      <div className={`p-5 text-white ${GR} shadow-md flex items-center gap-3`}>
        <button onClick={onBack} className="text-white/80 text-xl font-bold">←</button>
        <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center font-bold text-white">
          {chat.name[0]}
        </div>
        <h2 className="text-lg font-bold">{chat.name}</h2>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${m.from === 'me' ? 'bg-red-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Typ een bericht..."
          className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400 text-sm"
        />
        <button onClick={send} className={`px-4 py-2 text-white font-bold rounded-xl ${GRB}`}>➤</button>
      </div>
    </div>
  )
}

// ─── PAGE: HOME ───────────────────────────────────────────────────────────────
const PageHome = ({ profile }) => (
  <div style={P} className="flex flex-col min-h-screen bg-gray-50 pb-20">
    <div className={`p-6 text-white ${GR} rounded-b-3xl shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="opacity-75 text-sm">Welkom terug 👋</p>
          <h2 className="text-2xl font-extrabold">{profile?.name || 'Student'}</h2>
        </div>
        <Blobke size={58}/>
      </div>
    </div>
    <div className="p-5 space-y-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Jouw stad</p>
          <p className="text-xl font-extrabold text-gray-800 mt-0.5">{profile?.city || '—'}</p>
          <p className="text-sm text-gray-400">{profile?.startMonth} – {profile?.endMonth}</p>
        </div>
        <div className="text-4xl">📍</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
          <p className="text-3xl font-extrabold text-red-500">24</p>
          <p className="text-xs text-gray-400 mt-1">Studenten nabij</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
          <p className="text-3xl font-extrabold text-orange-400">8</p>
          <p className="text-xs text-gray-400 mt-1">Evenementen</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h3 className="font-bold text-gray-700 mb-3">🔥 Trending groepen</h3>
        {['Kotfeestjes', 'Informatica 2026', 'Erasmus Network', 'Voetbal Team'].map(g => (
          <div key={g} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-gray-700 font-medium text-sm">{g}</span>
            <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">Actief</span>
          </div>
        ))}
      </div>
      {profile?.hobbies?.length > 0 && (
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-700 mb-3">🎯 Jouw interesses</h3>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map(h => (
              <span key={h} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">{h}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)

// ─── PAGE: CONNECTIONS ────────────────────────────────────────────────────────
const PageConnections = ({ connections, joinedGroups, onConnect, onJoinGroup, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState('individuals')
  const USERS = [
    { id: 1, name: 'Emma', study: 'Rechten', match: 90, city: 'Gent' },
    { id: 2, name: 'Liam', study: 'Informatica', match: 85, city: 'Leuven' },
    { id: 3, name: 'Noah', study: 'Geneeskunde', match: 78, city: 'Antwerpen' },
    { id: 4, name: 'Sara', study: 'Psychologie', match: 72, city: 'Brussel' },
  ]
  const GROUPS = [
    { id: 101, name: 'Informatica 2026', members: 120, desc: 'Studiegroep voor informatica studenten.' },
    { id: 102, name: 'Voetbal Team', members: 15, desc: 'Wekelijks potje voetbal op de campus.' },
    { id: 103, name: 'Kotfeestjes', members: 340, desc: 'De beste feestjes in de buurt!' },
    { id: 104, name: 'Erasmus Network', members: 87, desc: 'Verbind met Erasmus-studenten in Europa.' },
  ]

  return (
    <div style={P} className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className={`p-6 text-white ${GR} rounded-b-3xl shadow-md`}>
        <h2 className="text-2xl font-extrabold">Connecties</h2>
        <p className="opacity-75 text-sm">Ontdek studenten en groepen</p>
      </div>
      <div className="flex bg-white shadow-sm mb-4">
        <button onClick={() => setActiveTab('individuals')} className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'individuals' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}>Studenten</button>
        <button onClick={() => setActiveTab('groups')} className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'groups' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}>Groepen</button>
      </div>
      <div className="p-5 flex-1">
        {activeTab === 'individuals' && (
          <div className="space-y-3">
            {USERS.map(u => (
              <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-white font-bold text-lg">{u.name[0]}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.study} · {u.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-500">{u.match}%</span>
                  {connections?.has(u.id) ? (
                    <button onClick={() => onOpenChat({ id: `user_${u.id}`, name: u.name })} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs">Chat</button>
                  ) : (
                    <button onClick={() => onConnect(u)} className={`px-3 py-1.5 text-white font-semibold rounded-xl text-xs ${GRB}`}>Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'groups' && (
          <div className="space-y-3">
            {GROUPS.map(g => (
              <div key={g.id} className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-gray-800">{g.name}</p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2 shrink-0">{g.members} leden</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{g.desc}</p>
                {joinedGroups?.has(g.id) ? (
                  <button onClick={() => onOpenChat({ id: `group_${g.id}`, name: g.name })} className="w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm">Open Chat</button>
                ) : (
                  <button onClick={() => onJoinGroup(g)} className="w-full py-2 bg-red-100 text-red-600 font-bold rounded-xl text-sm">Joinen</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PAGE: PROFILE ────────────────────────────────────────────────────────────
const PageProfile = ({ profile, connections, joinedGroups, onLogout }) => {
  const [activeTab, setActiveTab] = useState('activity')
  const [notifications, setNotifications] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <div style={P} className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <div className={`p-6 text-white ${GR} rounded-b-3xl shadow-md`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center text-2xl font-bold">
            {profile?.name?.[0] || '?'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{profile?.name || 'Mijn Profiel'}</h2>
            <p className="opacity-80 text-sm">{profile?.study}{profile?.phase && ` · ${profile.phase}`}</p>
            {profile?.city && <p className="opacity-70 text-xs mt-0.5">📍 {profile.city} ({profile.startMonth} – {profile.endMonth})</p>}
          </div>
        </div>
      </div>
      <div className="flex bg-white shadow-sm mb-4">
        <button onClick={() => setActiveTab('activity')} className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'activity' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}>Activiteit</button>
        <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 font-semibold text-sm ${activeTab === 'settings' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}>Instellingen</button>
      </div>
      <div className="p-5 flex-1">
        {activeTab === 'activity' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-red-500">{connections?.size || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Connecties</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                <p className="text-3xl font-extrabold text-orange-400">{joinedGroups?.size || 0}</p>
                <p className="text-xs text-gray-400 mt-1">Groepen</p>
              </div>
            </div>
            {profile?.bio && (
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Bio</p>
                <p className="text-sm text-gray-700">{profile.bio}</p>
              </div>
            )}
            {profile?.hobbies?.length > 0 && (
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Interesses</p>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map(h => (
                    <span key={h} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
              <span className="font-semibold text-gray-800 text-sm">Meldingen</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-6' : ''}`}/>
              </button>
            </div>
            {profile?.email && (
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Account</p>
                <p className="text-sm text-gray-700 font-medium">{profile.email}</p>
              </div>
            )}
            <button onClick={handleLogout} className="w-full py-3.5 bg-red-50 text-red-600 font-bold rounded-2xl text-sm border border-red-100">
              Uitloggen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
const BottomNav = ({ active, onChange }) => (
  <div
    style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', fontFamily: "'Poppins',sans-serif" }}
    className="bg-white border-t border-gray-100 flex shadow-2xl z-50"
  >
    {[
      { id: 'home', e: '🏠', l: 'Home' },
      { id: 'connections', e: '🤝', l: 'Connecties' },
      { id: 'profile', e: '👤', l: 'Profiel' },
    ].map(t => (
      <button key={t.id} onClick={() => onChange(t.id)}
        className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${active === t.id ? 'text-red-500' : 'text-gray-400'}`}>
        <span className="text-xl">{t.e}</span>
        <span className="text-xs font-semibold">{t.l}</span>
      </button>
    ))}
  </div>
)

// ─── LOADING ──────────────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div style={P} className="flex flex-col min-h-screen bg-white items-center justify-center">
    <Blobke size={80}/>
    <p className="text-gray-400 mt-4 font-medium text-sm">Even laden...</p>
  </div>
)

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('loading')
  const [page, setPage] = useState('home')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [connections, setConnections] = useState(new Set())
  const [joinedGroups, setJoinedGroups] = useState(new Set())
  const [chat, setChat] = useState(null)

  useEffect(() => {
    let subscription = null

    const loadProfile = async (uid) => {
      const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
      if (data && data.name) {
        setProfile({
          name: data.name, dob: data.dob, study: data.study, phase: data.phase,
          city: data.city, startMonth: data.start_month, endMonth: data.end_month,
          hobbies: data.hobbies || [], bio: data.bio || '', email: data.email,
        })
        return true
      }
      return false
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        setEmail(session.user.email)
        const hasProfile = await loadProfile(session.user.id)
        setScreen(hasProfile ? 'app' : 'setup')
      } else {
        setScreen('email')
      }

      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_ev, s) => {
        if (!s) setScreen('email')
      })
      subscription = sub
    }

    init()
    return () => { if (subscription) subscription.unsubscribe() }
  }, [])

  const handleEmailContinue = (e) => { setEmail(e); setScreen('otp') }

  const handleOtpVerified = async (_session, user) => {
    setUserId(user.id)
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data && data.name) {
      setProfile({
        name: data.name, dob: data.dob, study: data.study, phase: data.phase,
        city: data.city, startMonth: data.start_month, endMonth: data.end_month,
        hobbies: data.hobbies || [], bio: data.bio || '', email: data.email,
      })
      setScreen('app')
    } else {
      setScreen('setup')
    }
  }

  const handleProfileComplete = (data) => { setProfile({ ...data, email }); setScreen('app') }
  const handleLogout = () => {
    setScreen('email'); setProfile(null); setUserId(null)
    setConnections(new Set()); setJoinedGroups(new Set())
  }

  if (screen === 'loading') return <><FontLoader/><LoadingScreen/></>
  if (screen === 'email')   return <><FontLoader/><ScreenEmail onContinue={handleEmailContinue}/></>
  if (screen === 'otp')     return <><FontLoader/><ScreenOtp email={email} onVerified={handleOtpVerified} onBack={() => setScreen('email')}/></>
  if (screen === 'setup')   return <><FontLoader/><ScreenProfile email={email} userId={userId} onComplete={handleProfileComplete}/></>
  if (chat)                 return <><FontLoader/><ScreenChat chat={chat} userId={userId} onBack={() => setChat(null)}/></>

  return (
    <>
      <FontLoader/>
      <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', position: 'relative', fontFamily: "'Poppins',sans-serif" }}>
        {page === 'home' && <PageHome profile={profile}/>}
        {page === 'connections' && (
          <PageConnections
            connections={connections}
            joinedGroups={joinedGroups}
            onConnect={u => setConnections(prev => new Set([...prev, u.id]))}
            onJoinGroup={g => setJoinedGroups(prev => new Set([...prev, g.id]))}
            onOpenChat={setChat}
          />
        )}
        {page === 'profile' && (
          <PageProfile profile={profile} connections={connections} joinedGroups={joinedGroups} onLogout={handleLogout}/>
        )}
        <BottomNav active={page} onChange={setPage}/>
      </div>
    </>
  )
}
