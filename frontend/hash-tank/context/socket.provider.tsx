import { API } from "@/constants/api.constants";
import { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";


const SocketContext = createContext<any>({});

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props: any) => {
	const { currentUser } = useAuth();
	const socket = useMemo(() => {

		console.log(currentUser?.uid)

		if(!currentUser)
			return null;

		return io(`${API.BASE_URL}`, {
		query: {
			userId: currentUser?.uid
		},
		timeout: 5000,
		});
	}, [currentUser]);

  return (
	<SocketContext.Provider value={socket}>
		{props.children}
	</SocketContext.Provider>
  );
};