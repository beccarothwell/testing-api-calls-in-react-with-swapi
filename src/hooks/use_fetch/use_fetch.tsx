import { useState, useEffect } from "react";
import { isError } from "../../helpers/is_error";

function useFetch<T>(url: string) {
  const [data, setData] = useState<T>();
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        setIsFetching(false);
        if (!response.ok) {
          if (response.status === 404) {
            setErrorMessage(`${response.status} Not Found`);
          } else if (response.status === 418) {
            setErrorMessage(`${response.status} I'm a tea pot, silly`);
          } else if (response.status === 500) {
            setErrorMessage(
              `${response.status} Oops... something went wrong, try again 🤕`
            );
          } else {
            setErrorMessage(`${response.status} Not Found`);
          }
        }
        if (response.status === 200) {
          const json = await response.json();
          setData(json);
        }
      } catch (e: unknown) {
        setIsFetching(false);
        console.log(isError(e) ? e.message : "Unknown error!");
      }
    };
    fetchData();
  }, [url]);

  return { isFetching: isFetching, data: data, errorMessage: errorMessage };
}

export default useFetch;
