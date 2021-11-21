import * as Y from "yjs";
import {useState} from "react";
import * as monaco from "monaco-editor";
import {MonacoBinding} from "y-monaco";


export function useYProjectStructure() {
  const doc = new Y.Doc();

  const [metaData,setMetaData] = useState({});
  const [filesystem, setFilesystem] = useState({});
  let editor = null;
  let monacoBinding = null;
  // const [data, setData] = useState({
  //   metadata: {},
  //   filesystem: {}
  // });

  const yData = doc.getMap('project-data');
  yData.set('metadata', new Y.Map());
  yData.set('filesystem', new Y.Map());


  yData.observeDeep((event) => {
    setMetaData((yData.get('metadata')).toJSON());
    setFilesystem((yData.get('filesystem')).toJSON());
    // setData(yData.toJSON());

    // console.log('event', event);

    // let path = event[0].path;
    // let first = path.shift();
    // console.log(path);
    // let last = path.length >= 1 ? path.pop() : first;
    // let newData = {};
    // let newDataParts = newData;
    // let yMap = yData.get(first);
    // for(let p in path) {
    //   newDataParts[p] = {};
    //   newDataParts = newDataParts[p];
    //   yMap = yMap.get(p);
    // }
    // newDataParts[last] = yMap.get(last);
    // setData(prevData => {
    //   return {...prevData, first: newDataParts};
    // });

    // console.log('yData',yData.toJSON());
    // console.log('data',data);
    // let dataCopy = data;
    //
    // buildObject(dataCopy, yData, path);
    // console.log('done',dataCopy);

    // setData({data: 'blabla'});

    // console.log(event[0].currentTarget.toJSON());
    // console.log(key, value);
    // console.log(event[0].path);
    // console.log(event[0].changes);
  });

  // const buildObject = (dObj, yStructure, keys) => {
  //   console.log('keys', keys)
  //   if (keys.length === 0) return;
  //   let key = keys.shift();
  //   if (keys.length === 0 && key !== undefined) {
  //     // console.log(dObj);
  //     if (typeof yStructure.get(key) === "object") {
  //       dObj[key]=yStructure.get(key).toJSON();
  //       // console.log('if', dObj);
  //     } else {
  //       dObj[key]=yStructure.get(key);
  //       console.log('else', dObj);
  //     }
  //     // return newObj;
  //   } else {
  //     let newYStructure = yStructure.get(key);
  //     let newObj = dObj[key];
  //     console.log('newystru0', newYStructure);
  //     buildObject(newObj, newYStructure, keys);
  //   }
  //   // return newObj;
  // };

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

    // deleteFile: (path) => {
    //   let p = path.split('/');
    //   let fs = yData.get('filesystem');
    //
    //   let last = p.pop();
    //   for (let i = 0; i < p.length; i++) {
    //     if (fs.has(p[i])) {
    //       fs = fs.get(p[i]);
    //     } else {
    //       console.log('Delete failed - path not found!');
    //       return;
    //     }
    //   }
    //   if (!fs.has(last)) {
    //     console.log('Delete failed - path not found!');
    //     return;
    //   } else {
    //     if (last.split('.') === 1) {
    //       this.delete(path + '/' + last);     // kell?
    //     }
    //     fs.delete(last);
    //   }
    // }

    createMonacoBinding: (id, path) => {
      // editor = monaco.editor.create(
      //   document.getElementById(id),
      //   {}
      // );
      //
      // let type=null;
      // let fs = yData.get('filesystem');
      // while(path.length > 1) {
      //   fs = fs.get(path.shift());
      // }
      // type=fs.get(path[0]);
      //
      // monacoBinding = new MonacoBinding(
      //   type,
      //   editor.getModel(),
      //   new Set([editor]),
      //   // provider.awareness
      // );

    }
  };

  return [metaData, filesystem, projectMethods];
}