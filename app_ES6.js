
//Clasees for expence and income
class Expense {
	constructor (id, description, value)
		{
			this.id = id;
			this.description = description;
			this.value = value;
			this.percentage = -1;
		}

	calcPercentage(totalIncome) {
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);

		} else {
			this.percentage = -1;
		}
	};

	getPercentage() {
		return this.percentage;
	};
};

class Income {
	constructor(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}
}

//BUDGET CONTROLLER
class budgetController {
	constructor(Expense, Income) {
		this.Expense = Expense;
		this.Income = Income;

// the data structure where we will store all expencies and incomes objects;
		this.data = {
			allItems: {
			exp: [],
			inc: []
			},

			totals: {
				exp: 0,
				inc: 0
			},

			budget: 0,
			percentage: -1
		}

		
	}

	addItem(type, des, val) {
			let newItem, ID;

			//[1 2 3 4 5], next ID = 6
			//[1 2 4 6 8], next ID = 9
			// ID = last ID + 1;

			// Create new ID
			if(this.data.allItems[type].length > 0){
				ID = this.data.allItems[type][this.data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			
			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new this.Expense(ID, des, val);
			} else if (type === 'inc'){
				newItem = new this.Income(ID, des, val);
			}

			// Push it into our data structure
			this.data.allItems[type].push(newItem);

			console.log(newItem);
			// Return the new element
			return newItem;
		}

	deleteItem(type, id) {
			let ids, index;

			// id = 6
			// [1 2 4 6 8]
			//index = 3

			// map method is like an foreach, but the difference is that map return a brand new array;
			ids = this.data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1){
				// in splice method the first position is where we want to start deleting, the next argument is a number of elements that we want to delete;
				this.data.allItems[type].splice(index, 1);
			}

	}

	calculateTotal(type) {
			let sum = 0;
			this.data.allItems[type].forEach((cur) => {
				sum += cur.value;
			});
			this.data.totals[type] = sum;
		}

	calculateBudget() {

			// calculate total income and expenses
			this.calculateTotal('exp');
			this.calculateTotal('inc');

			// Calculate the budget: income-expenses
			this.data.budget = this.data.totals.inc - this.data.totals.exp;

			// calculate the percentage of income that we spent
			if(this.data.totals.inc > 0) {
				this.data.percentage = Math.round((this.data.totals.exp / this.data.totals.inc) * 100);
			} else {
				this.data.percentage = -1;
			}
			
			// Expence = 100 and income 200, spent 50% = 100 / 200 = 0.5*100
		}


	calculatePercentages() {

			/*
			a=20
			b=10
			c=40
			income = 100
			a=20/100=20%
			b=10/100=10%
			c=40/100=40%
			*/

			this.data.allItems.exp.forEach((cur) => {
				cur.calcPercentage(this.data.totals.inc);
			});
		}

		getPercentages() {
				let allPerc = this.data.allItems.exp.map((cur) => {
					return cur.getPercentage();
				});
				return allPerc;
			}
		
		getBudget() {
				return {
					budget: this.data.budget,
					totalInc: this.data.totals.inc,
					totalExp: this.data.totals.exp,
					percentage: this.data.percentage
				}
			}
};


//UI CONTROLLER
class UIController {
	constructor() {
		
	}

	DOMstring(query) {
			let DOMString = new Map();
			DOMString.set('inputType', '.add__type');
			DOMString.set('inputDescription', '.add__description');
			DOMString.set('inputValue', '.add__value');
			DOMString.set('inputBtn', '.add__btn');
			DOMString.set('incomeContainer', '.income__list');
			DOMString.set('expensesContainer', '.expenses__list');
			DOMString.set('budgetLabel', '.budget__value');
			DOMString.set('incomeLabel', '.budget__income--value');
			DOMString.set('expensesLabel', '.budget__expenses--value');
			DOMString.set('percentageLabel', '.budget__expenses--percentage');
			DOMString.set('container', '.container');
			DOMString.set('expensesPercLabel', '.item__percentage');
			DOMString.set('dateLabel', '.budget__title--month');
			//DOMString.set('Exception', console.log('No key was input'));
			//console.log(DOMString.get(query));
			return DOMString.get(query);
		}

	formatNumber(num, type) {
			let numSplit, int, dec, sign;
			/*
			+ or - before number
			exactly 2 decimal points
			comma separation the thousands

			2310.4567 -> + 2,310.46
			2000 -> + 2,000.00
			*/

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');

			int = numSplit[0];
			if(int.length > 3) {
				int = int.substr(0 , int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 2310, output 2,310
			}
			
			dec = numSplit[1];

			return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
		}	

	// Here we create a function to iterate through of list !!!
	nodeListForEach(list, callback){
		for (let i = 0; i < list.length; i++){
			callback(list[i], i);
		}
	}

	getInput() {
			return {
				 type: document.querySelector(this.DOMstring('inputType')).value, // Will be either inc or exp
				 description: document.querySelector(this.DOMstring('inputDescription')).value,
				 value: parseFloat(document.querySelector(this.DOMstring('inputValue')).value)// Will contain not a string but a number in the value field
			}
	}

	addListItem(obj, type) {
			let html, newHtml, element;

			// Create HTML string with placeholder text
			if(type === 'inc'){
				element = this.DOMstring('incomeContainer');
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if(type === 'exp'){
				element = this.DOMstring('expensesContainer');
				html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', this.formatNumber(obj.value, type));

			// Insert the HTMl into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		}

	deleteListItem(selectorID) {
			let el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		}

	clearFields() {			
			let fields, fieldsArr;

			// Fields variable will have a list inside
			fields = document.querySelectorAll(`${this.DOMstring('inputDescription')}, ${this.DOMstring('inputValue')}`);

			fieldsArr = Array.from(fields);

			// Here we have access to the current element, index of the current element and entire array.
			fieldsArr.forEach((current) => {
				current.value = "";
			});

			// Here we put the focus on the webpage to the add__description field.
			fieldsArr[0].focus();
	}

	displayBudget(obj) {
			let type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(this.DOMstring('budgetLabel')).textContent = this.formatNumber(obj.budget, type);
			document.querySelector(this.DOMstring('incomeLabel')).textContent = this.formatNumber(obj.totalInc, 'inc');
			document.querySelector(this.DOMstring('expensesLabel')).textContent = this.formatNumber(obj.totalExp, 'exp');
			

			if (obj.percentage > 0) {
				document.querySelector(this.DOMstring('percentageLabel')).textContent = obj.percentage + '%';
			} else{
				document.querySelector(this.DOMstring('percentageLabel')).textContent = '---';
			}
	}

	displayPercentages(percentages) {

			// Into fields will be returned not an array but node list
			let fields = document.querySelectorAll(this.DOMstring('expensesPercLabel'));

			this.nodeListForEach(fields,(current, index) => {
				if (percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
	}

	displayMonth() {
			let now, year, month, months;

			now = new Date();
			months = ['Январе', 'Феврале', 'Марте', 'Апреле', 'Мае', 'Июне', 'Июле', 'Августе', 'Сентяре', 'Октяре', 'Ноябре', 'Декабре'];
			month = now.getMonth();

			year = now.getFullYear();
			document.querySelector(this.DOMstring('dateLabel')).textContent = `${months[month]} ${year}`;

		}

	changedType() {

			let fields = document.querySelectorAll(
				`${this.DOMstring('inputType')},
				${this.DOMstring('inputDescription')},
				${this.DOMstring('inputValue')}`);
			
			this.nodeListForEach(fields,(cur) => {
				cur.classList.toggle('red-focus');
			});
			document.querySelector(this.DOMstring('inputBtn')).classList.toggle('red');
		}
	
};


//GLOBAL APP CONTROLLER
class controller {
	constructor(UICtrl, budgetCtrl, Expense, Income) {
		this.budgetCtrl = new budgetCtrl(Expense, Income);
		this.UICtrl = new UICtrl; 
	}

	setupEventListeners() {

		document.querySelector(this.UICtrl.DOMstring('inputBtn')).addEventListener('click',() => this.ctrlAddItem());

		document.addEventListener('keypress',(event) => {

		//Creating a reaction on pressing the 'enter' button; .which method for older browsers
		if (event.keycode === 13 || event.which === 13) {
				this.ctrlAddItem();
			}
		})

		document.querySelector(this.UICtrl.DOMstring('container')).addEventListener('click',(event) => this.ctrlDeleteItem(event));

		document.querySelector(this.UICtrl.DOMstring('inputType')).addEventListener('change', () => this.UICtrl.changedType());

	}

	updateBudget() {
		// 1. Calculate the budget
		this.budgetCtrl.calculateBudget();

		// 2. Return the budget
		let budget = this.budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		this.UICtrl.displayBudget(budget);
	}	

	updatePercentages() {

		// 1. Calculate percentages
		this.budgetCtrl.calculatePercentages();

		// 2. Read percentages grom the budget controller
		let percentages = this.budgetCtrl.getPercentages();

		// 3. Update the UI with the new percentages
		this.UICtrl.displayPercentages(percentages);
	}

	ctrlAddItem() {
		let input, newItem;

		// 1. Get the field input data
		input = this.UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0){
			// 2. Add the item to the budget controller
			newItem = this.budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			this.UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields
			this.UICtrl.clearFields();

			// 5 Calculate and update budget
			this.updateBudget();

			// 6. Calculate and update percentages
			this.updatePercentages();
		}
	}

	ctrlDeleteItem(event) {
		let itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if(itemID){

			//inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. Delete the item form the data structute
			this.budgetCtrl.deleteItem(type, ID);

			// 2. Delete the item form the UI
			this.UICtrl.deleteListItem(itemID);

			// 3. Update and show the new budget
			this.updateBudget();

			// 4. Calculate and update percentages
			this.updatePercentages();
		}
	}

	init() {
			console.log('Application has started.');
			this.UICtrl.displayMonth();
			this.UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			this.setupEventListeners();
		}
};

let controll = new controller(UIController, budgetController, Expense, Income);
controll.init();





















