import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import Main from "./Main/Main";
import {faChalkboardTeacher, faGraduationCap, faTrashAlt} from "@fortawesome/free-solid-svg-icons";

function App() {

  const [metaData, filesystem, isTeacher, projectMethods] = useYProjectStructure();
  const activeFilePath = metaData.activeFilePath ?? '';
  const isReadOnlyForStudents = metaData.isReadOnlyForStudents ?? false;
  // const [activeFilePath, setActiveFilePath] = useState([]);
  // console.log('data1', data);
  useEffect(() => {
    // projectMethods.addFile('file1.js');
    // projectMethods.addFile('file2.js');
    // projectMethods.addFile('file3.js');
  }, []);


  let buttons = [];
  let path = [];
  for (const [key] of Object.entries(filesystem)) {
    path = [key];
    buttons.push({'key': key, 'path': path});
  }

  const [fileInd, setFileInd] = useState(0);

  const handleStudentReadOnlyChange = (event) => {
    projectMethods.setReadonlyForStudents(event.target.checked);
  }

  return (
    <div className="all">
      <div className="file-nav">
        <div className="list-group list-group-flush">
          {buttons.map(file =>
            <div key={file.key} className={'file-button'}>
              <button
                type="button"
                id={`list-btn-${file.key}`}
                className={`list-group-item list-group-item-action ${activeFilePath.toString() === file.path.toString() ? 'active' : ''} no-select`}
                onClick={() => {
                  projectMethods.setActiveFile(file.path);
                  // setActiveFilePath(file.path)
                }}>
                {file.key}
              </button>
              <div className={`icon-div ${activeFilePath.toString() === file.path.toString() ? 'active' : ''}
              ist-group-item list-group-item-action`}
                   onClick={() => {
                     projectMethods.deleteFile(file.path.toString());
                     if (activeFilePath.toString() === file.path.toString()) {
                       projectMethods.setActiveFile(buttons[0].path);
                       // setActiveFilePath(buttons[0].path);
                     }
                     projectMethods.logData();
                   }}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className={`delete-icon ${activeFilePath.toString() === file.path.toString() ? 'active' : ''}`}
                />
              </div>
            </div>
          )}
        </div>

      </div>
      <div className="main-content">
        <div className={'top-part'}>
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                projectMethods.addFile('test' + fileInd + '.js');
                setFileInd(prevState => ++prevState);
                projectMethods.logData();
              }}>Add test file #{fileInd}</button>
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                projectMethods.logContributors();
              }}>Résztvevők log
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                projectMethods.deleteContributors();
              }}>Résztvevők törlése
            </button>
          </div>
          {isTeacher && <span className={'role no-select'}><FontAwesomeIcon icon={faChalkboardTeacher}/>  Tanár</span>}
          {!isTeacher && <span className={'role no-select'}><FontAwesomeIcon icon={faGraduationCap}/>  Diák</span>}
        </div>
        {isTeacher &&
          <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox" role="switch"
            id="flexSwitchCheckDefault"
            checked={metaData.isReadOnlyForStudents ?? false}
            onChange={handleStudentReadOnlyChange}/>
          <label className="form-check-label no-select" htmlFor="flexSwitchCheckDefault">Diákok számára csak olvasható</label>
        </div>}
        {!isTeacher && metaData.isReadOnlyForStudents && <h6 className={'text-center'}>A szerkesztést a tanár letiltotta!</h6>}
        <Main activeFilePath={activeFilePath} isReadOnly={isReadOnlyForStudents} projectMethods={projectMethods}/>
      </div>
    </div>
  );
}

export default App;
