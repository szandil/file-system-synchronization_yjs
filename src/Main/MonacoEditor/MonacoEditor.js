import React, {useEffect, useState} from "react";

import './MonacoEditor.module.css';

// import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
// import Editor from "@monaco-editor/react";
// import * as monaco from 'monaco-editor';
import Editor from "@monaco-editor/react";

let monacoBinding = null;

//https://github.com/suren-atoyan/monaco-react#readme
const MonacoEditor = (props) => {

  const [editor, setEditor] = useState();
  const [monaco, setMonaco] = useState();
  const {activeFilePath} = props;
  const {projectMethods} = props;



  // useEffect(() => {
  //   projectMethods.addFile('file4.js');
  // }, []);

  useEffect(() => {
    if (editor && activeFilePath.length > 0) {

      monacoBinding = projectMethods.createMonacoBinding(activeFilePath, editor, monaco);

      // monacoBinding = new MonacoBinding(
      //   ytext,
      //   /** @type {monaco.editor.ITextModel} */ (editor.getModel()),
      //   new Set([editor]))
      return () => {
        monacoBinding?.destroy();
      };
    }

  }, [editor, activeFilePath, projectMethods]);

  function handleEditorDidMount(editor, monaco) {
    setEditor(editor);
    setMonaco(monaco);
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