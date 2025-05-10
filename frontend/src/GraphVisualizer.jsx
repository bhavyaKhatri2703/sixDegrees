"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function GraphVisualizer({data}) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const simulation = d3
      .forceSimulation()
      .nodes(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))

    const svg = d3.select(svgRef.current)

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none")

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
      .attr("marker-end", "url(#arrowhead)")

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", (d, i) => {
        if (i === 0 || data.nodes[i].isLastNode) {
          return 15
        }
        return 10
      })
      .attr("fill", (d, i) => {
        if (i === 0) return "#ff5555"
        if (data.nodes[i].isLastNode) return "#55dd55"
        return "#6495ED"
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))

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

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)

      text.attr("x", (d) => d.x).attr("y", (d) => d.y)
    })

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

    return () => {
      simulation.stop()
    }
  }, [data])

  return (
    <div className="w-[1000px] h-full bg-white rounded-lg shadow-lg mt-12 mb-6 p-4">
      <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" />
      </div>
    </div>
  )
}
