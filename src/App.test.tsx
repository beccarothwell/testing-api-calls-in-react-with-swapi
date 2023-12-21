import { render, screen } from "@testing-library/react";
import App from "./App";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer();
const successResponse = http.get("https://swapi.dev/api/people/1", () => {
  return HttpResponse.json({ name: "Luke Skywalker" });
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test(`Given the App renders, 
      When a valid an API call is made with a successful response, 
      Then the Response name should appear on the page.`, async () => {
  server.use(successResponse);

  render(<App />);

  const someName = await screen.findByText("Luke Skywalker");

  expect(someName).toBeInTheDocument();
});
