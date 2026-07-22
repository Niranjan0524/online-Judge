import { InfinitySpin } from "react-loader-spinner";

const LoadingState = () => {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-vibe-background">
        <InfinitySpin width="200" color="#6366F1" />
      </div>
    </>
  );
};


export default LoadingState;
