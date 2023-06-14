// Глобальные переменные:                            
var FIELD_SIZE_X = 20;//строки
var FIELD_SIZE_Y = 20;//столбцы
var snake_timer; // Таймер змейки
var direction = 'y+'; // Направление движения змейки
var gameIsRunning = false; // Запущена ли игра
var score = 0; // Результат
var snake = []; // Сама змейка



function init() {
    var wrap = document.getElementsByClassName('wrap')[0];
    wrap.style.width = '400px';
    // События кнопок Старт и Новая игра
    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click', refreshGame);
    // Отслеживание клавиш клавиатуры
    addEventListener('keydown', changeDirection);
    prepareGameField(); // Генерация поля

        function changeDirection(e) {
    switch (e.keyCode) {
        case 37: // Клавиша влево
            if (direction != 'x+') {
                direction = 'x-'
            }
            break;
        case 38: // Клавиша вверх
            if (direction != 'y-') {
                direction = 'y+'
            }
            break;
        case 39: // Клавиша вправо
            if (direction != 'x-') {
                direction = 'x+'
            }
            break;
        case 40: // Клавиша вниз
            if (direction != 'y+') {
                direction = 'y-'
            }
            break;
    }
}
}

/**
 * Функция генерации игрового поля
 */
function prepareGameField() {
    // Создаём таблицу
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table ');
    // Генерация ячеек игровой таблицы
    for (var i = 0; i < FIELD_SIZE_X; i++) {
        // Создание строки
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;
        for (var j = 0; j < FIELD_SIZE_Y; j++) {
            // Создание ячейки
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;
            row.appendChild(cell); // Добавление ячейки
        }
        game_table.appendChild(row); // Добавление строки
    }
    document.getElementById('snake-field').appendChild(game_table); // Добавление таблицы
}

/**
 * Старт игры + генерации преград на поле / замыкание
 */
function startGame() {
    gameIsRunning = true;
    var wall_timer; // таймер между появлением преград
    var wall_speed = 6000; //интервал между созданием препятствий
    var SNAKE_SPEED = 220; // Интервал между перемещениями змейки
    var FOOD_SPEED = 6000; // Интервад между созданием еды
    var food_timer; // Таймер для еды
    
    respawn();//создали змейку
    createFood();//создали еду
    wall_timer = setInterval(newWall, wall_speed);  //каждые 5000мс запускается функция создания стен
    snake_timer = setInterval(move, SNAKE_SPEED);//каждые 200мс запускаем функцию move
    food_timer = setInterval(createFood, FOOD_SPEED);
       
        //функция генерации преград на поле
        function newWall() { 
        var wallCreated = false;
        var wall = []; // дополнительное препятствие на поле
        while (!wallCreated) { //пока препятствие не создали
            // рандом для получения координат препятствий на поле
            var wall_x = Math.floor(Math.random() * FIELD_SIZE_X);
            var wall_y = Math.floor(Math.random() * FIELD_SIZE_Y);
            var wall_cell = document.getElementsByClassName('cell-' + wall_y + '-' + wall_x)[0];
            var wall_cell_classes = wall_cell.getAttribute('class').split(' ');
            // проверка на змейку
            if (!wall_cell_classes.includes('snake-unit') && !wall_cell_classes.includes('food-unit')) {
                var classes = '';
                for (var i = 0; i < wall_cell_classes.length; i++) {
                    classes += wall_cell_classes[i] + ' ';
                }
                wall_cell.setAttribute('class', classes + 'wall-unit');
                wallCreated = true;
            }
        }
}
}

/**
 * Функция расположения змейки на игровом поле
 */
function respawn() {
    // Змейка - массив td
    // Стартовая длина змейки = 2
    // Respawn змейки из центра
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);
    // Голова змейки
    var snake_head = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x)[0];
    snake_head.setAttribute('class', snake_head.getAttribute('class') + ' snake-unit');
    // Тело змейки
    var snake_tail = document.getElementsByClassName('cell-' + (start_coord_y-1) + '-' + start_coord_x)[0];
    snake_tail.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');
    snake.push(snake_head);
    snake.push(snake_tail);
}
/**
 * Движение змейки
 */
function move() {
    // Сборка классов
    var snake_head_classes = snake[snake.length-1].getAttribute('class').split(' ');
    // Сдвиг головы
    var new_unit;
    var snake_coords = snake_head_classes[1].split('-');//преобразовали строку в массив
    var coord_y = parseInt(snake_coords[1]); 
    var coord_x = parseInt(snake_coords[2]);
    // Определяем новую точку
if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1))[0];
}
    else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1))[0];
}
    else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x))[0];
}
    else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x))[0];
}
    if (new_unit === undefined) {
        new_unit = jump(coord_y, coord_x);

            function jump(coord_y,coord_x) { //движение за границу поля
        var unit;
        if (direction == 'x-') {
            unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (FIELD_SIZE_X-1))[0];
        }
        else if (direction == 'x+') {
            unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (0))[0];
        }
        else if (direction == 'y+') {
            unit = document.getElementsByClassName('cell-' + (FIELD_SIZE_Y-1) + '-' + (coord_x))[0];
        }
        else if (direction == 'y-') {
            unit = document.getElementsByClassName('cell-' + (0) + '-' + (coord_x))[0];
        }
        return unit;
}
    }
    if (!haveFood(new_unit)) {
        // Находим хвост
        var removed = snake.splice(0, 1)[0];
        var classes = removed.getAttribute('class').split(' ');
        // удаляем хвост
        removed.setAttribute('class', classes[0] + ' ' + classes[1]);
    }
    // Проверки:
    // 1) new_unit не часть змейки
    // 2) не врезались в препятствие
    if (!isSnakeUnit(new_unit) && pathClear(new_unit)) {
        // Добавление новой части змейки
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);
    }
    else {
        finishTheGame();
    }
}

/**
 * Функция проверки, не врезались ли мы в преграду
 * @param unit
 */
function pathClear(unit) {
    var check = false;
    var unit_classes = unit.getAttribute('class').split(' ');
    if (!unit_classes.includes('wall-unit')) {
        check = true;
    }
    return check;
}

/**
 * Проверка на змейку
 * @param unit
 * @returns {boolean}
 */
function isSnakeUnit(unit) {//проверка, что змейка не попала сама в себя в новой ячейке
    var check = false;
    if (snake.includes(unit)) {//если в змейке содержится новая ячейка, значит возникло пересечение
        check = true;
    }
    return check;
}
/**
 * проверка на еду
 * @param unit
 * @returns {boolean}
 */
function haveFood(unit) {
    var check = false;
    var unit_classes = unit.getAttribute('class').split(' ');
    // Если еда
    if (unit_classes.includes('food-unit')) {
        check = true;
        createFood();
        score++;
//функция вывода счетчика заработанных очков
function count() {
    var gameCount = document.getElementById('game-count');
    gameCount.innerText = score;
}
    count(); //запускается функция счетчика заработанных очков
}
    return check;
}

/**
 * Создание еды
 */
function createFood() {
    var foodCreated = false;
    while (!foodCreated) { //пока еду не создали
        // рандом
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);
        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');
        // проверка на змейку
        if (!food_cell_classes.includes('snake-unit')) {
            var classes = '';
            for (var i = 0; i < food_cell_classes.length; i++) {
                classes += food_cell_classes[i] + ' ';
            }
            food_cell.setAttribute('class', classes + 'food-unit');
            foodCreated = true;
        }
    }
}

/**
 * Функция завершения игры
 */
function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    var gameEnd = document.getElementById('count');
    gameEnd.innerHTML = 'Вы проиграли! Ваш результат: '+score;
    gameEnd.style.fontSize = "32px";
    gameEnd.style.color = "red";
}

/**
 * Новая игра
 */
function refreshGame() {
    location.reload();
}

// Инициализация
window.onload = init;