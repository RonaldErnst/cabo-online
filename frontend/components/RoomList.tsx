import { RoomClientData } from "@common/types/models/room.model";
import { GetServerSideProps } from "next";

const RoomList = () => {
  return <div>Enter</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const rooms: RoomClientData[] = [];

  return {
    props: {
      rooms,
    },
  };
};

export default RoomList;
