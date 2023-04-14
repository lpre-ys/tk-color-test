import { useDropzone } from "react-dropzone";

export default function LoadImage({ setMaterial, setR, setG, setB, setS }) {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        // const name = acceptedFiles[0].name.replace(/\.[^/.]+$/, "");
        setMaterial(reader.result);
        setR(100);
        setG(100);
        setB(100);
        setS(100);
      });
      reader.readAsDataURL(acceptedFiles[0]);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/bmp": [".bmp"],
    },
    maxFiles: 1,
    onDrop,
  });
  return (
    <div {...getRootProps()} className="loader">
      <input data-testid="drop-input" {...getInputProps()} />
      <p>Drag & Drop or Click</p>
    </div>
  );
}
