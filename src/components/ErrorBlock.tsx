const ErrorBlock = ({ error }: { error: string | null }) => {
  return (
    <div>
      <p className="text-red-500 font-medium text-sm text-center my-1">{error}</p>
    </div>
  );
};

export default ErrorBlock;
