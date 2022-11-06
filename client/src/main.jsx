import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./page/Home";
import CreateBattle from "./page/CreateBattle";
import JoinBattle from "./page/JoinBattle";
import Battle from "./page/Battle";
import "./index.css";
import { GlobalContextProvider } from "./context";
import { Battleground } from "./page";
import { OnboardModal } from "./components";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <OnboardModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-battle" element={<CreateBattle />} />
        <Route path="/join-battle" element={<JoinBattle />} />
        <Route path="/battle/:battleName" element={<Battle />} />
        <Route path="/battleground" element={<Battleground />} />
      </Routes>
    </GlobalContextProvider>
  </BrowserRouter>
);
