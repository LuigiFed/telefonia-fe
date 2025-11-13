# Telefonia FE

Un progetto React TypeScript con Material-UI (MUI) costruito con Vite.

## 🚀 Caratteristiche

- **React 18** con TypeScript
- **Material-UI (MUI)** per i componenti UI
- **Vite** come build tool per prestazioni ottimali
- **Struttura organizzata** delle cartelle per scalabilità
- **Configurazione tema** personalizzabile
- **Hook personalizzati** per gestione stato e API
- **Componenti riutilizzabili**

## 📁 Struttura del Progetto

```
src/
├── components/         # Componenti UI riutilizzabili
│   ├── Header.tsx
│   ├── DataCard.tsx
│   └── index.ts
├── pages/             # Componenti pagina e routing
│   ├── HomePage.tsx
│   └── index.ts
├── hooks/             # Hook React personalizzati
│   └── useApi.ts
├── utils/             # Funzioni di utilità
│   └── index.ts
├── types/             # Definizioni TypeScript
│   └── index.ts
├── theme/             # Configurazione tema MUI
│   └── theme.ts
├── App.tsx
└── main.tsx
```

## 🛠️ Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   ```

## 📦 Dipendenze Principali

- `react` & `react-dom` - Libreria React
- `typescript` - Supporto TypeScript
- `@mui/material` - Componenti Material-UI
- `@emotion/react` & `@emotion/styled` - Engine CSS per MUI
- `@mui/icons-material` - Icone Material-UI
- `vite` - Build tool e dev server

## 🏃‍♂️ Comandi Disponibili

### Sviluppo

```bash
npm run dev
```

Avvia il server di sviluppo su `http://localhost:5173`

### Build

```bash
npm run build
```

Compila l'applicazione per la produzione

### Preview

```bash
npm run preview
```

Anteprima della build di produzione

### Linting

```bash
npm run lint
```

Esegue ESLint per il controllo del codice

## 🎨 Temi e Styling

Il progetto utilizza un tema MUI personalizzato configurato in `src/theme/theme.ts`. Puoi modificare:

- Palette dei colori
- Typography
- Componenti personalizzati
- Breakpoints responsive

## 🧩 Componenti Disponibili

### Header

Barra di navigazione superiore con logo e menu

### DataCard

Card riutilizzabile per visualizzare informazioni con azioni

## 🪝 Hook Personalizzati

### useApi

Hook per gestire chiamate API con stati di loading ed errore

## 🔧 Configurazione TypeScript

Il progetto è configurato con TypeScript strict mode per:

- Type safety migliorato
- Autocompletamento IDE
- Refactoring sicuro
- Documentazione del codice

## 📱 Responsive Design

L'applicazione è completamente responsive grazie al sistema Grid di MUI e ai breakpoints personalizzati.

## 🚀 Deploy

Per il deploy in produzione:

1. Esegui il build:
   ```bash
   npm run build
   ```
2. I file ottimizzati saranno nella cartella `dist/`
3. Carica il contenuto su un web server

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Linee Guida per lo Sviluppo

- Usa componenti funzionali React con hooks
- Segui le convenzioni TypeScript strict
- Utilizza i componenti e il sistema di theming MUI
- Implementa gestione errori e stati di loading
- Mantieni la struttura delle cartelle organizzata
- Scrivi codice testabile e riutilizzabile

## 📄 Licenza

Questo progetto è sotto licenza MIT.
