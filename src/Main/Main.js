import MonacoEditor from "./MonacoEditor/MonacoEditor";

const Main = (props) => {
  return (
    <div>
      <MonacoEditor
        projectMethods={props.projectMethods}
        activeFilePath={props.activeFilePath}
        isReadOnly={props.isReadOnly}/>
    </div>
  );
};

export default Main;