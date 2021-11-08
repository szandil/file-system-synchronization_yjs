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
      setArray([...array, newValue]);
      yarray.push([newValue]);

      arrayInputRef.current.value = "";
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") {
      addToArray();
    }
  }

  yarray.observe((event) => {
    console.log("delta:", event.changes.delta);
    console.log("yarray.toArray", yarray.toArray());
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
              {array.map((element) =>
                <li key={element}>{element}</li>
              )}
            </ul>
          </div>
          <div className="col-6">
            <h4 className="mt-2">Yarray</h4>
            <ul>
              {yarray.toArray().map(element =>
                <li key={`y${element}`}>{element}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
