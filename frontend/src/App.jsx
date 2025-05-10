"use client"

import { useState } from "react"
import "./App.css"
import WikiSearchInput from "./WikiSearchInput"
import GraphVisualizer from "./GraphVisualizer.jsx"
import axios from "axios"

function App() {
  const [startPage, setStartPage] = useState(null)
  const [endPage, setEndPage] = useState(null)
  const [graphData, setGraphData] = useState(null) 
  const [isLoading, setIsLoading] = useState(false) 

  const handleGoClick = async () => {
    if (startPage && endPage) {
      try {
        setIsLoading(true) 
        const response = await axios.post("http://localhost:3000", {
          startPage: startPage,
          endPage: endPage,
        })

        console.log(response.data)

     
        const paths = response.data.result
        const graph = convertPathsToGraph(paths)
        setGraphData(graph)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    } else {
      alert("Please select both start and end Wikipedia articles.")
    }
  }

  function convertPathsToGraph(paths) {
    const nodeMap = new Map()
    const links = []

    let groupCounter = 1


    for (const path of paths) {
      for (let i = 0; i < path.length; i++) {
        const node = path[i]


        if (!nodeMap.has(node.id)) {
          nodeMap.set(node.id, {
            id: node.title,
            group: groupCounter++,
          })
        }

        if (i < path.length - 1) {
          const source = path[i].title
          const target = path[i + 1].title
          links.push({
            source,
            target,
            value: 1,
          })
        }
      }
    }

    const nodes = Array.from(nodeMap.values())

  
    const lastNodeTitle = paths[paths.length - 1][paths[paths.length - 1].length - 1].title


    nodes.forEach((node) => {
      if (node.id === lastNodeTitle) {
        node.isLastNode = true
      } else {
        node.isLastNode = false
      }
    })

    console.log(nodes)
    console.log(links)

    return {
      nodes,
      links,
    }
  }

  return (
    <>
      <div className="bg-[#F2F6D0] w-full min-h-screen custom-font flex flex-col justify-start items-center pt-10">
        <div className="text-[#443627] text-5xl mb-20">SIX DEGREES OF WIKIPEDIA</div>

        <div className="text-[#D98324] text-xl mb-[40px]">Find the shortest path between</div>

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

        
        {isLoading && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#a8323c] border-t-[#D98324] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#443627] text-lg">Finding the shortest path...</p>
          </div>
        )}

        {!isLoading && graphData && <GraphVisualizer data={graphData} />}
      </div>
    </>
  )
}

export default App
