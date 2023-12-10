import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

// Reducers need to be pure functions ; we cannot make api requests inside reducers
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Invalid action type.");
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCitites] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity, error } = state;

  useEffect(function () {
    async function fetchCities() {
      dispatch({
        type: "loading",
      });
      try {
        // setIsLoading(true);
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        // setCitites(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the cities...",
        });
      }
      // finally {
      //   // setIsLoading(false);
      // }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    try {
      // setIsLoading(true);
      dispatch({ type: "loading" });
      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();
      // setCurrentCity(data);
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      // alert("There was an error loading the data");
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city data.",
      });
    }
    // finally {
    //   setIsLoading(false);
    // }
  }

  async function createCity(newCity) {
    try {
      // setIsLoading(true);
      dispatch({ type: "loading" });
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(data);
      dispatch({ type: "city/created", payload: data });
      // setCitites((cities) => [...cities, data]);
    } catch (err) {
      // alert("There was an error creating the city.");
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city.",
      });
      // } finally {
      //   setIsLoading(false);
      // }
    }
  }

  async function deleteCity(id) {
    try {
      // setIsLoading(true);
      dispatch({ type: "loading" });
      await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });

      // setCitites(cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted" });
    } catch (err) {
      // alert("There was an error deleting the city.");
      dispatch({ type: "rejected", payload: id });
    }
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside cities provider");
  return context;
}

export { useCities, CitiesProvider };
