import * as Y from "yjs";
import {useEffect, useState} from "react";
import {MonacoBinding} from "y-monaco";
import {WebsocketProvider} from "y-websocket";

const doc = new Y.Doc();

// TODO: github rövid leírással

// TODO: metadata (pl. az a fájl legyen kiválasztva mindkét oldalon)
// TODO: rekurzív fáljrendszer
// doc.clientID: number
// TODO: editorban látni lehessen a másik kurzorát
const yData = doc.getMap('project-data');
yData.set('metadata', new Y.Map());
yData.set('filesystem', new Y.Map());
const provider = new WebsocketProvider('wss://demos.yjs.dev', 'collaborative-project', doc);
const awareness = provider.awareness;

const setUpMetaData = () => {
  (yData.get('metadata')).set('contributors', new Y.Array());
  (yData.get('metadata')).set('activeFilePath', '');
  (yData.get('metadata')).set('isReadOnlyForStudents', false);
};
setUpMetaData();

export function useYProjectStructure() {


  const [metaData, setMetaData] = useState({});
  const [filesystem, setFilesystem] = useState({});
  const [isTeacher, setIsTeacher] = useState(false);


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

  const updateData = () => {
    setMetaData((yData.get('metadata')).toJSON());
    setFilesystem((yData.get('filesystem')).toJSON());
  };

  useEffect(() => {

    createObserve(yData.get('filesystem'));
    createObserve(yData.get('metadata'));
    createObserve(yData.get('metadata').get('contributors'));
    updateData();

    doc.on('update', update => {
      Y.applyUpdate(doc, update);
      updateData();
    });

    provider.on('sync', () => {
      updateData();
      console.log('client id', awareness.clientID);
      const contributors = yData.get('metadata').get('contributors')
      if (!contributors || contributors.length === 0 || (contributors.toArray()).includes(awareness.clientID)) {
        setIsTeacher(true);
      }
      if (!((contributors.toArray()).includes(awareness.clientID))) {
        yData.get('metadata').get('contributors').push([awareness.clientID]);
        console.log('contributors', yData.get('metadata').get('contributors').toArray());
      }
    });

    // var person = prompt(
    //   "Please enter your name",
    //   Math.floor(Math.random() * 10) + "User"
    // );
    //
    // if (person === " ") {
    //   person = Math.floor(Math.random() * 10) + "User";
    // }
    // awareness.setLocalStateField("user", {
    //   name: person,
    //   color: '#' + Math.floor(Math.random()*16777215).toString(16),
    // });


    awareness.on('change', changes => {
      console.log('changes', changes);
      if (changes &&
        (changes.updated && changes.updated.length > 0) &&
        (!changes.add || (changes.added && changes.added.length === 0)) &&
        (!changes.deleted || (changes.deleted && changes.deleted.length === 0))) {
        console.log('updated', changes.updated);
        return;
      }
      const contributors = yData.get('metadata').get('contributors')
      for (const removed of changes.removed) {
        let i = 0;
        for (const contributor of contributors) {
          if (contributor === removed) {
            yData.get('metadata').get('contributors').delete(i, 1);
            i--;
          }
          i++;
        }
      }
      // checkContributors();
      console.log('awareness states', Array.from(awareness.getStates().keys()));
      console.log('changes', changes);
      console.log('awareness', awareness);
      console.log('contributors', yData.get('metadata').get('contributors').toArray());
    });

    // awareness.on('update', ({ added, updated, removed }) => {
    //   const changedClients = added.concat(updated).concat(removed);
    //   broadcastAwarenessMessage(awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients))
    // })


  }, []);

  const createObserve = (yMap) => {
    yMap.observe(event => {
      console.log('\n');
      updateData();
      console.log('ydata observe', yData.toJSON());
      console.log('\n');

    });
  };

  const checkContributors = () => {
    const aw_state_values = Array.from(awareness.getStates().keys());
    let i = 0;
    for (const contributor of yData.get('metadata').get('contributors')) {
      if (!aw_state_values.includes(contributor)) {
        yData.get('metadata').get('contributors').delete(i, 1);
        i--;
      }
      i++;
    }
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
        yText.insert(0, name + 'value');
        fs.set(name, yText);
      }
    },

    deleteFile: (path) => {
      let p = path.split('/');
      let fs = yData.get('filesystem');

      let last = p.pop();
      for (let i = 0; i < p.length; i++) {
        if (fs.has(p[i])) {
          fs = fs.get(p[i]);
        } else {
          console.log('Delete failed - path not found!');
          return;
        }
      }
      if (!fs.has(last)) {
        console.log('Delete failed - path not found!');
      } else {
        if (last.split('.') === 1) {
          this.deleteFile(path + '/' + last);     // kell?
        }
        fs.delete(last);
      }
    },

    createMonacoBinding: (path, editor, monaco) => {
      console.log('yData - mondaco binding', yData.toJSON());
      let text;
      let fs = yData.get('filesystem');
      while (path.length > 1) {
        fs = fs.get(path.shift());
      }
      text = fs.get(path[0]);

      return new MonacoBinding(
        text,
        /** @type {monaco.editor.ITextModel} */ (editor.getModel()),
        new Set([editor]),
        awareness
      );
    },

    setActiveFile: (path) => {
      yData.get('metadata').set('activeFilePath', path);
    },

    logContributors: () => {
      const contributors = yData.get('metadata').get('contributors');
      console.log('contributors', contributors.toArray());
      console.log('client id', awareness.clientID);
      console.log('awareness', awareness);
    },

    deleteContributors: () => {
      const contributors = yData.get('metadata').get('contributors');
      if (contributors.length > 0) yData.get('metadata').get('contributors').delete(0, contributors.length);
    },

    setReadonlyForStudents: (isReadOnly) => {
      yData.get('metadata').set('isReadOnlyForStudents', isReadOnly);
    },

    getIsReadOnly: () => {
      return !isTeacher && yData.get('metadata').get('isReadOnlyForStudents');
    },

    logData: () => {
      console.log('logdata in hook', yData.toJSON());
    }
  };

  return [metaData, filesystem, isTeacher, projectMethods];
}