import React, {useState, useEffect} from "react"
import {Map} from "./Map.js"
import {appIntro as appIntro311, sections as sections311, sectionOrder as sectionOrder311} from "./sections_311.js"
import {appIntro as appIntroScoring, sections as sectionsScoring, sectionOrder as sectionOrderScoring} from "./sections_scoring.js"
import "mapbox-gl/dist/mapbox-gl.css"
import "./App.css"
import {hexes, CATEGORY_NAMES} from "./data.js"
import * as d3 from "d3"
import MapLegend from "./MapLegend.js"

const MapOverlay = ({children}) => {
  return <div className="MapOverlay">{children}</div>
}

const App = () => {
  let features = hexes.features
  // Whether to show the 'hover the map' mesage
  let [hoveredBefore, setHoveredBefore] = useState(false) //

  // Make sure to reset the hoveredBefore indicator when the sections reset.
  let [sectionIndex, _setSectionIndex] = useState(null)
  let setSectionIndex = value => {
    // reset the hover indicator every time we go back to the first screen
    if (value == 0 ) {
      setHoveredBefore(false)
    }
    _setSectionIndex(value)
  }

  // The module name is '311' or 'scoring'
  let [moduleName, setModuleName] = useState('311')

  let sections = {'311': sections311, 'scoring': sectionsScoring}[moduleName]
  let sectionOrder = {'311': sectionOrder311, 'scoring': sectionOrderScoring}[moduleName]
  let section = sections[sectionOrder[sectionIndex || 0]]

  // Section state is specified in the individual modules.
  let [sectionState, setSectionState] = useState(() => section.defaultState(features))

  // Reset section state when sections change
  useEffect(() => setSectionState(section.defaultState(features)), [sectionIndex])

  let {property, color, legendFormat, composition} = sectionState
  let numSections = sectionOrder.length

  // The map hover
  let [hoverFeatures, setHoverFeatures] = useState([])
  if (hoverFeatures.length && !hoveredBefore) {
    setHoveredBefore(true)
  }

  let appIntro = moduleName == '311' ? appIntro311 : appIntroScoring

  return (
    <div className={"App " + sectionOrder[sectionIndex || 0]}>
      {sectionIndex === null && (
        <div className="App-intro">
          <div className={"App-module-picker m-" + moduleName}>
            <div className='m-311' onClick={() => {setModuleName('311');}}>Explore 311 Data</div>
            <div className='m-scoring' onClick={() => {setModuleName('scoring');}}>Explore Decision-making</div>
          </div>
          {appIntro}

            <a className="App-get-started" onClick={() => setSectionIndex(0) }>
                <span>Get Started</span>
                <div>
                  <svg width="110" height="110" fill="none" viewBox="0 0 110 110">
                    <path stroke="#fcbd0b" strokeWidth="4" d="M53.084 1.416L106.17 54.5l-53.085 53.084M0 54.5h106.103" />
                  </svg></div>
              </a>
        </div>
      )}

      {sectionIndex !== null && [
        <Sidebar key="sidebar">

          {section.body({features, sectionState, setSectionState, hexes, property, color})}
          <SectionNavigator
            title={
              sectionIndex === numSections - 1
                ? "Back to Beginning"
                : sections[sectionOrder[sectionIndex + 1]].buttonTitle
            }
            sectionOrder={sectionOrder}
            sectionIndex={sectionIndex}
            setSectionIndex={setSectionIndex}
            numSections={numSections}
          />
        </Sidebar>,


        sectionIndex > 1 && sectionIndex < 5 && (
          <MapOverlay key="map-overlay">
            <MapLegend hexes={hexes} property={property} color={color} format={legendFormat} />
            {!hoveredBefore && <div className='hover-instruction'>{navigator.platform.match(/i(Phone|Pod)/i) ? "Tap on" : "Hover"} the map to inspect the data.</div>}
            {hoverFeatures.length > 0 && section.hoverInfo && section.hoverInfo({hoverFeatures, sectionState})}
          </MapOverlay>
        )
      ]}

      <Map
        composition={composition}
        hexes={hexes}
        property={property}
        color={color}
        stroke={!!sectionState.stroke}
        opacity={sectionIndex === null ? 0 : sectionState.opacity}
        sectionIndex={sectionIndex}
        showYouAreHere={sectionIndex === null}
        showNeighborhoods={sectionIndex > 1}
        clickZoomable={moduleName == '311' && sectionIndex == 5}
        fadeOpacity={
          sectionIndex !== null && sectionState.fadeOpacity !== undefined
            ? sectionState.fadeOpacity
            : 0.65
        }
        onHover={features => setHoverFeatures(features)}
        onUnhover={features => setHoverFeatures([])}
      />
    </div>
  )
} 

const Sidebar = ({children}) => <div className="App-sidebar">{children}</div>

const SectionNavigator = ({title, sectionIndex, setSectionIndex, numSections, sectionOrder}) => {
  let activeIf = target => (sectionIndex === target ? " active" : "")
  
  let lastSection = sectionIndex === numSections - 1
  return (
    <div className="SectionNavigator">
      <div
        onClick={() =>
          setSectionIndex(lastSection ? null : (sectionIndex + 1) % numSections)
        }
        className={!lastSection ? "SectionNavigator-main" :  "SectionNavigator-main last"}>
        <div className="SectionNavigator-heading">
          <div className="SectionNavigator-title">
            {lastSection ? "Back to Beginning" : title}
          </div>
        </div>
        <NextButton flip={lastSection} />
      </div>
      <div className="SectionNavigator-dots">
        <div className="border"></div>
        <div className="dots">
          {d3.range(sectionOrder.length).map(n => (
            <div
              key={n}
              onClick={() => setSectionIndex(n)}
              className={"SectionNavigator-dot" + activeIf(n)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const NextButton = ({flip, onClick}) => (
  <div onClick={onClick} className={"NextButton" + (flip ? " flip" : "")}>
      <svg width="51" height="51" fill="none" viewBox="0 0 51 51">
          <path stroke="#FCBD0B" strokeWidth="4" d="M24.073 1.427L48.147 25.5 24.073 49.573M0 24.39h48.117"/>
      </svg>
  </div>
)

export default App
