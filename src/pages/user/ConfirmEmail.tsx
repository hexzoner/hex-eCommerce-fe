import { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmailToken } from "../../api/email";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";

interface State {
  loading: boolean;
  message: string;
  verified: boolean;
  userId: number;
  email: string;
  error: boolean;
}

interface Action {
  type: string;
  payload: any;
}

const initialState = {
  loading: true,
  message: "",
  verified: false,
  userId: 0,
  email: "",
  error: false,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER_DATA":
      return {
        ...state,
        email: action.payload.data.email,
        message: action.payload.message,
        userId: action.payload.data.userId,
        verified: action.payload.data.verified,

        loading: false,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.isError,
        message: action.payload.message,
        loading: false,
      };
    default:
      return state;
  }
}

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const token = searchParams.get("token");

  useEffect(() => {
    let isMounted = true;
    async function verifyToken() {
      if (!isMounted) return;
      //   dispatch({ type: "SET_LOADING", payload: true });
      if (token) {
        verifyEmailToken(token)
          .then((data) => {
            if (data && isMounted) {
              if (data.error) throw new Error(data.message);
              dispatch({ type: "SET_USER_DATA", payload: data });
              //   console.log(data);
            }
          })
          .catch((err) => {
            console.log(err);
            dispatch({
              type: "SET_ERROR",
              payload: {
                isError: true,
                message: "Something went wrong.",
              },
            });
            toast.error(err.message);
          });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: {
            isError: true,
            message: "No token provided.",
          },
        });
        toast.error("No token provided.");
      }
    }
    verifyToken();
    return () => {
      isMounted = false;
    };
  }, [token]);

  if (state.loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-2xl font-semibold text-black">Email confirmation</p>
      <p>Result: {state.message}</p>
      {!state.error && (
        <>
          <p>Account verificated: {state.verified ? "TRUE" : "FALSE"}</p>
          <p>Email: {state.email}</p>
          <p>UserId: {state.userId}</p>
        </>
      )}
    </div>
  );
}
