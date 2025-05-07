"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function GraphVisualizer() {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Sample graph data
    const data = {
      nodes: [
        { id: "Node 1", group: 1 },
        { id: "Node 2", group: 2 },
        { id: "Node 3", group: 2 },
        { id: "Node 4", group: 3 },
        { id: "Node 5", group: 3 },
        { id: "Node 6", group: 4 },
      ],
      links: [
        { source: "Node 1", target: "Node 2", value: 1 },
        { source: "Node 2", target: "Node 3", value: 1 },
        { source: "Node 3", target: "Node 4", value: 1 },
        { source: "Node 4", target: "Node 5", value: 1 },
        { source: "Node 5", target: "Node 6", value: 1 },
        { source: "Node 1", target: "Node 3", value: 1 },
        { source: "Node 2", target: "Node 4", value: 1 },
        { source: "Node 3", target: "Node 5", value: 1 },
      ],
    }

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create the simulation with forces
    const simulation = d3
      .forceSimulation()
      .nodes(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))

    // Create the SVG container
    const svg = d3.select(svgRef.current)

    // Define arrow markers for the links
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // Position the arrow away from the node
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none")

    // Create the links
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("marker-end", "url(#arrowhead)") // Add arrow to the end of the line

    // Create the nodes
    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", (d, i) => {
        // First and last nodes are bigger
        if (i === 0 || i === data.nodes.length - 1) {
          return 15
        }
        return 10
      })
      .attr("fill", (d, i) => {
        // First node is red, last node is green
        if (i === 0) return "#ff5555"
        if (i === data.nodes.length - 1) return "#55dd55"
        return "#6495ED"
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))

    // Add labels to the nodes
    const text = svg
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .text((d) => d.id)
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", "#333")

    // Update positions on each tick of the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)

      text.attr("x", (d) => d.x).attr("y", (d) => d.y)
    })

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Cleanup function
    return () => {
      simulation.stop()
    }
  }, [])

  return (
    <div className="w-[1000px] h-full bg-white rounded-lg shadow-lg mt-12 mb-6 p-4">
      <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" />
      </div>
    </div>
  )
}
