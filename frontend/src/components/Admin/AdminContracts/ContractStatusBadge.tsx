function ContractStatusBadge({ isUploaded }: { isUploaded: boolean }) {
  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-semibold ${isUploaded ? "text-success" : "text-warning"}`}
    >
      <span
        className={`size-2 rounded-full ${isUploaded ? "bg-success" : "bg-warning"}`}
      />
      {isUploaded ? "Uploaded" : "Not uploaded"}
    </span>
  );
}

export default ContractStatusBadge;
