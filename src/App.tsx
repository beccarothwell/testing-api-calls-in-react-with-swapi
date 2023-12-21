import "./App.css";
import useFetch from "./hooks/use_fetch/use_fetch";

interface SWPerson {
  name: string;
}

function App() {
  const { isFetching, data, errorMessage } = useFetch<SWPerson>(
    "https://swapi.dev/api/people/1"
  );

  return (
    <div className="App">
      <p>learn react</p>
      {isFetching && "...loading"}
      {errorMessage && errorMessage}
      {data && data?.name}
    </div>
  );
}

export default App;
