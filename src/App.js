import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";
import {useEffect, useState} from "react";
import Main from "./Main/Main";


// const _logData = (d) => {
//   for(const prop in d) {
//     console.log(prop, d[prop]);
//     if (typeof d[prop] === 'object') {
//       _logData( d[prop]);
//     }
//   }
// }

function App() {

  const [metaData, filesystem, projectMethods] = useYProjectStructure();
  const [activeFilePath, setActiveFilePath] = useState([]);
  // console.log('data1', data);
  useEffect(() => {
    projectMethods.addFile('file1.js');
    projectMethods.addFile('file2.js');
    projectMethods.addFile('file3.js');
  }, []);
  // console.log('data2', data);


  let buttons = [];
  let path = [];
  for(const [key] of Object.entries(filesystem)) {
    path = [key];
    buttons.push({'key': key,'path': path});
  }
  console.log('data', filesystem);


  // https://mui.com/components/tree-view/#basic-tree-view
  // https://github.com/chenglou/react-treeview/blob/master/demos/controlled.js
  return (
    <div className="all">
      <div className="filenav">
        <div className="list-group list-group-flush">
          {buttons.map(file =>
          <button
            type="button"
            key={file.key}
            id={`list-btn-${file.key}`}
            className={`list-group-item list-group-item-action ${activeFilePath.toString()===file.path.toString() ? 'active' : ''}`}
            onClick={() => {
              setActiveFilePath(file.path)
              console.log(file.path.toString());
              console.log('fs', filesystem);
              console.log('md', metaData);
            }}
            >
          {file.key}
            </button>
          )}
        </div>

      </div>
      <div className="main-content">
        <Main activeFilePath={activeFilePath} projectMethods={projectMethods}/>
      </div>
    </div>
  );
}

export default App;
