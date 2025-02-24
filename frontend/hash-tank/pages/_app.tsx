import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContextProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "@/store";
import { SocketProvider } from "@/context/socket.provider";

const noAuthRequired = ["/login", "/signup", "/forgetPasswordPage"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <AuthContextProvider>
        {noAuthRequired.includes(router.pathname) ? (
          <>
            <Component {...pageProps} />
          </>
        ) : (
          <SocketProvider>
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          </SocketProvider>
        )}
      </AuthContextProvider>
    </Provider>
  );
}

export default MyApp;
