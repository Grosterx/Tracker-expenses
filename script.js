// 1. МАССИВ ДЛЯ ХРАНЕНИЯ РАСХОДОВ
let expenses = [];
let currentFilter = 'all'; 

// 2. ФУНКЦИЯ ДОБАВЛЕНИЯ РАСХОДА
function addExpense(description, amount, category) {
    const expense = {
        id: Date.now(),
        description: description,
        amount: parseFloat(amount), 
        category: category,
        date: new Date().toLocaleString() 
    };
    expenses.push(expense);
    saveToLocalStorage();
    displayExpenses();
    updateTotal();
}

// 3. ФУНКЦИЯ ОТОБРАЖЕНИЯ РАСХОДОВ
function displayExpenses(expensesToShow = expenses) {
    const container = document.getElementById('expensesList');
    container.innerHTML = '';
    expensesToShow.forEach(expense => {
        const card = createExpenseCard(expense); 
        container.appendChild(card); 
    });
}

// 4. ФУНКЦИЯ СОЗДАНИЯ КАРТОЧКИ РАСХОДА
function createExpenseCard(expense) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-3';
    card.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${expense.description}</h5>
                <p class="card-text">${expense.amount} руб.</p>
                <span class="badge badge-primary">${expense.category}</span>
                <button class="btn btn-danger btn-sm mt-2" onclick="deleteExpense(${expense.id})">Удалить</button>
            </div>
        </div>
    `;
    return card;
}

// 5. ФУНКЦИЯ УДАЛЕНИЯ РАСХОДА
function deleteExpense(id) {
    const index = expenses.findIndex(exp => exp.id === id); 
    if (index !== -1) {
        expenses.splice(index, 1);
        saveToLocalStorage(); 
        displayExpenses();
        updateTotal();
    }
}

// 6. ФУНКЦИЯ ПОДСЧЕТА ОБЩЕЙ СУММЫ
function calculateTotal() {
    const total = expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);
    return total;
}

// 7. ФУНКЦИЯ ОБНОВЛЕНИЯ ОТОБРАЖЕНИЯ СУММЫ
function updateTotal() {
    const total = calculateTotal();
    const totalElement = document.getElementById('totalAmount');
    totalElement.textContent = total + ' руб.';
}

// 8. ФУНКЦИЯ ФИЛЬТРАЦИИ ПО КАТЕГОРИИ
function filterByCategory(category) {
    if (typeof category !== 'string' || category.trim() === '') {
        console.error('Ошибка: категория должна быть непустой строкой.');
        return;
    }
    currentFilter = category;
    
    let filteredExpenses;
    
    if (category === 'all') {
        filteredExpenses = expenses;
    } else {
        filteredExpenses = expenses.filter(exp => exp.category === category);
    }
    displayExpenses(filteredExpenses);
}

// 9. ОБРАБОТЧИК ФОРМЫ
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expenseForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('descriptionInput').value.trim();
        const amount = document.getElementById('amountInput').value;
        const category = document.getElementById('categorySelect').value;
        if (!description || !amount || parseFloat(amount) <= 0) {
            alert('Заполните все поля корректно!');
            return;
        }
        addExpense(description, amount, category);
        form.reset();
    });
});

// 10. ОБРАБОТЧИКИ КНОПОК ФИЛЬТРАЦИИ
document.querySelectorAll('[data-category]').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        filterByCategory(category);
    });
});

// 11. LOCALSTORAGE (ДОПОЛНИТЕЛЬНО)
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('expenses');
    if (saved) {
        expenses = JSON.parse(saved);
        filterByCategory(currentFilter);
        updateTotal();
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
});
