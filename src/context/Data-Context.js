import React, {useState} from "react";

import * as Y from "yjs";
import {MonacoBinding} from "y-monaco";
import {useYProjectStructure} from "../useYProjectStructure";


const DataContext = React.createContext({
  metaData: {},
  filesystem: {},
  projectMethods: {}
});

const doc = new Y.Doc();

const yData = doc.getMap('project-data');
yData.set('metadata', new Y.Map());
yData.set('filesystem', new Y.Map());

export const DataContextProvider = (props) => {
  // const [metaData, filesystem, projectMethods] = useYProjectStructure();


  const [metaData,setMetaData] = useState({});
  const [filesystem, setFilesystem] = useState({});
  let editor = null;
  let monacoBinding = null;

  yData.observeDeep((event) => {
    setMetaData((yData.get('metadata')).toJSON());
    setFilesystem((yData.get('filesystem')).toJSON());
    console.log('ydata observe', yData.toJSON());
  });

  const projectMethods = {

    addFile: (path) => {
      let pathParts = path.split('/');
      let name = pathParts.pop();
      if (name.trim() === '') return;
      let nameParts = name.split('.');
      let fs = yData.get('filesystem');

      pathParts.forEach(folder => {
        if (folder !== '') {
          if (fs.has(folder)) {
            fs = fs.get(folder);
          } else {
            fs.set(folder, new Y.Map());
            fs = fs.get(folder);
          }
        }
      });

      if (nameParts.length === 1) {   // new folder
        fs.set(name, new Y.Map());
      } else {                        // new file
        const yText = new Y.Text();
        yText.insert(0,name+'value');
        fs.set(name, yText);
      }
    },

    createMonacoBinding: (path, editor, monaco) => {
      console.log('createbinding');
      console.log('yData',yData.toJSON());
      console.log('filesystem', filesystem);
      let text=null;
      let fs = yData.get('filesystem');
      while(path.length > 1) {
        fs = fs.get(path.shift());
      }
      text=fs.get(path[0]);
      console.log('hook text', text);

      const ytext = doc.getText('monaco');
      ytext.insert(0, '// I want this file from the hook: ' + path);
      return new MonacoBinding(
        ytext,
        /** @type {monaco.editor.ITextModel} */ (editor.getModel()),
        new Set([editor]));
    },

    logData: () => {
      console.log('logdata in hook', yData.toJSON());
    }
  };

  return (
    <DataContext.Provider
      value={{
        metaData: metaData,
        filesystem: filesystem,
        projectMethods: projectMethods
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;

