import { NextPage } from "next";
import { NavBar, CreateJoinRoom, RoomList } from "@components";

const Home: NextPage = () => {
  return (
    <div className="bg-slate-600 w-full h-full flex flex-col">
      <NavBar />
      <div className="flex flex-row w-full h-full">
        <div className="grow flex justify-center items-center">
          <CreateJoinRoom />
        </div>
        <div className="w-80 h-full justify-center">
          <RoomList />
        </div>
      </div>
    </div>
  );
};

export default Home;
