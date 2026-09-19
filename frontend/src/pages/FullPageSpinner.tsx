function FullPageSpinner() {
  return (
    <div className="w-screen h-screen bg-pageBackground flex items-center justify-center">
      <div className="size-24 animate-spin border-8 rounded-full border-primary border-t-transparent"></div>
    </div>
  );
}

export default FullPageSpinner;
