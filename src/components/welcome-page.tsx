const WelcomePage = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="w-[355px]">
        <div className="w-full h-[200px] mb-4">
            <a href="#">          
                <img src="/video.png" alt="" className="w-full h-full rounded-[14px]" />
            </a>
        </div>
        
        <p className="text-base px-1 text-center">How to use this extension <a href="#" className="underline uppercase">Video Help</a></p>
        <p className="text-base px-1 text-center">How to use this extension <a href="#" className="underline">Documentation</a></p>
      </div>
    </div>
  );
};

export default WelcomePage;
