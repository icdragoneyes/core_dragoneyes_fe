import maincar from "../../assets/img/maincar.png";
const ArenaDesktop = () => {
  return (
    <section className="relative w-screen h-screen flex justify-center items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/src/assets/img/bg-desktop.png')] bg-cover bg-center"></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Content */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col self-start pt-5 w-3/4 gap-6">
          <div className="text-[#FAAC52] font-normal font-passero text-7xl leading-8 drop-shadow-md">ROSHAMBO</div>
          <div className="text-white font-normal font-alatsi text-2xl leading-8 drop-shadow-md">
            Welcome to Roshambo! <br /> Choose rock, paper, or scissor <br /> and see if you can beat me.
          </div>
        </div>
        <div className="flex justify-center items-center relative h-full w-1/2">
          <img src={maincar} alt="Main Character" className="lg:w-60" />
        </div>
      </div>
    </section>
  );
};

export default ArenaDesktop;
