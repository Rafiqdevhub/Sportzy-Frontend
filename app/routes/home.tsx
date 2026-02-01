import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sportzy" },
    {
      name: "description",
      content:
        "Welcome to Sportzy, your comprehensive sports management application.",
    },
  ];
}

const Home = () => {
  return <h1>Welcome to Sportzy</h1>;
};

export default Home;
