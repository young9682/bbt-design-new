import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter, Routes, Route } from "react-router-dom";
import DesignRefHome from "./DesignRefHome";
import ColorsRef from "./ColorsRef";
import TypographyRef from "./TypographyRef";
import ButtonsRef from "./ButtonsRef";
import CardsRef from "./CardsRef";
import InputsRef from "./InputsRef";
import AnimationsRef from "./AnimationsRef";
import StatusRef from "./StatusRef";
import LayoutsRef from "./LayoutsRef";
import ErrorsRef from "./ErrorsRef";
import DiagnosticsRef from "./DiagnosticsRef";
import Showroom from "./showroom/Showroom";

export function App() {
  return (
    <ChakraProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<DesignRefHome />} />
          <Route path="/colors" element={<ColorsRef />} />
          <Route path="/typography" element={<TypographyRef />} />
          <Route path="/buttons" element={<ButtonsRef />} />
          <Route path="/cards" element={<CardsRef />} />
          <Route path="/inputs" element={<InputsRef />} />
          <Route path="/animations" element={<AnimationsRef />} />
          <Route path="/status" element={<StatusRef />} />
          <Route path="/layouts" element={<LayoutsRef />} />
          <Route path="/errors" element={<ErrorsRef />} />
          <Route path="/diagnostics" element={<DiagnosticsRef />} />
          <Route path="/showroom" element={<Showroom />} />
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}
