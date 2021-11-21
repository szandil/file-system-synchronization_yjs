import React, {useEffect, useState} from "react";

import './MonacoEditor.module.css';

// import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
// import Editor from "@monaco-editor/react";
// import * as monaco from 'monaco-editor';
import Editor from "@monaco-editor/react";


//https://github.com/suren-atoyan/monaco-react#readme
const MonacoEditor = (props) => {

  const [editor, setEditor] = useState();
  const [monaco, setMonaco] = useState();
  // const ydoc = new Y.Doc();
  // const ytext = ydoc.getText('monaco');
  const {activeFilePath} = props;
  const {projectMethods} = props;
  // ytext.insert(0,'// This is the monaco editor');

  let monacoBinding = null;

  // useEffect(() => {
  //   projectMethods.addFile('file4.js');
  // }, []);

  useEffect(() => {
    if (editor) {
      if (monacoBinding) monacoBinding.destroy();
      monacoBinding = projectMethods.createMonacoBinding(activeFilePath, editor, monaco);

      // monacoBinding = new MonacoBinding(
      //   ytext,
      //   /** @type {monaco.editor.ITextModel} */ (editor.getModel()),
      //   new Set([editor]))
    }

  }, [editor, activeFilePath, projectMethods]);

  function handleEditorDidMount(editor, monaco) {
    setEditor(editor);
    setMonaco(monaco);
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco);
  }

  // const monacoEditorStyle = {
  //   width: '100%',
  //   height: '600px',
  //   border: '1px solid #ccc'
  // }

  return (
    // <div id="monaco-editor" style={monacoEditorStyle}>
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