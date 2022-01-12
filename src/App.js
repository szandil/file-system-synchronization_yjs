import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import Main from "./Main/Main";
import {faChalkboardTeacher, faGraduationCap, faTrashAlt} from "@fortawesome/free-solid-svg-icons";

function App() {

  const [metaData, filesystem, isTeacher, projectMethods] = useYProjectStructure();
  const activeFilePath = metaData.activeFilePath ?? '';
  const isReadOnlyForStudents = metaData.isReadOnlyForStudents ?? false;


  let buttons = [];
  let path = [];
  for (const [key] of Object.entries(filesystem)) {
    path = [key];
    buttons.push({'key': key, 'path': path});
  }

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
                disabled={!isTeacher && isReadOnlyForStudents}
                onClick={() => {
                  projectMethods.setActiveFile(file.path);
                }}>
                {file.key}
              </button>
              <button
                className={`icon-div ${activeFilePath.toString() === file.path.toString() ? 'active' : ''} list-group-item list-group-item-action`}
                disabled={(!isTeacher && isReadOnlyForStudents) || activeFilePath.toString() === file.path.toString()}
                onClick={() => {
                  projectMethods.deleteFile(file.path.toString());
                  if (activeFilePath.toString() === file.path.toString()) {
                    projectMethods.setActiveFile(buttons[0].path);
                  }
                }}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className={`delete-icon ${activeFilePath.toString() === file.path.toString() ? 'active' : ''}`}
                />
              </button>
            </div>
          )}
        </div>

      </div>
      <div className="main-content">
        <div className={'top'}>
          <div className={'top-part'}>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const fileName = prompt("Add meg az új fájl nevét (kiterjesztéssel együtt)!");
                  if (fileName.trim() !== '' && fileName.split('.').length === 2) {
                    projectMethods.addFile(fileName);
                  } else {
                    alert('Helytelen fájlnév!');
                  }
                }}>Add new file
              </button>
            </div>
            {isTeacher &&
              <span className={'role no-select'}><FontAwesomeIcon icon={faChalkboardTeacher}/>  Tanár</span>}
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
              <label className="form-check-label no-select" htmlFor="flexSwitchCheckDefault">Diákok számára csak
                olvasható</label>
            </div>}
          {!isTeacher && metaData.isReadOnlyForStudents &&
            <h6 className={'text-center'}>A szerkesztést a tanár letiltotta!</h6>}</div>
        <Main activeFilePath={activeFilePath} isReadOnly={isReadOnlyForStudents} projectMethods={projectMethods}/>
      </div>
    </div>
  );
}

export default App;
