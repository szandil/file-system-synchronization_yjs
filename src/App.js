import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";
import {useEffect} from "react";

function App() {

  const [data, projectMethods] = useYProjectStructure();

  // console.log('data1', data);
  useEffect(() => {
    projectMethods.addFile('folder1/file1.js');
  }, []);
  console.log('data2', data);

  // https://mui.com/components/tree-view/#basic-tree-view
  // https://github.com/chenglou/react-treeview/blob/master/demos/controlled.js
  return (
    <div className="container">
        <div className="filenav">

        </div>
        <div className="main-content">Main</div>
    </div>
  );
}

export default App;
