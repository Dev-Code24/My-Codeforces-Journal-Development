interface Props {
  children: React.ReactNode;
}

const Loader: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {/* Loader */}
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-black"></div>
      <p className="mt-2 text-sm text-primary-black">{children}</p>
    </div>
  );
};
export default Loader;
