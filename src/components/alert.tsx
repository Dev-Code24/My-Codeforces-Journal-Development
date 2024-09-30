import Button from "../ui/button";

interface Props {
  onTryAgain: () => void;
  title: string;
  description: string;
}
const Alert: React.FC<Props> = ({ onTryAgain, title, description }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="bg-primary-light text-error-red font-bold text-lg rounded-full px-4 py-2 mb-4">{title}</div>
      <Button onClick={onTryAgain}>{description}</Button>
    </div>
  );
};
export default Alert;
