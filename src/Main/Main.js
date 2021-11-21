import './Main.module.css';
import MonacoEditor from "./MonacoEditor/MonacoEditor";


const Main = (props) => {
  return (
    <div>
      <p>Active file: {props.activeFilePath}</p>
      <MonacoEditor projectMethods={props.projectMethods} activeFilePath={props.activeFilePath}/>
    </div>
  );
};

export default Main;