import { Game } from "./components/Game";

function App() {
  return (
    <div className="h-screen bg-slate-50 text-slate-900">
      <div className="container mx-auto flex h-full flex-col items-center justify-center gap-4">
        <Game />
      </div>
    </div>
  );
}

export default App;
