import * as Y from "yjs";
import {useEffect, useState} from "react";
import {MonacoBinding} from "y-monaco";
import {WebsocketProvider} from "y-websocket";
import * as awarenessProtocol from 'y-protocols/awareness.js'

const doc = new Y.Doc();



// TODO: metadata (pl. az a fájl legyen kiválasztva mindkét oldalon)
// TODO: rekurzív fáljrendszer
// doc.clientID: number
// TODO: editorban látni lehessen a másik kurzorát
const yData = doc.getMap('project-data');
yData.set('metadata', new Y.Map());
yData.set('filesystem', new Y.Map());
const provider = new WebsocketProvider('wss://demos.yjs.dev', 'collaborative-project', doc);
const awareness = provider.awareness;



export function useYProjectStructure() {


  const [metaData,setMetaData] = useState({});
  const [filesystem, setFilesystem] = useState({});


  // yData.observeDeep((event) => {
  //   // console.log('ydata observe event', Array.from(event[0].changes.keys.entries())[0][1].action);
  //   console.log('ydata observe event', event[0].changes);
  //   if (Array.from(event[0].changes.keys.entries()).length > 0) {
  //     setMetaData((yData.get('metadata')).toJSON());
  //     setFilesystem((yData.get('filesystem')).toJSON());
  //     console.log('ydata observe', yData.toJSON());
  //   }
  //   {
  //     // console.log(event[0].currentTarget.toJSON());
  //     // console.log(key, value);
  //     // console.log(event[0].path);
  //     // console.log(event[0].changes);}
  //   }
  // });

  useEffect(() =>{
    createObserve(yData.get('metadata'));
    createObserve(yData.get('filesystem'));
    var person = prompt(
      "Please enter your name",
      Math.floor(Math.random() * 10) + "User"
    );

    if (person === " ") {
      person = Math.floor(Math.random() * 10) + "User";
    }
    awareness.setLocalStateField("cursor", {cursor: true});
    awareness.setLocalStateField("user", {
      name: person,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
    });
    console.log(awareness.clientID);
    awareness.on('change', changes => {
      // Whenever somebody updates their awareness information,
      // we log all awareness information from all users.
      console.log(Array.from(awareness.getStates().values()))
    });
    // awareness.on('update', ({ added, updated, removed }) => {
    //   const changedClients = added.concat(updated).concat(removed);
    //   broadcastAwarenessMessage(awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients))
    // })
  }, []);

  const createObserve = (yMap) => {
    yMap.observe(event => {
      console.log('\n');
      // if (Array.from(event[0].changes.keys.entries()).length > 0) {
      setMetaData((yData.get('metadata')).toJSON());
      setFilesystem((yData.get('filesystem')).toJSON());
      console.log('ydata observe', yData.toJSON());
      console.log('\n');

      // }
    });
  };


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
        createObserve(fs.get(name));
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

    createMonacoBinding: (path, editor, monaco) => {
      console.log('yData',yData.toJSON());
      let text=null;
      let fs = yData.get('filesystem');
      while(path.length > 1) {
        fs = fs.get(path.shift());
      }
      text=fs.get(path[0]);




      // return null;
      return new MonacoBinding(
        text,
        /** @type {monaco.editor.ITextModel} */ (editor.getModel()),
        new Set([editor]),
        awareness
      );
    },

    logData: () => {
      console.log('logdata in hook', yData.toJSON());
    }
  };

  return [metaData, filesystem, projectMethods];
}