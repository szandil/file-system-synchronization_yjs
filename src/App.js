import './App.css';
import {createRef, useState} from "react";




function App() {

  const [array, setArray] = useState([]);
  const arrayInputRef = createRef();

  const addToArray = () => {
    const newValue = arrayInputRef.current.value.trim();
    if (newValue && newValue !== "" && !array.includes(newValue)) {
      setArray([...array, newValue]);
      arrayInputRef.current.value = "";
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") {
      addToArray();
    }
  }

  return (
    <div className="container">
      <div className="container m-5">
        <input
          type="text"
          className={`form-control mb-3 arrayInput`}
          ref={arrayInputRef}
          onKeyDown={onInputKeyDown}
        />
        <button className="btn btn-primary" onClick={addToArray}>Add to array</button>
        <h4 className="mt-2">List of elements</h4>
        <ul>
          {array.map((element) =>
            <li key={element}>{element}</li>
          )}
        </ul>

      </div>
    </div>
  );
}

export default App;
