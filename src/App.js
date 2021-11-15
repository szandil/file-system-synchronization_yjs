import './App.css';
import {useYProjectStructure} from "./useYProjectStructure";

function App() {

  const [data, projectMethods] = useYProjectStructure();

  // console.log('data1', data);
  projectMethods.addFile('folder1/file1.js');
  console.log('data2', data);

  return (
    <div></div>
  );
}

export default App;
