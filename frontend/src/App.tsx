import Navbar from "./components/Navbar"
function App(){
    return (
      <div className = "min-h-screen bg-[#FAF8F5] text-[#1C1917]">
        <Navbar />
        <h1 className="text-[#1C1917] font-bold text-rose-600">
          Salon Daniela 

        </h1>
        <p className = "text-gray-600 mt-2"> Programari Online - Nice, France</p>
      </div>
    )
}
export default App