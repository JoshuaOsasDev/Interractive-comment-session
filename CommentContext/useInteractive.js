import { useContext } from "react";
import { InteractiveContent } from "./ComContext";

export const useInteractive = function () {
  const content = useContext(InteractiveContent);

  if (content === undefined) {
    throw new Error("useInteraction must be used within a ContextProvider");
  }
  return content;
};
