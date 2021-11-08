import './App.css';
import {createRef, useState} from "react";

import * as Y from "yjs";


const doc1 = new Y.Doc();


function App() {

  const yarray = doc1.getArray("myarray");
  const [array, setArray] = useState([]);
  const arrayInputRef = createRef();
  const [YArrayIsUsed, setYArrayIsUsed] = useState(false);

  const addToArray = () => {
    // console.log('addToarray before start');
    setYArrayIsUsed(true);
    const newValue = arrayInputRef.current.value.trim();
    if (newValue && newValue !== "" && !array.includes(newValue)) {
      setArray([...array, newValue]);
      yarray.push([newValue]);
      arrayInputRef.current.value = "";
    }
    setYArrayIsUsed(false);
    // console.log('addToarray after end');
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
    setYArrayIsUsed(true);
    setArray(prevState => prevState.filter(e => e !== element));
    yarray.delete(index);
    setYArrayIsUsed(false);
  }

  yarray.observe((event) => {
    // console.log("observe");
    // console.log("delta:", event.changes.delta);
    // console.log("yarray.toArray", yarray.toArray());
    if (!YArrayIsUsed) {
      setArray(yarray.slice());
    }
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
