# GitHub Wrapped

Персональный годовой отчёт по GitHub в формате «Spotify Wrapped»: вводишь username — получаешь свой год одной историей: коммиты, языки, streak, chronotype и лучший проект.

**Автор:** [@LoxxyN](https://github.com/LoxxyN) · **Исходники:** [LoxxyN/GithubWrapped](https://github.com/LoxxyN/GithubWrapped)

## Стек

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Three.js](https://threejs.org) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) — WebGL-фон Silk
- [lucide-react](https://lucide.dev) — иконки
- GitHub REST API (без SDK, обычный `fetch`)

## Старт

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

### Переменные окружения

| Переменная | Описание |
| --- | --- |
| `GITHUB_TOKEN` | GitHub PAT для запросов к API. **Опциональна:** без неё проект работает на демо-данных (`source: 'mock'`) |

Токен живёт только на сервере (в route handler) и никогда не уходит на клиент.

```bash
# .env.local
GITHUB_TOKEN=ghp_...
```

## Страницы

| URL | Описание |
| --- | --- |
| `/` | Лендинг: инпут с валидацией username и WebGL-фон |
| `/wrapped/[username]` | Иммерсивная презентация со слайдами (в разработке) |
| `GET /api/wrapped/[username]` | API: `WrappedData` со статистикой, ошибки мапятся в 400/404/429 |

## API

`GET /api/wrapped/[username]` возвращает:

```json
{
  "year": 2026,
  "profile": { "login": "octocat", "avatarUrl": "..." },
  "stats": {
    "totalCommits": 1234,
    "languages": [{ "name": "TypeScript", "commits": 800, "color": "..." }],
    "months": [{ "label": "Январь", "commits": 120 }],
    "longestStreak": { "days": 14, "start": "...", "end": "..." },
    "chronotype": "night-owl",
    "topRepository": { "name": "...", "url": "...", "commits": 300 }
  },
  "source": "github",
  "generatedAt": "2026-09-25T..."
}
```

Коды ошибок: `invalid-username` (400), `not-found` (404), `rate-limit` (429), `empty`, `unavailable`.

## Структура

```
app/
  page.tsx                      # лендинг
  wrapped/[username]/page.tsx   # экран слайдов (заглушка)
  api/wrapped/[username]/       # route handler
  _components/                  # секции страниц (Landing, WrappedExperience)
src/
  shared/
    ui/                         # переиспользуемые: Logo, Silk
    lib/api/                    # github.ts, mock-data.ts
    lib/utils/                  # calculations, validation, format
    lib/types/                  # типы WrappedData и др.
```

## Команды проверки

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Статус

Реализован лендинг и серверная часть (расчёты, API, демо-данные). Экран слайдов `WrappedExperience` написан, но ещё не подключён к `/wrapped/[username]` — подробности в [plan.md](./plan.md).
