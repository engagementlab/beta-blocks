import React from "react"
import * as d3 from "d3"
import * as _ from "lodash"
import {categories, type_counts, CATEGORY_NAMES, H3_LEVEL} from "./data.js"
import {titleCase} from "./utils.js"

export const moduleName = "311"

export const sectionOrder = [
  "mapOfBoston",
  "introHex",
  "issueDensityMap",
  "mostCommonIssues",
  "timeliness",
  "conclusions"
]

let divergingLogScale = d3
  .scaleDivergingLog(
    // Modulate the fixed scale for the given hex size to a range that display reasonable variation
    [0.75, 1, 1.5],
    d3.interpolateRdPu
  )
  .base(2)
  .clamp(true)

const groupedByCategory = _.groupBy(categories, d => d.category)
const categoryTypeSubtitle = _.fromPairs(
  CATEGORY_NAMES.map(d => [
    d,
    _.sortBy(groupedByCategory[d].map(d => d.type), t => -type_counts[t])
      .slice(0, 7)
      .join(" • ")
  ])
)

export const sections = {
  mapOfBoston: {
    buttonTitle: "A Map of Boston",
    body: () => (
      <div>
        <h1>A Map of Boston</h1>
        <div className="App-subtitle">Our city and its places</div>
        <img className="line" src="line.png" />
        <p>
        First, let’s orient ourselves by looking at this map of Boston.
        </p>
      </div>
    ),
    defaultState: features => {
      let property = "issues_normalized_by_population"
      let format = d3.format("d")
      return {
        property,
        color: Object.assign(
          d => "transparent",
          d3.scaleSequential(
            d3.extent(features, d => d.properties[property]),
            d3.interpolatePlasma
          )
        ),
        opacity: 0,
        legendFormat: d => format(100 * d)
      }
    }
  },

  introHex: {
    buttonTitle: "Into The Hex Grid",
    body: () => (
      <div>
        <h1>311 Data</h1>
        <div className="App-subtitle">From points to hexagons</div>
        <img className="line" src="line.png" />

        <p className="sm">
          Boston’s 311 data includes over 200,000 reports in just the last two years. 
        </p>
        <p className="sm">
          To make patterns in that data easier to see, we have grouped those reports into the hexagons you see on the maps in this tool.
        </p>

      </div>
    ),
    defaultState: features => {
      let property = "issues_normalized_by_population"
      return {
        property,
        color: Object.assign(
          d => "transparent",
          d3.scaleSequential(
            d3.extent(features, d => d.properties[property]),
            d3.interpolatePlasma
          )
        ),
        stroke: true,
        opacity: 0,
        legendFormat: d3.format("d")
      }
    }
  },

  issueDensityMap: {
    buttonTitle: "Where Are the Reports?",
    hoverInfo: ({hoverFeatures, sectionState}) => {
      let round = d3.format(".2f")
      // note: Averaging the smoothed means is a very strange operation, since the amount of data
      // that went into each hex estimate may be very different. A better way to do this is to go
      // back to the source data and perform averaging on the aggregated raw values. But this is
      // close enough for now.
      let mean = d3.mean(hoverFeatures.map(d => d.properties[sectionState.property]))
      let sum = d3.sum(hoverFeatures.map(d => d.properties[sectionState.property]))
      if (mean === undefined) {
        return <div />
      }
      let format = d3.format(",.0f")
      let showingIssues = sectionState.property === "issues_normalized_by_population"

      return (
        <div className="hover-info">
          {showingIssues && (
            <div>
              <b>{format(100 * mean)} issues</b> per 100 people here.
            </div>
          )}
          {!showingIssues && (
            <div>
              <b>{format(sum)}</b> people live here.
            </div>
          )}
        </div>
      )
    },
    body: ({features, sectionState, setSectionState, hexes, property, color}) => {
      let showingIssues = sectionState.property === "issues_normalized_by_population"
      let format = d3.format("d")

      let linkClick = () => {
        let property = showingIssues
          ? "hex_population"
          : "issues_normalized_by_population"
        let domain = showingIssues ? d3.extent(hexes.features, d => d.properties[property]) : [0, 2]
        setSectionState(
          Object.assign({}, sectionState, {
            property,
            color: d3.scaleSequential(domain, d3.interpolatePlasma),
          })
        )
      }

      return (
        <div>
          <h1>Where Are the Reports?</h1>
          <div className="App-subtitle">Where people report most</div>
          <img className="line" src="line.png" />

          <p className="sm">
            The map is colored based on the number of 311 reports per 100 people living in each hexagon. Mouse over the map to see the data for groups of hexagons.
          </p>
          <p className="sm">
            Right now, the map is showing reports per person. See population density instead?
          </p>
          <p className="sm">
            Right now, the map is
            {showingIssues
              ? [" showing reports per person. ", <span key='span' onClick={linkClick} className="link">See population density instead?</span>]
              : [" showing population density. ", <span key='span' onClick={linkClick} className="link">See reports per person instead?</span>]}
          </p>
        </div>
      )
    },
    defaultState: features => {
      let property = "issues_normalized_by_population"
      let format = d3.format(",.0d")
      return {
        property,
        color: d3.scaleSequential(
          // clip off at the high end; the data currently goes to 6 but this way
          // we keep a linear scale while seeing variation in the range we care about
          [0, 2],
          d3.interpolatePlasma
        ),
        opacity: 1,
        legendFormat: d => format(100 * d),
      }
    }
  },

  mostCommonIssues: {
    buttonTitle: "What’s Happening?",
    hoverInfo: ({hoverFeatures, sectionState}) => {
      let mean = d3.mean(hoverFeatures.map(d => d.properties[sectionState.property]))
      if (mean === undefined) {
        return <div />
      }
      let round = d3.format(".2f")
      let percent = d3.format(".0%")
      let pc = percent(Math.abs(mean - 1))

      return (
        <div className="hover-info">
          <div>
            <b className={mean >= 1 ? "more" : "less"}>
              {pc.length === 2 ? <span style={{opacity: 0.001}}>0</span> : ""}
              {pc} {mean >= 1 ? "more than average" : "less than average"}
            </b>{" "}
            issues related to {sectionState.category.toLowerCase()}.
          </div>
        </div>
      )
    },
    body: ({sectionState, setSectionState}) => {
      return (
        <div>
          <h1>What’s Happening?</h1>
          <div className="App-subtitle">
          The most common reports by place
          </div>
          <img className="line" src="line.png" />

          <p className="sm">
          This map colors the hexagons based on whether a category is reported more or less than average. Green means higher than average reporting, and purple means lower than average. Click the categories below to see which places report different categories.
          </p>{" "}
          {CATEGORY_NAMES.map(c => (
            <div
              key={c}
              className={
                "sidebar-option" + (c === sectionState.category ? " active" : "")
              }
              onClick={() =>
                setSectionState(
                  Object.assign({}, sectionState, {
                    category: c,
                    property: `category_ratio_${c}`,
                    color: divergingLogScale
                  })
                )
              }>
              <div className="title">{titleCase(c)}</div>
              {sectionState.category === c && (
                <div className="sample">{categoryTypeSubtitle[c]}</div>
              )}
            </div>
          ))}
        </div>
      )
    },
    defaultState: features => ({
      category: CATEGORY_NAMES[0],
      property: `category_ratio_${CATEGORY_NAMES[0]}`,
      color: divergingLogScale,
      opacity: 1,
      legendFormat: d3.format(".0%")
    })
  },

  timeliness: {
    buttonTitle: "Timeliness",
    hoverInfo: ({hoverFeatures, sectionState}) => {
      let mean = d3.mean(hoverFeatures.map(d => d.properties[sectionState.property]))
      if (mean === undefined) {
        return <div />
      }
      let round = d3.format(".2f")
      let percent = d3.format(".0%")
      let pc = percent(mean)

      return (
        <div className="hover-info">
          <div>
            <b>{pc} of issues</b> are addressed on time here.
          </div>
        </div>
      )
    },
    body: () => (
      <div>
        <h1>Timeliness</h1>
        <div className="App-subtitle">How long until issues are resolved?</div>

        <p className="sm">
          Reports are routed to relevant city departments. But, reports can be quite different. Some (shoveling snow) are time-sensitive and relatively low-effort, while others (tree removal) need to be scheduled in advance. And, for reports on private or federal property, the City of Boston cannot respond.
        </p>
        <p className="sm">
          This map shows how often reports of parking, trash pickup, and abandoned vehicles are addressed on-time.
        </p>
      </div>
    ),
    defaultState: features => {
      let property = "on_time_pc_smoothed"
      return {
        property,
        color: d3.scaleSequential(
          d3.extent(features, d => d.properties[property]),
          d3.interpolatePlasma
        ),
        opacity: 1,
        legendFormat: d3.format('.0%'),
      }
    }
  },

  conclusions: {
    buttonTitle: "Conclusions",
    body: () => (
      <div>
        <h1>Conclusions</h1>
        <div className="App-subtitle">
        311 data can tell us what is happening, where it’s happening, and how long it takes to fix. 
        </div>

        <p className="sm">
          Does this 311 data match your own experience of Boston’s places?
        </p>
        <p className="sm">
          How do you think the maps might be different if all Bostonians reported their problems? 
        </p>
        <p className="sm">
          How do you imagine 311 data could help us make better decisions as a city?
        </p>
      </div>
    ),
    defaultState: features => {
      let property = "issues_normalized_by_population"
      return {
        property,
        color: Object.assign(
          d => "transparent",
          d3.scaleSequential(
            d3.extent(features, d => d.properties[property]),
            d3.interpolatePlasma
          )
        ),
        opacity: 0,
        legendFormat: d3.format("d"),
        stroke: true,
      }
    }
  }
}

export const appIntro = (
  <>
    <h1>Exploring Boston’s Issues, <div>Block-by-Block</div></h1>
    <div className="App-subtitle">What do Bostonians see and report?</div>
    <div className="App-intro-ps">
    <p>Boston 311 lets people report things to the city. What does that 311 data say about your neighborhood?</p>

    </div>
  </>
)
