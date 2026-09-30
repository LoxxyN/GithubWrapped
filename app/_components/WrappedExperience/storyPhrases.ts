import type { StoryKind } from './StoryContent'

export const storyPhrases: Record<StoryKind, readonly string[]> = {
	intro: [
		'Вот что случилось,\n{username}',
		'{username},\nтвой год в коде',
		'Это всё, что\nсделал {username}',
		'Год на GitHub:\n{username}',
		'Смотри, что\nвышло у {username}',
	],
	commits: [
		'За год ты внёс\n{contributions}',
		'{contributions}\nв этом году',
		'Твой итог —\n{contributions}',
		'Год в цифрах:\n{contributions}',
		'{contributions} —\nэто твой ритм',
	],
	language: [
		'Ты практически\nговоришь на\n{language}',
		'{language} —\nтвой язык\nгода',
		'Твой код\nзвучит на\n{language}',
		'Год ты думал\nна {language}',
		'Основной язык —\n{language}',
	],
	month: [
		'Твой пик был\n{month}',
		'Пик года —\n{month}',
		'{month} —\nтвой лучший месяц',
		'Всё случилось\nв {month}',
		'Твой месяц:\n{month}',
	],
	streak: [
		'{streak} дней\nподряд',
		'Серия года —\n{streak} дней',
		'Ты держал\n{streak} дней\nбез остановки',
		'Без срыва:\n{streak} дней',
		'{streak} подряд —\nне сбивайся',
	],
	chronotype: [
		'Ты —\n{chronotype}',
		'Твой темп —\n{chronotype}',
		'{chronotype}:\nкогда пишешь ты',
		'Ночь или утро?\nТы — {chronotype}',
		'{chronotype}\nпо своей природе',
	],
	repository: [
		'Проект, который\n{забрал больше всего}',
		'Главный проект —\n{repo}',
		'Больше всего\nзабрал {repo}',
		'{repo} —\nтвой центр\nтяжести',
		'Проект года —\n{repo}',
	],
	summary: [
		'Это был\n{твой год.}',
		'{Год закрыт.}\nСмотри итоги',
		'{Итоги готовы}',
		'Вот\n{что вышло}',
		'{Твой год}\nв одном кадре',
	],
}
