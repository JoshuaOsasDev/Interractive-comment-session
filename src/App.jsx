import { InteractiveProvider } from "../CommentContext/ComContext";
import MainSession from "./ui/MainSession";

function App() {
  return (
    <InteractiveProvider>
      <MainSession />
    </InteractiveProvider>
  );
}

export default App;
