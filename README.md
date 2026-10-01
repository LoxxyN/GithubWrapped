# GitHub Wrapped

Персональный годовой отчёт по GitHub в формате «Spotify Wrapped»: вводишь username — получаешь историю из 8 слайдов: коммиты, языки, месяцы, streak, хронотип и лучший репозиторий.

**Автор:** [@LoxxyN](https://github.com/LoxxyN) · **Исходники:** [LoxxyN/GithubWrapped](https://github.com/LoxxyN/GithubWrapped)

## Стек

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [react-insta-stories](https://github.com/mohitk05/react-insta-stories) — движок сторис: автоплей, стрелки, тапы
- [GSAP](https://gsap.com) + [@gsap/react](https://gsap.com/docs/v3/Plugins/React/) — анимации заголовков (SplitText)
- [Three.js](https://threejs.org) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) — WebGL-фон Silk на лендинге
- [Zod](https://zod.dev) — валидация ответов GitHub API
- [lucide-react](https://lucide.dev) — иконки
- GitHub GraphQL API (вклады) + REST API (поиск коммитов), без SDK — обычный `fetch`

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
| `/` | Лендинг: инпут с валидацией username и WebGL-фон Silk |
| `/wrapped/[username]` | Экран историй: 8 слайдов с автоплеем (7 с), навигацией стрелками/тапами и шарингом |
| `GET /api/wrapped/[username]` | API: `WrappedData` со статистикой, ошибки мапятся в 400/404/429 |

Данные загружаются на клиенте (`useWrappedData`): loading → error → `WrappedExperience`. Слайд с хронотипом скрывается, если в данных нет ночных коммитов.

## Слайды

`intro` → `commits` → `language` → `month` → `streak` → `chronotype` → `repository` → `summary`

У каждого слайда 5 случайных вариантов заголовка (`storyPhrases.ts`), тема-акцент и своя раскладка. Финальный слайд умеет копировать ссылку на отчёт и вести на главную.

## API

`GET /api/wrapped/[username]` возвращает:

```json
{
  "year": 2026,
  "profile": { "username": "octocat", "displayName": "The Octocat", "avatarUrl": "..." },
  "stats": {
    "totalContributions": 1234,
    "totalRepositories": 42,
    "followers": 120,
    "languages": [{ "name": "TypeScript", "commits": 800, "percentage": 65, "color": "#3178c6" }],
    "topLanguage": { "name": "TypeScript", "commits": 800, "percentage": 65, "color": "#3178c6" },
    "months": [{ "month": 1, "label": "Январь", "contributions": 120 }],
    "activeMonth": { "month": 1, "label": "Январь", "contributions": 120 },
    "streak": 14,
    "streakStart": "2026-01-05",
    "streakEnd": "2026-01-18",
    "chronotype": "night-owl",
    "nightCommitPercentage": 62,
    "topRepository": { "name": "github-wrapped", "commits": 300, "stars": 15, "language": "TypeScript" }
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
  wrapped/[username]/page.tsx   # экран историй
  api/wrapped/[username]/       # route handler
  _components/
    Landing/ LandingBackground/ LandingForm/   # секции лендинга
    WrappedDataLoader/          # клиентская загрузка (useWrappedData)
    WrappedLoading/ WrappedError/
    WrappedExperience/          # экран историй
      stories/                  # 8 слайдов + StoryContent
      hooks/                    # useShare, useStoryPhrase
      Headline.tsx              # кремовые плашки в заголовках
      storyPhrases.ts           # по 5 фраз на слайд
      WrappedExperience.css     # стили stories
src/
  shared/
    ui/                         # Logo, Silk, SplitText
    lib/api/                    # github, github-client, errors, schemas, mock-data
    lib/utils/                  # calculations, validation, format
    lib/types/                  # WrappedData и др.
```

## Дизайн

Дизайн-система «Wrapped Editorial» описана в [DESIGN.md](./DESIGN.md) (цвета, типографика, сетка, правила слайдов). Архитектура и договорённости — в [AGENTS.md](./AGENTS.md) и [plan.md](./plan.md).

## Команды проверки

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Статус

Реализовано полностью: лендинг, API с расчётами и демо-данными, экран из 8 историй с дизайном-системой, шаринг и ошибки.
