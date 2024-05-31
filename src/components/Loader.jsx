import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html center>
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Html>
  );
};

export default Loader;
