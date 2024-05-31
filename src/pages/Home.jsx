import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-3">
      <div className="text-xl font-semibold">Home Page</div>
      <Link to="/roshambo">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Go to Roshambo</button>
      </Link>
    </div>
  );
};

export default Home;
