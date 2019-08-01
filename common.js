function generateNumber() {
	let x = Math.floor(1 + Math.random() * 4),
			y =	Math.floor(1 + Math.random() * 4);
	return [x, y];
};

function createNumber(event) {
	let numberCoordinates = generateNumber();
	let number = document.querySelector('[data-posX = "' + numberCoordinates[0] + '"][data-posY = "' +
	numberCoordinates[1] + '"]');

	while(number.getAttribute('data-number') == '0') {
		numberCoordinates = generateNumber();
		number = document.querySelector('[data-posX = "' + numberCoordinates[0] + '"][data-posY = "' +
		numberCoordinates[1] + '"]');
	};

	number.innerHTML = 2;
	number.setAttribute('data-number', '2');
};

document.addEventListener('click', function (event) {
	if (!event.target.classList.contains('start-game')) return;

	let elements = document.getElementsByClassName('element');

	for(let i = 0; i < elements.length; i++) {
		elements[i].innerHTML = "";
		elements[i].setAttribute('data-number', ''); 
		elements[i].style.height = elements[i].clientWidth + "px";
	}

	createNumber();
});


