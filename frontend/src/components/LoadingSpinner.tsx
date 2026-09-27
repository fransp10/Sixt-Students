function LoadingSpinner({ size }: { size?: number }) {
  return (
    <div
      style={{ width: size || 48, height: size || 48 }}
      className={`border-4 border-primary border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}

export default LoadingSpinner;
