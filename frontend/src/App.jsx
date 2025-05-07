import { useState } from 'react';
import './App.css';
import WikiSearchInput from './WikiSearchInput';
import GraphVisualizer from './GraphVisualizer.jsx';
import axios from 'axios';

function App() {
  const [startPage, setStartPage] = useState(null);
  const [endPage, setEndPage] = useState(null);

  const handleGoClick = async () => {
    if (startPage && endPage) {
      try {
        const response = await axios.post("url", {
          startPage: startPage,
          endPage: endPage
        })

        console.log("Response:", response.data);
      }

      catch (error) {
        console.error("axios error ", error)
      }
    } else {
      alert("Please select both start and end Wikipedia articles.");
    }
  };


  const graphData = {
    nodes: [
      { id: '19078', title: 'Afghanistan' },
      { id: '12345', title: 'Asia' },
      { id: '67890', title: 'Kabul' }
    ],
    links: [
      { source: '19078', target: '12345' },
      { source: '19078', target: '67890' }
    ]
  }

  return (
    <>
      <div className="bg-[#F2F6D0] w-full min-h-screen custom-font flex flex-col justify-start items-center pt-10">
        <div className="text-[#443627] text-5xl mb-20">
          SIX DEGREES OF WIKIPEDIA
        </div>

        <div className="text-[#D98324] text-xl mb-[40px]">
          Find the shortest path between
        </div>

        <div className="flex flex-col md:flex-row text-[#443627] items-center mb-12 gap-4 md:gap-6">
          <WikiSearchInput onSelect={setStartPage} />

          <div className="text-[#443627] text-xl font-semibold">to</div>

          <WikiSearchInput onSelect={setEndPage} />
        </div>

        <button
          onClick={handleGoClick}
          className="relative w-[80px] h-[70px] rounded-full border-none outline-none cursor-pointer select-none touch-manipulation transition duration-300 outline outline-[10px] custom-outline-red"
        >
          <span className="absolute inset-0 rounded-full bg-[#a8323c]"></span>
          <span className="absolute inset-0 flex items-center justify-center rounded-full border border-[#a8323c] font-semibold text-[1.2rem] translate-y-[-15%] transition duration-150 shadow-[0_0.5em_1em_-0.2em_rgba(168,50,60,0.5)] bg-gradient-to-t from-[#ff5a78]/60 via-[#ff5a78] to-[#ff5a78] text-[#a8323c] active:translate-y-0 active:shadow-none">
            Go!
          </span>
        </button>
        <GraphVisualizer />
      </div>


    </>
  );
}

export default App;
