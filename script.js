'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  actionRequest: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  actionDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-01-15T23:36:17.929Z',
    '2021-01-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  actionRequest: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  actionDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  actionRequest: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  actionDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  actionRequest: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  actionDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS

const formatActionDates = function (transactionDate) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), transactionDate);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed < 7) return `${daysPassed} days ago`;

  const month = `${transactionDate.getMonth() + 1}`.padStart(2, 0);
  const day = `${transactionDate.getDate()}`.padStart(2, 0);
  const year = transactionDate.getFullYear();
  return `${month}/${day}/${year}`;
};

const displayActions = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const actionSort = sort
    ? account.actionRequest.slice().sort((a, b) => a - b)
    : account.actionRequest;

  actionSort.forEach(function (request, i) {
    const type = request > 0 ? 'deposit' : 'withdrawal';

    const transctionDate = new Date(account.actionDates[i]);
    const displayDate = formatActionDates(transctionDate);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${Math.abs(request).toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.actionRequest.reduce(
    (acc, request) => acc + request,
    0
  );
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (account) {
  const incoming = account.actionRequest
    .filter(request => request > 0)
    .reduce((acc, request) => acc + request, 0);

  labelSumIn.textContent = `${incoming.toFixed(2)}€`;

  const outgoing = account.actionRequest
    .filter(request => request < 0)
    .reduce((acc, request) => acc + request, 0);

  labelSumOut.textContent = `${Math.abs(outgoing.toFixed(2))}€`;

  const interest = account.actionRequest
    .filter(request => request > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function () {
  // Display movements
  displayActions(currentAccount);

  // Display balance
  calcDisplayBalance(currentAccount);

  // Display summary
  calcDisplaySummary(currentAccount);
};

// EVENT HANDLER
let currentAccount;

//FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// LOGIN FUNCTION
btnLogin.addEventListener('click', function (e) {
  // Prevents form from  submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;

    // Current Date
    const curDate = new Date();
    const month = `${curDate.getMonth() + 1}`.padStart(2, 0);
    const day = `${curDate.getDate()}`.padStart(2, 0);
    const year = curDate.getFullYear();
    const hour = `${curDate.getHours()}`.padStart(2, 0);
    const min = `${curDate.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// TRANSFER FUNCTION
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Transfering the money
    currentAccount.actionRequest.push(-amount);
    receiverAccount.actionRequest.push(amount);

    // Add transfer date
    currentAccount.actionDates.push(new Date().toISOString());
    receiverAccount.actionDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

// LOAN FUNCTION
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.actionRequest.some(mov => mov >= loanAmount * 0.1)
  ) {
    // Add action
    currentAccount.actionRequest.push(loanAmount);

    // Add loan date
    currentAccount.actionDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// CLOSING ACCOUNT FUNCTION
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // Check if correct credentials
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT FUNCTION
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayActions(currentAccount.actionRequest, !sorted);
  sorted = !sorted;
});
