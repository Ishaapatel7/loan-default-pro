import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { MakePrediction } from "./pages/MakePrediction";
import { ModelInfo } from "./pages/ModelInfo";
import { AboutProject } from "./pages/AboutProject";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "predict", Component: MakePrediction },
      { path: "models", Component: ModelInfo },
      { path: "about", Component: AboutProject },
    ],
  },
]);
