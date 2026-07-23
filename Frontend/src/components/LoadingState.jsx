import { InfinitySpin } from "react-loader-spinner";

const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-vibe-background">
      <div className="rounded-2xl border border-vibe-border bg-vibe-surface p-8 shadow-panel">
        <InfinitySpin width="200" color="#6366F1" />
      </div>
    </div>
  );
};


export default LoadingState;
