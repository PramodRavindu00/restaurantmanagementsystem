import Footer from "./components/Footer";
import Main from "./pages/Main";

function App() {
  return (
    <div className="app-container"
    style={{
      display:'flex',
      flexDirection: 'column',
      minHeight : '100vh'
    }}>
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;
