# Yuno App — Setup Gids

## 🚀 Snel starten op Stackblitz

1. Ga naar **https://stackblitz.com/fork/github** of klik **"New Project → React"**
2. Verwijder de standaard bestanden en upload alle bestanden uit deze map
3. Of: importeer via GitHub als je de code daar hebt gepusht

### Alternatief: lokaal draaien
```bash
npm install
npm run dev
```

---

## 🗄️ Supabase instellen

Voer dit SQL uit in je Supabase project onder **SQL Editor → New Query**:

```sql
-- Profiles tabel
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  dob text,
  study text,
  phase text default 'bachelor',
  city text,
  start_month text,
  end_month text,
  hobbies text[] default '{}',
  bio text default '',
  updated_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;

create policy "Gebruikers kunnen eigen profiel bekijken en aanpassen"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Messages tabel (voor chat)
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users on delete cascade,
  chat_id text not null,
  content text not null,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Gebruikers kunnen berichten sturen en lezen"
  on messages for all
  using (auth.uid() = sender_id);
```

---

## 📧 OTP Email instellen in Supabase

1. Ga naar **Authentication → Email Templates**
2. Controleer dat **"Enable Email OTP"** aanstaat
3. Ga naar **Authentication → Providers → Email** en zet **"Confirm email"** op **enabled**
4. Optioneel: pas de e-mailtemplate aan met het Yuno-logo

---

## 🔐 Toegestane emaildomeinen

Momenteel is alleen `@student.kdg.be` toegestaan.

Wil je meer domeinen toevoegen? Pas dit aan in `src/App.jsx`:

```js
const ALLOWED_DOMAINS = ['student.kdg.be', 'student.ugent.be', 'kuleuven.be']
```

---

## 📁 Bestandsstructuur

```
yuno-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── index.css
    ├── supabase.js     ← Supabase credentials
    └── App.jsx         ← Volledige app
```
