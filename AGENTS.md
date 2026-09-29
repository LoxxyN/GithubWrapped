<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Архитектура и структура проекта

- Если задача не описана здесь или в `plan.md` — спросить.
  Не реализовывать по умолчанию, ничего не додумывать.
- Логика должна жить отдельно от UI и вынесена в хуки

## Каталоги

- `app/` — главная папка проекта с экранами
- `app/globals.css` — глобальные стили для приложения (css-переменные из ui lib)
- `app/normalize.css` — нормализация стилей
- `app/_components/` — секции, принадлежащие конкретной странице (приватные для неё)
- `src/components/` — готовые переиспользуемые компоненты
- `src/shared/ui/` — обёртки над компонентами из ui-либ либо компонент,
  который используется повсеместно, но представляет собой готовый к расширению компонент
- `src/shared/lib/utils/` — отдельные функции и хелперы
- `src/shared/lib/api/` — запросы к API и всё, что с ними связано
- `src/shared/lib/types/` — переиспользуемые типы
- `public/` — иконки и картинки

## Компоненты

- Переиспользуемый — элемент, который используется в 2 и более местах приложения
- Если компонент используется в одном месте внутри другого компонента,
  он создаётся в директории этого родителя.
  Пример: `NavLink` используется только в `Navbar` →
  `Navbar/Navbar.tsx`, рядом — `Navbar/NavLink.tsx`
- Секции конкретной страницы живут рядом со страницей — `app/_components/`
- Экспорт через public API: в директории публичного компонента создаётся
  `index.ts` с экспортом нужного; плюс верхний баррел `src/components/index.ts`
  агрегирует публичные компоненты
- Именование директорий и файлов компонентов — PascalCase (`Navbar/Navbar.tsx`)

## Стили

- Если для стилей нужно не больше 7–8 классов — Tailwind прямо в разметке
- Иначе — CSS-файл рядом с компонентом с таким же именем (`Navbar/Navbar.css`), классы по БЭМ
- Глобально только `app/globals.css` и `app/normalize.css`

## Иконки

- Иконки не рисовать самим — брать готовые из либы
- Все иконки проекта — из одной либы: `lucide-react`

## Команды проверки

- `npm run lint`, `npx tsc --noEmit`, `npm run build`
