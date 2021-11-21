import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";
import {useEffect} from "react";

// const _logData = (d) => {
//   for(const prop in d) {
//     console.log(prop, d[prop]);
//     if (typeof d[prop] === 'object') {
//       _logData( d[prop]);
//     }
//   }
// }

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


  let buttons = [];
  for(const [key, value] of Object.entries(data.filesystem)) {
    buttons.push({'key': key,'value': value});
  }

  const setActiveListBtn = (key) => {
    let actives = document.getElementsByClassName('list-group-item active');
    for(let activeClass of actives) {
      activeClass.classList.remove('active');
    }
    document.getElementById(`list-btn-${key}`).classList.add('acitve');
  }


  // https://mui.com/components/tree-view/#basic-tree-view
  // https://github.com/chenglou/react-treeview/blob/master/demos/controlled.js
  return (
    <div className="container">
      <div className="filenav">
        <div className="list-group">
          {buttons.map(file =>
          <button
            type="button"
            key={file.key}
            id={`list-btn-${file.key}`}
            className="list-group-item list-group-item-action"
            onClick={() => {
              setActiveListBtn(file.key)
              console.log(file.value)
            }}
            >
          {file.key}
            </button>
          )}
        </div>

      </div>
      <div className="main-content">Main</div>
    </div>
  );
}

export default App;
