//BUDGET CONTROLLER
var budgetController = (function() {

/*//Private variable
	var x = 23;

//Private function
	var add = function(a){
		return x + a;
	}

//Public function which can use private functions
//Because of closures inner function has an access to variables and functions of outter function
	return {
		publicTest: function(b){
			return add(b);
		}
	}*/


	//START


})();

//UI CONTROLLER
var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	}

	return {
		getInput: function() {
			return {
				 type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
				 description: document.querySelector(DOMstrings.inputDescription).value,
				 value: document.querySelector(DOMstrings.inputValue).value
			}
		},

		getDOMstrings: function() {
            return DOMstrings;
        }
	};

})();

//Here  we pass our earlier created objects as arguments with different name to make controller module more independent

//GLOGAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {

		//Creating a reaction on pressing the 'enter' button; .which method for older browsers
		if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};


	var ctrlAddItem = function() {
		// 1. Get the field input data
		var input = UICtrl.getInput();

		// 2. Add the item to the budget controller

		// 3. Add the item to the UI

		// 4. Calculate the budget

		// 5. Display the budget on the UI

	};

	return {
		init: function() {
			console.log('Application has started.');
			setupEventListeners();
		}
	}

})(budgetController, UIController);

controller.init();










