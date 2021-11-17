import * as Y from "yjs";
import {useState} from "react";


export function useYProjectStructure() {
  const doc = new Y.Doc();

  const [data, setData] = useState({
    metadata: {},
    filesystem: {}
  });

  const yData = doc.getMap('project-data');
  yData.set('metadata', new Y.Map());
  yData.set('filesystem', new Y.Map());


  yData.observeDeep((event) => {
    setData(yData.toJSON());

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
        fs.set(name, `${name}value`);           // TODO: a tartalma majd Y.Text
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
  };

  return [data, projectMethods];
}