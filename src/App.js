import './App.css';
import {Image, Layer, Stage, Text} from "react-konva";
import {useState} from "react";
import useImage from "use-image";

function App() {
  const [currentFile, setCurrentFile] = useState(null)
  const [image] = useImage(currentFile);
  const width = (image && image.width) || 100
  const height = (image && image.height) || 100
  const onFileSelect = (event) => {
    const fr = new FileReader();
    fr.onloadend = () => {
      setCurrentFile(fr.result)
    }
    fr.readAsDataURL(event.target.files[0]);
  }

  return (
    <div className="App">
      <Stage width={width} height={height}>
        <Layer>
            <Image image={image} />
        </Layer>
      </Stage>
        <input type="file" onChange={onFileSelect} />
    </div>
  );
}

export default App;
