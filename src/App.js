import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";
import {useEffect, useState} from "react";

const _logData = (d) => {
  for(const prop in d) {
    console.log(prop, d[prop]);
    if (typeof d[prop] === 'object') {
      _logData( d[prop]);
    }
  }
}

function App() {

  const [data, projectMethods] = useYProjectStructure();
  // console.log('data1', data);
  useEffect(() => {
    projectMethods.addFile('file1.js');
    projectMethods.addFile('file2.js');
    projectMethods.addFile('file3.js');
    console.log(data);
  }, []);
  // console.log('data2', data);

  const logData = () => {
    _logData(data)
  };

  let buttons = [];
  for(const [key, value] of Object.entries(data.filesystem)) {
    buttons.push(<button onClick={() => console.log(value)}>{key}</button>);
  }


  // https://mui.com/components/tree-view/#basic-tree-view
  // https://github.com/chenglou/react-treeview/blob/master/demos/controlled.js
  return (
    <div className="container">
      <div className="filenav">
        {JSON.stringify(data.filesystem)}
        <button onClick={logData} className='btn btn-primary'>Click me!</button>
        <hr/>
        {buttons.map(btn => btn)}
      </div>
      <div className="main-content">Main</div>
    </div>
  );
}

export default App;
