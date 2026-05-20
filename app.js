const expenseForm = document.querySelector("#expenseForm");
const dateInput = document.querySelector("#dateInput");
const categoryInput = document.querySelector("#categoryInput");
const amountInput = document.querySelector("#amountInput");
const noteInput = document.querySelector("#noteInput");
const recordList = document.querySelector("#recordList");
const totalExpense = document.querySelector("#totalExpense");
const recordCount = document.querySelector("#recordCount");

let records = [];
let nextRecordId = 1;

function formatCurrency(amount) {
  return `$${amount.toLocaleString("en-US")}`;
}

function calculateTotal() {
  return records.reduce((sum, record) => sum + record.amount, 0);
}

function renderSummary() {
  totalExpense.textContent = formatCurrency(calculateTotal());
  recordCount.textContent = `${records.length} 筆支出`;
}

function createRecordItem(record) {
  const item = document.createElement("li");
  item.className = "record-item";

  const recordText = document.createElement("span");
  recordText.className = "record-text";
  recordText.textContent = `${record.date}｜${record.category}｜${formatCurrency(
    record.amount,
  )}｜${record.note}`;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "刪除";
  deleteButton.dataset.id = record.id;
  deleteButton.setAttribute(
    "aria-label",
    `刪除 ${record.date} ${record.category} ${record.note}`,
  );

  item.append(recordText, deleteButton);

  return item;
}

function renderRecords() {
  recordList.textContent = "";

  if (records.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "尚無記帳資料";
    recordList.append(emptyItem);
    renderSummary();
    return;
  }

  records.forEach((record) => {
    recordList.append(createRecordItem(record));
  });

  renderSummary();
}

function resetForm() {
  expenseForm.reset();
  dateInput.focus();
}

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);
  const note = noteInput.value.trim();
  noteInput.setCustomValidity("");

  if (!note) {
    noteInput.setCustomValidity("請輸入備註");
  }

  if (
    !dateInput.value ||
    !categoryInput.value ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    !note
  ) {
    expenseForm.reportValidity();
    return;
  }

  records.push({
    id: String(nextRecordId),
    date: dateInput.value,
    category: categoryInput.value,
    amount,
    note,
  });
  nextRecordId += 1;

  renderRecords();
  resetForm();
});

recordList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  records = records.filter((record) => record.id !== deleteButton.dataset.id);
  renderRecords();
});

renderRecords();
