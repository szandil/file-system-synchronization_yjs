import * as Y from "yjs";
import {useEffect, useState} from "react";
import {MonacoBinding} from "y-monaco";
import {WebsocketProvider} from "y-websocket";

const doc = new Y.Doc();

const yData = doc.getMap('project-data');
const provider = new WebsocketProvider('wss://demos.yjs.dev', 'collaborative-project-2', doc);
const awareness = provider.awareness;

const initData = () => {
  yData.set('metadata', new Y.Map());
  yData.set('filesystem', new Y.Map());
  (yData.get('metadata')).set('contributors', new Y.Array());
  (yData.get('metadata')).set('activeFilePath', '');
  (yData.get('metadata')).set('isReadOnlyForStudents', false);
};
initData();

export function useYProjectStructure() {


  const [metaData, setMetaData] = useState({});
  const [filesystem, setFilesystem] = useState({});
  const [isTeacher, setIsTeacher] = useState(false);

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
      const contributors = yData.get('metadata').get('contributors')
      if (!contributors || contributors.length === 0 || (contributors.toArray()).includes(awareness.clientID)) {
        setIsTeacher(true);
      }
      if (!((contributors.toArray()).includes(awareness.clientID))) {
        yData.get('metadata').get('contributors').push([awareness.clientID]);
      }
    });

    awareness.on('change', changes => {
      if (changes &&
        (changes.updated && changes.updated.length > 0) &&
        (!changes.add || (changes.added && changes.added.length === 0)) &&
        (!changes.deleted || (changes.deleted && changes.deleted.length === 0))) {
        return;
      }
      const contributors = yData.get('metadata').get('contributors');
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
    });

  }, []);

  const createObserve = (yMap) => {
    yMap.observe(() => {
      updateData();
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

    setReadonlyForStudents: (isReadOnly) => {
      yData.get('metadata').set('isReadOnlyForStudents', isReadOnly);
    },

    getIsReadOnly: () => {
      return !isTeacher && yData.get('metadata').get('isReadOnlyForStudents');
    },

    reset: () => {
      initData();
    }
  };

  return [metaData, filesystem, isTeacher, projectMethods];
}