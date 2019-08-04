//функция генерации случайных координат от 0 до 3
function generateNumber() {
	let x = Math.floor(0 + Math.random() * (3 + 1)),
			y =	Math.floor(0 + Math.random() * (3 + 1));
	return [x, y];
};

//функция генерации новой ячейки на поле
function createNumber() {	
	//массив со случайными координатами
	let numberCoordinates = generateNumber(),
	//ячейка находящаяся по случайно сгенерированным координатам
		number = document.querySelector('[data-posX = "' + numberCoordinates[0] + '"][data-posY = "' +
		numberCoordinates[1] + '"]');
	//цикл закончится тогда когда будет выбрана пустая ячейка 
	while(number.getAttribute('data-number') != 0) {
		numberCoordinates = generateNumber();
		number = document.querySelector('[data-posX = "' + numberCoordinates[0] + '"][data-posY = "' +
			numberCoordinates[1] + '"]');
	};

	//занесение начальнх данных в пустую ячейку
	number.innerHTML = 2;
	number.setAttribute('data-number', '2');
};

//обработка события клика на кнопку
document.addEventListener('click', function (event) {
	//проверка на то нажата ли нужная кнопка
	if (!event.target.classList.contains('start-game')) return;

	//массив со всеми ячейками
	let elements = document.getElementsByClassName('element');

	//обнуление всех ячеек
	for(let i = 0; i < elements.length; i++) {
		elements[i].innerHTML = "";
		elements[i].setAttribute('data-number', '0'); 
		//установка фиксированной высоты (квадрат)
		elements[i].style.height = elements[i].clientWidth + "px";
	}

	//генерация новой ячейки
	createNumber();
});

//функция поиска элемента по указанным координатам
function findElem(x, y) {
	return document.querySelector('[data-posX = "' + x + '"][data-posY = "' + y + '"]');
}

//функция приведения атрибутов data-sum и data-move к стандартному виду 
function sumAbort() {
	let elemSum = document.querySelectorAll('[data-sum = "false"]'),
			elemMove = document.querySelectorAll('[data-move = "false"]');
	for(let i = 0; i < elemSum.length; i++) 
		elemSum[i].setAttribute("data-sum", "true");
	for(let i = 0; i < elemMove.length; i++) 
		elemMove[i].setAttribute("data-move", "true");
}

//функция удаления пустых ячеек по направлению движения
function delZero(x, y, direction) {
	//массив элементов из выбранной строки
	let elems = [];
	//выбор направления перемещения
	if (direction == "right") {
		elems.push(findElem(x, y));
		elems.push(findElem(x - 1, y));
	} else if (direction == "left") {
		elems.push(findElem(x - 1, y));
		elems.push(findElem(x, y));
	} else if (direction == "down") {
		elems.push(findElem(x, y))
		elems.push(findElem(x, y - 1));
	} else if (direction == "up") {
		elems.push(findElem(x, y - 1));
		elems.push(findElem(x, y));
	}
	//в случае если у ячейки по выбранному направлению есть пустая ячейка 
	if (elems[0].innerHTML == "" && elems[1].innerHTML != "") {
		//занесение значения из ячейки в переменную и в пустую ячейку
		let sum = elems[1].getAttribute("data-number");
		elems[0].setAttribute("data-number", sum);
		if (sum == 0) {
			elems[0].innerHTML = "";
		} else {
			elems[0].innerHTML = sum;
		} 
		//обнуление выбранной ячейки
		elems[1].innerHTML = "";
		elems[1].setAttribute("data-number", 0);
		//тригер на, то что произошло движение
		elems[1].setAttribute("data-move", "false");
	}
}

//функция перемещения элементов
function moveElem(i, j, direction) {
	//массив элементов из выбранной строки
	let elems = [];
	//занесение начального элемента в массив
	elems.push(findElem(i, j));
	//выбор направления и занесение в массив дополнительных элементов
	if (direction == "right") {
		elems.push(findElem(i + 1, j));
		if (i <= 1) elems.push(findElem(i + 2, j));
	} else if (direction == "left") {
		elems.push(findElem(i - 1, j));
		if (i >= 2) elems.push(findElem(i - 2, j));
	} else if (direction == "down") {
		elems.push(findElem(i, j + 1));
		if (j <= 1) elems.push(findElem(i, j + 2));
	} else if (direction == "up") {
		elems.push(findElem(i, j - 1));
		if (j >= 2) elems.push(findElem(i, j - 2));
	}; 
	//условия для суммирования двух одинаковых ячеек
	if ((elems[0].getAttribute("data-number") == elems[1].getAttribute("data-number")) && 
			(elems[0].getAttribute("data-number") != 0 && elems[1].getAttribute("data-number") != 0) && 
			(elems[0].getAttribute("data-sum") == "true" && elems[1].getAttribute("data-sum") == "true")) {
		//переменная с значением выбранной ячейки
		let sum = elems[1].getAttribute("data-number");
		//победа
		if (sum == 2048) {
			alert("Поздравляю! Вы выиграли!");
			//переменная хранящая кнопку "начать игру"
			let button = document.getElementsByClassName('start-game')[0];
			//генерация клика на кнопку
			button.click();
		}
		//функция сумирования одинаковых элементов по направлению движения
		function sumElem(i) {
			//суммирование и занесение данных в ячейку
			sum *= 2;
			elems[1 + i].setAttribute("data-number", sum);
			//тригер на, то что произошло суммирование
			elems[1 + i].setAttribute("data-sum", false);
			elems[1 + i].innerHTML = sum;
			elems[1 + i].setAttribute('data-anim', 'eats');
			//обнуление второй ячейки
			elems[0 + i].setAttribute("data-number", 0);
			elems[0 + i].innerHTML = "";
		}

		//условия, если стоят 3 одинаковых элемента в ряд
		if (elems[2]) {
			if (elems[2].getAttribute("data-number") == sum) {
				sumElem(1);
			//прочие случаи
			} else {
				sumElem(0);
			}
		//прочие случаи
		} else {
			sumElem(0);
		}
	//если суммирование не нужно, то вызов функции по удалению пустых ячеек на пути движения
	} else {
		if (direction == "right") {
			delZero(1, j, direction);
			delZero(2, j, direction);
			delZero(3, j, direction);
		} else if (direction == "left") {
			delZero(3, j, direction);
			delZero(2, j, direction);
			delZero(1, j, direction);
		} else if (direction == "down") {
			delZero(i, 1, direction);
			delZero(i, 2, direction);
			delZero(i, 3, direction);
		} else if (direction == "up") {
			delZero(i, 3, direction);
			delZero(i, 2, direction);
			delZero(i, 1, direction);
		}
	}
}

//событие на клавиши перемещения
document.addEventListener('keydown', function (event) {
	//проверка на нажатие необходимых клавиш
	if (event.keyCode < 37 || event.keyCode > 40) return;

	//если нажата стрелочка ← 
	if (event.keyCode == 37) {
		for(let j = 0; j < 4; j++) {
			for(let i = 3; i > 0; i--) {
				moveElem(i, j, "left");
			}
			delZero(3, j, "left");
			delZero(2, j, "left");
			delZero(1, j, "left");
		}		
	}
	//если нажата стрелочка ↑
	if (event.keyCode == 38) {
		for(let j = 3; j > 0; j--)
			for(let i = 0; i < 4; i++) {
				moveElem(i, j, "up");
				delZero(i, 3, "up");
				delZero(i, 2, "up");
				delZero(i, 1, "up");
			}
	}
	//если нажата стрелочка →
	if (event.keyCode == 39) {
		for(let j = 0; j < 4; j++) {
			for(let i = 0; i < 3; i++) {
				moveElem(i, j, "right");
			}
			delZero(1, j, "right");
			delZero(2, j, "right");
			delZero(3, j, "right");
		}	
	}
	//если нажата стрелочка ↓
	if (event.keyCode == 40) {
		for(let j = 0; j < 3; j++)
			for(let i = 0; i < 4; i++) {
				moveElem(i, j, "down");
				delZero(i, 1, "down");
				delZero(i, 2, "down");
				delZero(i, 3, "down");
			}
	}

	//генерация новой ячейки, если произошло действие
	if (document.querySelector('[data-sum = "false"]') || document.querySelector('[data-move = "false"]')) {
		createNumber();
	} 
	//вызов функции для занесения в определенные атрибуты значений по умолчанию
	sumAbort();

	//проверка на то осталось может ли игра дальше продолжаться
	if(!document.querySelector('[data-number = "0"]')) {
		endGame();
	}
});

//фунция проверки на конец игры 
//поиск ввозможных комбинаций во всех направлениях,
//если находится хоть одна, то игра продолжается, иначе конец игры
function endGame() {
	//тригер на наличие комбинаций
	let check;
	//проверка на нажатие стрелочки ← 
	for(let j = 0; j < 4; j++)
		for(let i = 3; i > 0; i--) {
			check = endGameCheck(i, j, "left");
			//есть комбинация
			if (check) return;
		} 		
	//проверка на нажатие стрелочки ↑
	for(let j = 3; j > 0; j--)
		for(let i = 0; i < 4; i++) {
			check = endGameCheck(i, j, "up");
			//есть комбинация
			if (check) return;
		}
	//проверка на нажатие стрелочки →
	for(let j = 0; j < 4; j++)
		for(let i = 0; i < 3; i++) {
			check = endGameCheck(i, j, "right");
			//есть комбинация
			if (check) return;
		}
	//проверка на нажатие стрелочки ↓
	for(let j = 0; j < 3; j++)
		for(let i = 0; i < 4; i++) {
			check = endGameCheck(i, j, "down");
			//есть комбинация
			if (check) return;
		}
	//комбинаций нет
	if (!check) {
		alert("Игра окончена!");
		//переменная хранящая кнопку "начать игру"
		let button = document.getElementsByClassName('start-game')[0];
		//генерация клика на кнопку
		button.click();
	}
}

//функция проверки на наличие суммируемых элементов
function endGameCheck (i, j, direction) {
	//массив элементов из выбранной строки
	let elems = [];
	//занесение начального элемента в массив
	elems.push(findElem(i, j));
	//выбор направления и занесение в массив дополнительных элементов
	if (direction == "right") {
		elems.push(findElem(i + 1, j));
	} else if (direction == "left") {
		elems.push(findElem(i - 1, j));
	} else if (direction == "down") {
		elems.push(findElem(i, j + 1));
	} else if (direction == "up") {
		elems.push(findElem(i, j - 1));
	}; 
	//проверка на наличие элементов, которые можно суммировать
	if ((elems[0].getAttribute("data-number") == elems[1].getAttribute("data-number")) && 
			(elems[0].getAttribute("data-number") != 0 && elems[1].getAttribute("data-number") != 0) && 
			(elems[0].getAttribute("data-sum") == "true" && elems[1].getAttribute("data-sum") == "true")) {
		//элемент есть
		return true;
	} else {
		//элемента нет
		return false;
	}
}

