import * as Y from "yjs";
import {useEffect, useState} from "react";


export function useYProjectStructure() {
  const doc = new Y.Doc();

  const [data, setData] = useState({
    metadata: {},
    filesystem: {}
  });

  const yData = doc.getMap('project-data');
  yData.set('metadata', new Y.Map());
  yData.set('filesystem', new Y.Map());

  useEffect(() => {
    yData.observeDeep((event) => {
      console.log(yData.toJSON());
      setData(yData.toJSON());
    });
  });





  // yData.observeDeep((event) => {

    // console.log('event', event);

    // let path = event[0].path;
    // let first = path.shift();
    // let last = path.length >= 1 ? path.pop() : first;
    // let newData = {};
    // let newDataParts = newData;
    // let yMap = yData.get(first);
    // for(key in path) {
    //   newDataParts[key] = {};
    //   newDataParts = newDataParts[key];
    //   yMap = yMap.get(key);
    // }
    // newDataParts[key] = yMap.get(last);
    // setData(prevData => {
    //   return {...prevData, first: newDataParts};
    // });

    // setData({data: 'blabla'});

    // console.log(event[0].currentTarget.toJSON());
    // console.log(key, value);
    // console.log(event[0].path);
    // console.log(event[0].changes);
  // });

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
        fs.set(name, `${name}value`);           // TODO: a tartalma majd Y.Text
      }

    },

  };

  return [data, projectMethods];
}