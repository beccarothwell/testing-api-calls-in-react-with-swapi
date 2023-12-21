import { render, screen } from "@testing-library/react";
import App from "./App";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("https://swapi.dev/api/people/1", () => {
    return HttpResponse.json({ name: "Luke Skywalker" });
  })
);
const successResponse = http.get("https://swapi.dev/api/people/1", () => {
  return HttpResponse.json({ name: "Luke Skywalker" });
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test(`Given the App renders, 
      When an API call is made with a successful response, 
      Then the first name should appear on the page.`, async () => {
  server.use(successResponse);

  render(<App />);

  const someName = await screen.findByText("Luke Skywalker");

  expect(someName).toBeInTheDocument();
});

test(`Given the App renders, 
      When an API call is made with Status Code 500 response, 
      Then the error message should appear on the page.`, async () => {
  server.use(
    http.get("https://swapi.dev/api/people/1", () => {
      return HttpResponse.json(null, {
        status: 500,
      });
    })
  );

  render(<App />);

  const someErrorMessage = await screen.findByText(
    "500 Oops... something went wrong, try again 🤕"
  );

  expect(someErrorMessage).toBeInTheDocument();
});

test(`Given the App renders, 
      When an API call is made with Status Code 418 response, 
      Then the error message should appear on the page.`, async () => {
  server.use(
    http.get("https://swapi.dev/api/people/1", () => {
      return HttpResponse.json(null, {
        status: 418,
      });
    })
  );

  render(<App />);

  const someErrorMessage = await screen.findByText("418 I'm a tea pot, silly");

  expect(someErrorMessage).toBeInTheDocument();
});

test(`Given the App renders, 
      When an API call is made with Status Code 404 response, 
      Then the error message should appear on the page.`, async () => {
  server.use(
    http.get("https://swapi.dev/api/people/1", () => {
      return HttpResponse.json(null, {
        status: 404,
      });
    })
  );

  render(<App />);

  const someErrorMessage = await screen.findByText("404 Not Found");

  expect(someErrorMessage).toBeInTheDocument();
});

test(`Given the App renders, 
      When an API call is made with an unsuccessful Status Code response, 
      Then the status text should appear on the page.`, async () => {
  server.use(
    http.get("https://swapi.dev/api/people/1", () => {
      return HttpResponse.json(null, {
        status: 400,
        statusText: "Bad Request",
      });
    })
  );

  render(<App />);

  const someErrorMessage = await screen.findByText("400 Bad Request");

  expect(someErrorMessage).toBeInTheDocument();
});

test(`Given the App renders, 
      When an API call has not yet been made, 
      Then the loading text should appear on the page.`, () => {
  render(<App />);

  const someLoadingText = screen.getByText("...loading");

  expect(someLoadingText).toBeInTheDocument();
});

test(`Given the App renders, 
      When an API call is made with a successful response, 
      Then the loading text should not appear on the page.`, async () => {
  server.use(successResponse);

  render(<App />);

  await screen.findByText("Luke Skywalker");
  const someLoadingText = screen.queryByText("...loading");

  expect(someLoadingText).not.toBeInTheDocument();
});

test(`Given the App renders, 
      When an API call is made with an unsuccessful response, 
      Then the loading text should not appear on the page.`, async () => {
  server.use(
    http.get("https://swapi.dev/api/people/1", () => {
      return HttpResponse.json(null, {
        status: 404,
      });
    })
  );

  render(<App />);

  await screen.findByText("404 Not Found");
  const someLoadingText = screen.queryByText("...loading");

  expect(someLoadingText).not.toBeInTheDocument();
});
