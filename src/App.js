import './App.css';
import {createRef, useState} from "react";

import * as Y from "yjs";


const doc1 = new Y.Doc();


function App() {

  const yarray = doc1.getArray("myarray");
  const [array, setArray] = useState([]);
  const arrayInputRef = createRef();

  const addToArray = () => {
    const newValue = arrayInputRef.current.value.trim();
    if (newValue && newValue !== "" && !array.includes(newValue)) {
      yarray.push([newValue]);
      arrayInputRef.current.value = "";
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") {
      addToArray();
    }
  }

  const deleteFromYArray = (index) => {
    yarray.delete(index);
  };

  const deleteFromArray = (element, index) => {
    setArray(prevState => prevState.filter(e => e !== element));
    yarray.delete(index);
  }

  yarray.observe((event) => {
      setArray(yarray.slice());
  });

  return (
    <div className="container">
      <div className="row m-5">
        <div className="col-6">

          <input
            type="text"
            className={`form-control mb-3 arrayInput`}
            ref={arrayInputRef}
            onKeyDown={onInputKeyDown}
          />
          <button className="btn btn-primary" onClick={addToArray}>Add to react array</button>
        </div>
        <div className="row">

          <div className="col-6">
            <h4 className="mt-2">React array</h4>
            <ul>
              {array.map((element, index) =>
                <li key={element} className="arrayLi">{element}<span className="deleteSpan" onClick={() => deleteFromArray(element, index)}>-</span></li>
              )}
            </ul>
          </div>
          <div className="col-6">
            <h4 className="mt-2">Yarray</h4>
            <ul>
              {yarray.toArray().map((element, index) =>
                <li key={`y${element}`} className="arrayLi">{element}<span onClick={() => deleteFromYArray(index)} className="deleteSpan">-</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
