
>**See most active contributers on [hexlet-friends](https://friends.hexlet.io/).**

# Hexlet Interview

### Участие
* Обсуждение в канале #nodejs слака http://slack-ru.hexlet.io

### Requirements
* NodeJS >= 12.13.0
* npm >= 6.12
* docker & docker-compose

### Run
```bash
- make db-up
- make install
- make setup
- make start
open localhost:3000 in your browser
```

### Смысл
### MVP
- Пользователь должен иметь возможность зайти на сайт, нажать кнопку "Хочу собеседоваться", после чего заполнить форму.
- В системе создастся заявка на собеседование. Человек заинтересованный в том, чтобы пособеседовать кандидата должен иметь возможность
просмотра списка заявок. После того как он выберет подходящую, необходимо скооперировать двух людей, привлечь какого-либо челоевека
с Hexlet, чтобы создали видео встречу и сохранить данные о будущем собеседовании в системе.
- Так же для всех пользователей нужна возможность просмотра списка предстоящих публичных собеседований с датой и ссылкой на видеотрансляцию.


### Стандарты
- Пулреквесты должны быть настолько маленькими насколько это возможно с точки зрения здравого смысла
- Весь код должен соответствовать стандартам кодирования tslint
- Пулреквест должен проходить все проверки

### Прикладные вещи
- Все экшены контроллеров должны быть покрыты тестами
- Тексты только через локали (В том числе в темплейтах `pug`)

### Схема работы
- Если берете задачу из issues, отпишитесь что вы ее взяли.
- Работа идет в своем форке
- В своем форке создается ветка под определенную issue, в имени ветки должно присутствовать идентификатор issue (ex. #42),
а также текст `Closes #42` для автоматического закрытия issue после того как будет зарезолен pull request.
- Ветка пушится в свой форк, гитхаб предложит создать pull request
- Не забываем вливать как можно чаще себе мастер из главного репозитория (Нужно добавить еще один `git remote`)
- После того как ваш пулл реквест будет принят, можно удалять свою ветку, обновлять мастер из главного репозитория и дальше по списку

### Полезные ссылки
- [NestJS docs](https://docs.nestjs.com/)
- [TypeORM docs](https://typeorm.io/#/)
- [NestJS Awesome](https://github.com/juliandavidmr/awesome-nestjs)
- [Old Version](https://github.com/hexlet-volunteers/interviews)

---

[![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/assets/master/images/hexlet_logo128.png)](https://ru.hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=exercises-javascript)

This repository is created and maintained by the team and the community of Hexlet, an educational project. [Read more about Hexlet (in Russian)](https://ru.hexlet.io/pages/about?utm_source=github&utm_medium=link&utm_campaign=exercises-javascript).



