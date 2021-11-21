import React, {useEffect, useState} from "react";

import * as Y from 'yjs'
import { MonacoBinding } from 'y-monaco'
import Editor from "@monaco-editor/react";
// import * as monaco from 'monaco-editor'

//https://github.com/suren-atoyan/monaco-react#readme
const MonacoEditor = (props) => {

  const [editor, setEditor] = useState();
  const [monaco, setMonaco] = useState();
  const activeFilePath = ['file1.js'];
  const ydoc = new Y.Doc()
  const ytext = ydoc.getText('monaco')

  useEffect(() => {
    let monacoBinding = null;
    if (editor) {
      monacoBinding = new MonacoBinding(
        ytext,
        /** @type {monaco.editor.ITextModel} */ (editor.getModel()),
        new Set([editor]))
    }

  }, [editor]);

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