import React, {useEffect, useState} from "react";

import './MonacoEditor.module.css';

import Editor, {useMonaco} from "@monaco-editor/react";

let monacoBinding = null;

//https://github.com/suren-atoyan/monaco-react#readme
const MonacoEditor = (props) => {

  const [editor, setEditor] = useState();
  const monaco = useMonaco();
  const {activeFilePath} = props;
  const {projectMethods} = props;
  const {isReadOnly} = props;


  useEffect(() => {
    if (editor && monaco && activeFilePath && activeFilePath.length > 0) {

      monacoBinding = projectMethods.createMonacoBinding(activeFilePath, editor, monaco);

      return () => {
        monacoBinding?.destroy();
      };
    }

  }, [editor, activeFilePath]);

  useEffect(() => {
    if (editor)
      editor.updateOptions({readOnly: projectMethods.getIsReadOnly()});
  }, [editor, isReadOnly, activeFilePath]);

  function handleEditorDidMount(editor, monaco) {
    setEditor(editor);
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco);
  }

  return (
    <div id="monaco-editor">
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default MonacoEditor;