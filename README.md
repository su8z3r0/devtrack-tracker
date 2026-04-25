# DevTrack Academy - Tracker

Un semplice tracker di progresso per il percorso di formazione DevTrack Academy.

## Tecnologie

- Vue.js 3 + TypeScript
- Tailwind CSS
- localStorage (persistenza dati nel browser)
- Vite (build tool)

## Avvio

### Sviluppo locale
```bash
npm install
npm run dev
```

Apri http://localhost:5173

### Build per produzione
```bash
npm run build
```

I file statici saranno in `dist/`. Puoi servirli con qualsiasi web server statico:
```bash
cd dist
npx serve .
```

## Funzionalità

- **19 moduli** di apprendimento organizzati per categoria
- **Progresso tracciato** in localStorage (persiste tra sessioni)
- **Switch lingua** IT/EN
- **Stati modulo**: Bloccato 🔒 / In Corso 📖 / Completato ✅
- **Note personali** per ogni modulo
- **Sblocco progressivo**: completando un modulo si sblocca il successivo
- **Esporta/Importa** dati (da aggiungere)
- **Progress bar** con percentuale completamento

## Struttura dati

I progressi sono salvati in localStorage con chiave `devtrack-progress`:

```typescript
interface ModuleProgress {
  moduleId: number;      // 1-19
  status: 'locked' | 'in-progress' | 'completed';
  completedAt: string | null;  // ISO date
  notes: string;         // Note personali
}
```

## I 19 Moduli

1. Docker Compose (DevOps)
2. PHPUnit e TDD (Backend PHP)
3. GitHub Actions CI/CD (DevOps)
4. Livewire 3 (Backend PHP)
5. Tailwind CSS (Frontend)
6. Vue.js 3 (Frontend)
7. Redis Cache e Queue (Database)
8. RAG e LangChain (AI Engineering)
9. AI in PHP con OpenAI SDK (AI Engineering)
10. Transazioni MySQL ACID (Database)
11. AWS S3 EC2 RDS (DevOps)
12. Symfony Basi (Backend PHP)
13. Embeddings e ChromaDB (AI Engineering)
14. MCP Tool Calling (AI Engineering)
15. TypeScript Base (Frontend)
16. Laravel 11 Novità (Backend PHP)
17. Prompt Engineering (AI Engineering)
18. Inglese Tecnico (Soft Skill)
19. Revisione Progetti GitHub (Portfolio)

## Note

- Dati salvati solo localmente nel browser
- Per backup: copia il valore di `localStorage.getItem('devtrack-progress')` dalla console DevTools
- Per reset: `localStorage.removeItem('devtrack-progress')` nella console
