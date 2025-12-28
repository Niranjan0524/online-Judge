import { InfinitySpin } from "react-loader-spinner";

const LoadingState = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <InfinitySpin width="200" color="#4fa94d" />
      </div>
    </>
  );
};


export default LoadingState;