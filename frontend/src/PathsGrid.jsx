"use client"

import React, { useEffect, useState } from "react"

const PathsGrid = ({ paths }) => {
  const [articleImages, setArticleImages] = useState({})

  useEffect(() => {
    // Collect all unique article IDs
    const articleIds = new Set()
    paths.forEach((path) => {
      path.forEach((node) => {
        articleIds.add(node.id)
      })
    })

    // Fetch images for all articles
    fetchArticleImages(Array.from(articleIds))
  }, [paths])

  const fetchArticleImages = async (ids) => {
    try {
      // Batch requests in groups of 20 to avoid API limits
      const batchSize = 20
      const imageData = {}

      for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize).join("|")
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=100&pageids=${batchIds}&origin=*`,
        )

        const data = await response.json()

        if (data.query && data.query.pages) {
          Object.values(data.query.pages).forEach((page) => {
            if (page.thumbnail && page.thumbnail.source) {
              imageData[page.pageid] = page.thumbnail.source
            } else {
              // Use a placeholder if no image is available
              imageData[page.pageid] =
                `https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/100px-Wikipedia-logo-v2.svg.png`
            }
          })
        }
      }

      setArticleImages(imageData)
    } catch (error) {
      console.error("Error fetching article images:", error)
    }
  }

  if (!paths || paths.length === 0) return null

  return (
    <div className="w-full max-w-5xl mt-12 mb-16 px-4">
      <h2 className="text-[#443627] text-3xl font-semibold mb-6 font-['Montserrat',sans-serif]">Individual Shortest Paths</h2>
      <div className="bg-[#F8FADF] rounded-lg shadow-md p-4 overflow-x-auto">
        {paths.map((path, pathIndex) => (
          <div
            key={pathIndex}
            className={`flex items-center mb-6 p-4 rounded-md ${pathIndex % 2 === 0 ? "bg-[#F2F6D0]" : "bg-[#F8FADF]"}`}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D98324] flex items-center justify-center text-white font-['Montserrat',sans-serif] text-xl mr-4">
              {pathIndex + 1}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {path.map((node, nodeIndex) => (
                <React.Fragment key={node.id}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex-shrink-0 mr-3 overflow-hidden rounded-md">
                      {articleImages[node.id] ? (
                        <img
                          src={articleImages[node.id] || "/placeholder.svg"}
                          alt={node.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src =
                              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/100px-Wikipedia-logo-v2.svg.png"
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <a
                      href={`https://en.wikipedia.org/?curid=${node.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-['Quicksand',sans-serif] text-[#443627] hover:text-[#a8323c] transition-colors duration-200 font-medium text-lg"
                    >
                      {node.title}
                    </a>
                  </div>
                  {nodeIndex < path.length - 1 && <span className="mx-1 text-[#D98324] text-2xl">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PathsGrid
