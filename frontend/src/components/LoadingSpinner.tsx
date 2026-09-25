function LoadingSpinner({ size }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`border-2 border-t-0 rounded-full animate-spin border-primary`}
    ></div>
  );
}

export default LoadingSpinner;
