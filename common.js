function generateNumber() {
	let x = Math.floor(0 + Math.random() * (3 + 1)),
			y =	Math.floor(0 + Math.random() * (3 + 1));
	return [x, y];
};

function createNumber() {
	if(!document.querySelector('[data-number = "0"]')) return alert("Игра окончена!");
	
	let numberCoordinates = generateNumber();
	let number = document.querySelector('[data-posX = "' + numberCoordinates[0] + '"][data-posY = "' +
		numberCoordinates[1] + '"]');

	while(number.getAttribute('data-number') != 0) {
		numberCoordinates = generateNumber();
		number = document.querySelector('[data-posX = "' + numberCoordinates[0] + '"][data-posY = "' +
			numberCoordinates[1] + '"]');
	};

	number.innerHTML = 2;
	number.setAttribute('data-number', '2');
	//alert(number.getAttribute("data-posX") + " " + number.getAttribute("data-posY"));
};

document.addEventListener('click', function (event) {
	if (!event.target.classList.contains('start-game')) return;

	let elements = document.getElementsByClassName('element');

	for(let i = 0; i < elements.length; i++) {
		elements[i].innerHTML = "";
		elements[i].setAttribute('data-number', '0'); 
		elements[i].style.height = elements[i].clientWidth + "px";
	}

	createNumber();
});

function findElem(x, y) {
	return document.querySelector('[data-posX = "' + x + '"][data-posY = "' + y + '"]');
}

function sumAbort() {
	let elemSum = document.querySelectorAll('[data-sum = "false"]'),
			elemMove = document.querySelectorAll('[data-move = "false"]');
	for(let i = 0; i < elemSum.length; i++) 
		elemSum[i].setAttribute("data-sum", "true");
	for(let i = 0; i < elemMove.length; i++) 
		elemMove[i].setAttribute("data-move", "true");
}

function delZero(x, y, direction) {
	let elems = [];
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
	if (elems[0].innerHTML == "" && elems[1].innerHTML != "") {
		let sum = elems[1].getAttribute("data-number");
		elems[0].setAttribute("data-number", sum);
		if (sum == 0) {
			elems[0].innerHTML = "";
			//alert(2);
		} else {
			elems[0].innerHTML = sum;
			//alert(3);
		} 
		elems[1].innerHTML = "";
		elems[1].setAttribute("data-number", 0);
		elems[1].setAttribute("data-move", "false");
	}
}

function moveElem(i, j, direction) {
	let elems = [];
	elems.push(findElem(i, j));
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
	if ((elems[0].getAttribute("data-number") == elems[1].getAttribute("data-number")) && 
			(elems[0].getAttribute("data-number") != 0 && elems[1].getAttribute("data-number") != 0) && 
			(elems[0].getAttribute("data-sum") == "true" && elems[1].getAttribute("data-sum") == "true")) {
		let sum = elems[1].getAttribute("data-number");
		
		function sumElem(i) {
			sum *= 2;
			elems[1 + i].setAttribute("data-number", sum);
			elems[1 + i].setAttribute("data-sum", false);
			elems[1 + i].innerHTML = sum;
			elems[0 + i].setAttribute("data-number", 0);
			elems[0 + i].innerHTML = "";
		}

		if (elems[2]) {
			if (elems[2].getAttribute("data-number") == sum) {
				sumElem(1);
			} else {
				sumElem(0);
			}
		} else {
			sumElem(0);
		}
		//alert(1);
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

document.addEventListener('keydown', function (event) {
	if (event.keyCode >= 37 && event.keyCode <= 40) {
		let elements = document.getElementsByClassName('element');
	} else {
		return;
	}

	//если нажата стрелочка ← 
	if (event.keyCode == 37) {
		for(let j = 0; j < 4; j++)
			for(let i = 3; i > 0; i--) {
				moveElem(i, j, "left");
			}
	}
	//если нажата стрелочка ↑
	if (event.keyCode == 38) {
		for(let j = 3; j > 0; j--)
			for(let i = 0; i < 4; i++) {
				moveElem(i, j, "up");
			}
	}
	//если нажата стрелочка →
	if (event.keyCode == 39) {
		for(let j = 0; j < 4; j++)
			for(let i = 0; i < 3; i++) {
				moveElem(i, j, "right");
			}
	}
	//если нажата стрелочка ↓
	if (event.keyCode == 40) {
		for(let j = 0; j < 3; j++)
			for(let i = 0; i < 4; i++) {
				moveElem(i, j, "down");
			}
	}
	if (document.querySelector('[data-sum = "false"]') || document.querySelector('[data-move = "false"]')) {
		//alert("gg");
		createNumber();
	} 
	sumAbort();
});



