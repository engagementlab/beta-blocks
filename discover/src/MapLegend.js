import * as d3 from "d3"
import React, {useState, useEffect} from "react"
import legendCoverup from "./res/img/Legend Coverup.png"

const MapLegend = ({hexes, color, property, format, opacity}) => {
  let features = hexes.features
  let nstops = 5
  let extent = d3.extent(color.domain())

  let scale = d3
    .scaleLinear()
    .domain([0, 1])
    .range(extent)
  let width = 217, height = 37
  let fontSize = 13
  let observedVsExpected = "Observed # issues vs. average"
  const legendLabels = {
    "hex_population": "Population per hexagon",
    "sidewalk_score": "Sidewalk score",
    "walkability_score": "Walkability score",
    "social_need_score": "Social need score",
    "tradeoff_score": "Your combined score",
    "issues_normalized_by_population": "# of issues per 100 people",
    "total_population": "Total population",
    "category_ratio_LIVING CONDITIONS": observedVsExpected,
    "category_ratio_PARKING": observedVsExpected,
    "category_ratio_TRASH, RECYCLING, AND WASTE": observedVsExpected,
    "category_ratio_STREETS, SIDEWALKS, AND PARKS": observedVsExpected,
    "category_ratio_BUILDING AND CONSTRUCTION": observedVsExpected,
    "category_ratio_SNOW": observedVsExpected,
    "category_ratio_ANIMALS": observedVsExpected,
    "category_ratio_TRANSPORTATION, VEHICLES, AND BICYCLES": observedVsExpected,
    "on_time_pc_smoothed": "% of on-time issues",
  }

  // A quick last-minute change to prototype transparent hexagons in the conclusion section
  let hideLegend = color("anything") === "transparent"

  return (hideLegend ? <div /> :
    <div className="App-map-legend">
      <div className="Legend-inner">
        <div className="Legend-label" title={property}>{legendLabels[property] || property}</div>
        <div className="Legend-coverup">
          <svg width={width} height={height} style={{overflow: 'visible'}} >
          <defs>
            <clipPath id="clip-hex">            
              <path stroke="#402B59" d="M 15.714 0.58 L 30.923 9.363 L 30.923 26.926 L 15.714 35.708 L 0.502 26.926 L 0.502 9.363 L 15.714 0.58 Z"></path>
              <path stroke="#402B59" d="M 46.541 0.58 L 61.749 9.363 L 61.749 26.926 L 46.541 35.708 L 31.328 26.926 L 31.328 9.363 L 46.541 0.58 Z"></path>
              <path stroke="#402B59" d="M 77.367 0.58 L 92.575 9.363 L 92.575 26.926 L 77.367 35.708 L 62.155 26.926 L 62.155 9.363 L 77.367 0.58 Z"></path>
              <path stroke="#402B59" d="M 108.193 0.58 L 123.402 9.363 L 123.402 26.926 L 108.193 35.708 L 92.981 26.926 L 92.981 9.363 L 108.193 0.58 Z"></path>
              <path stroke="#402B59" d="M 139.019 0.58 L 154.228 9.363 L 154.228 26.926 L 139.019 35.708 L 123.807 26.926 L 123.807 9.363 L 139.019 0.58 Z"></path>
              <path stroke="#402B59" d="M 169.846 0.58 L 185.054 9.363 L 185.054 26.926 L 169.846 35.708 L 154.633 26.926 L 154.633 9.363 L 169.846 0.58 Z"></path>
              <path stroke="#402B59" d="M 200.672 0.58 L 215.88 9.363 L 215.88 26.926 L 200.672 35.708 L 185.46 26.926 L 185.46 9.363 L 200.672 0.58 Z"></path>
            </clipPath>

            <linearGradient id="Legend-grad">
              {d3.range(nstops).map(d => {
                let pc = d / (nstops - 1)
                return (
                  <stop key={d} offset={Math.round(100*pc) + '%'} stopColor={color(scale(pc))} />
                )
              })}
            </linearGradient>
          </defs>
          <rect height={height-3} width={width-2} fill="url(#Legend-grad)" clipPath="url(#clip-hex)"/>

          <text fontSize={fontSize} y={(height-2)/0.75} x={16}>{format(scale(0))}</text>
          <text fontSize={fontSize} y={(height-2)/0.75} x={width/2}>{format(scale(0.5))}</text>
          <text fontSize={fontSize} y={(height-2)/0.75} x={width-16}>{format(scale(1))}</text>

          </svg>
        </div>
      </div>
    </div>
  )
}

export default MapLegend