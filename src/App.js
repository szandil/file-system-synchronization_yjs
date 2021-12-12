import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";
import { useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Main from "./Main/Main";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";

function App() {

  const [metaData, filesystem, projectMethods] = useYProjectStructure();
  const [activeFilePath, setActiveFilePath] = useState([]);
  // console.log('data1', data);
  useEffect(() => {
    // projectMethods.addFile('file1.js');
    // projectMethods.addFile('file2.js');
    // projectMethods.addFile('file3.js');
  }, []);


  let buttons = [];
  let path = [];
  for(const [key] of Object.entries(filesystem)) {
    path = [key];
    buttons.push({'key': key,'path': path});
  }

  const [fileInd, setFileInd] = useState(0);

  return (
    <div className="all">
      <div className="filenav">
        <div className="list-group list-group-flush">
          {buttons.map(file =>
            <div key={file.key} className={'fileButton'}>
              <button
                type="button"
                id={`list-btn-${file.key}`}
                className={`list-group-item list-group-item-action ${activeFilePath.toString() === file.path.toString() ? 'active' : ''}`}
                onClick={() => {
                  setActiveFilePath(file.path)
                }}>
                {file.key}
              </button>
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={() => {
                  projectMethods.deleteFile(file.path.toString());
                  if (activeFilePath.toString() === file.path.toString()) {
                    setActiveFilePath(buttons[0].path);
                  }
                  projectMethods.logData();
                }
                }/>
            </div>
          )}
        </div>

      </div>
      <div className="main-content">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
          projectMethods.addFile('test' + fileInd + '.js');
          setFileInd(prevState => ++prevState);
          projectMethods.logData();
        }}>Add test file #{fileInd}</button>
        <Main activeFilePath={activeFilePath} projectMethods={projectMethods}/>
      </div>
    </div>
  );
}

export default App;
