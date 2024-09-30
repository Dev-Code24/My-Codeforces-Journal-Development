import StartingPage from "./components/starting-page";

const App: React.FC = () => {
  return (
    <div className={`font-Averta text-primary-black bg-primary-light ${!window.SETUP_COMPLETE ? "h-[400px] w-[400px]" : "h-[250px] w-[250px]"}`}>
      <StartingPage />
    </div>
  );
};

export default App;
