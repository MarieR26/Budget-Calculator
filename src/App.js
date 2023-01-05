import "./App.css";
import Alert from "./Components/Alert";
import ExpenseForm from "./Components/ExpenseForm";
import ExpenseList from "./Components/ExpenseList";
import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "car payment", amount: 1600 },
//   { id: uuid(), charge: "credit card bill", amount: 1600 },
// ];

// we are getting our items from local storage:
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  // ********** state values *************
  //all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState("");
  // single amount
  const [amount, setAmount] = useState("");
  // alert
  const [alert, setAlert] = useState({ show: false });

  // edit:
  const [edit, setEdit] = useState(false);

  // edit item: =
  const [id, setId] = useState(0);

  // ********** useEffect *************
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  // ********** functionality *************

  //handle alert:
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "Item Edited" });
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([singleExpense, ...expenses]);
        handleAlert({ type: "success", text: "Item Added" });
      }
      setCharge("");
      setAmount("");
    } else {
      //  alert called
      handleAlert({
        type: "danger",
        text: `charge can't be empty value, it has to be bigger than 0`,
      });
    }
  };

  //clear all items:
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "all items deleted" });
  };

  // handle delete:
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    console.log(tempExpenses);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "all items deleted" });
  };

  // handle edit:
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}

      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending:{" "}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
