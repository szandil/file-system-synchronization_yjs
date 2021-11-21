import React, {useEffect} from "react";

//https://github.com/suren-atoyan/monaco-react#readme
const MonacoEditor = (props) => {


  useEffect(() => {
    // props.projectMethods.createMonacoBinding(editorId, props.activeFilePath);
    props.projectMethods.addFile('file4.js');
  }, []);

  return (
    <div id="monaco-editor">
      {/*<Editor*/}
      {/*  id={editorId}*/}
      {/*  height="90vh"*/}
      {/*  defaultLanguage="javascript"*/}
      {/*  defaultValue="// some comment"*/}
      {/*/>*/}
    </div>
  );

};

export default MonacoEditor;