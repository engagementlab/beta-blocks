import React, {useCallback} from "react"
import * as d3 from "d3"
import * as _ from "lodash"
import {
  mean_sidewalk_score,
  mean_walkability_score,
  mean_social_need_score
} from "./data.js"
import {titleCase} from "./utils.js"

// sidewalk_score
// walkability_score
// social_need_score
const makeComposition = arr => {
  let max = d3.sum(arr)
  return arr.map(d => d / max)
}

export const moduleName = "scoring"

export const sectionOrder = [
  "mapOfBoston",
  "introHex",
  "firstThing",
  "secondThing",
  "thirdThing",
  "allThreeThings"
]

const propHoverInfo = ({hoverFeatures, sectionState}) => {
  let name = {
    sidewalk_score: "sidewalk score",
    walkability_score: "walkability score",
    social_need_score: "social need score"
  }[sectionState.property]

  let meanScore = {
    sidewalk_score: mean_sidewalk_score,
    walkability_score: mean_walkability_score,
    social_need_score: mean_social_need_score
  }[sectionState.property]

  let value = d3.mean(hoverFeatures.map(d => d.properties[sectionState.property]))
  if (value === undefined) {
    return null
  }
  let round = d3.format(".2f")
  let percent = d3.format(".0%")

  let thing = value / meanScore
  console.log("value", value, "meanScore", meanScore, "thing", thing)
  let pc = percent(Math.abs(thing - 1))
  let pcLabel = (
    <span>
      {pc.length === 2 ? <span style={{opacity: 0.001}}>0</span> : ""}
      {pc}
    </span>
  )

  let caption
  switch (sectionState.property) {
    case "sidewalk_score":
      caption = (
        <span>
          <b className={thing >= 1 ? "less" : "more"}>
            {pcLabel} {thing >= 1 ? "worse" : "better"}
          </b>{" "}
          than the average condition.
        </span>
      )
      break
    case "walkability_score":
      caption = (
        <span>
          <b className={thing >= 1 ? "more" : "less"}>
            {pcLabel} {thing >= 1 ? "more" : "less"}
          </b>{" "}
          walkable than average.
        </span>
      )
      break
    case "social_need_score":
      caption = (
        <span>
          <b className={thing >= 1 ? "more" : "less"}>
            {pcLabel} {thing >= 1 ? "more" : "less"}
          </b>{" "}
          social need than average.
        </span>
      )
      break
  }
  return (
    <div className="hover-info">
      <div>
        {caption}
      </div>
    </div>
  )
}

export const sections = {
  mapOfBoston: {
    buttonTitle: "A Map of Boston",
    body: () => (
      <div>
        <h1>A Map of Boston</h1>
        <div className="App-subtitle">Our city and its places</div>
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
            d3.interpolateRdPu
          )
        ),
        opacity: 0,
        legendFormat: d => format(100 * d)
      }
    }
  },

  introHex: {
    buttonTitle: "Sidewalk, Walkability, and Social Need Data",
    body: () => (
      <div>
        <h1>Sidewalk, Walkability, and Social Need Data</h1>
        <div className="App-subtitle">From points to hexagons</div>

        <p className="sm">
          We’ll use three data sets to decide where to fix sidewalks. 
        </p>
        <p className="sm">
          That is a lot of data. To make patterns in that data easier to see, we have included the data from all three data sets, grouped into the hexagons you see on the maps in this tool.
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
            d3.interpolateRdPu
          )
        ),
        stroke: true,
        opacity: 0,
        legendFormat: d3.format("d")
      }
    }
  },

  firstThing: {
    buttonTitle: "Scoring Sidewalks",
    hoverInfo: propHoverInfo,
    body: ({features, sectionState, setSectionState, hexes, property, color}) => {
      return (
        <div>
          <h1>Scoring Sidewalks</h1>
          <div className="App-subtitle">Where are sidewalks in need of repair?</div>

          <p className="sm">
            This map shows where sidewalks in Boston need repairs.
          </p>

          <p className="sm">
            The darker the hexagon, the worse its sidewalks are.
          </p>
        </div>
      )
    },
    defaultState: features => {
      let property = "sidewalk_score"
      return {
        property,
        color: d3.scaleSequential(
          [0, 1],
          d3.interpolateReds
        ),
        opacity: 1,
        legendFormat: d3.format(".0%")
      }
    }
  },

  secondThing: {
    buttonTitle: "Scoring Walkability",
    hoverInfo: propHoverInfo,
    body: ({features, sectionState, setSectionState, hexes, property, color}) => {
      return (
        <div>
          <h1>Scoring Walkability</h1>
          <div className="App-subtitle">Where are sidewalks used most?</div>

          <p className="sm">
            This map shows shops, hospitals, schools, transit stops, and other destinations that make a place accessible and walkable. 
          </p>
          <p className="sm">
            The darker the hexagon, the more destinations it has, and the more its sidewalks are used. 
          </p>
        </div>
      )
    },
    defaultState: features => {
      let property = "walkability_score"
      return {
        property,
        color: d3.scaleSequential([0, 1], d3.interpolateBlues),
        opacity: 1,
        legendFormat: d3.format(".0%")
      }
    }
  },

  thirdThing: {
    buttonTitle: "Scoring Social Need",
    hoverInfo: propHoverInfo,
    body: () => (
      <div>
        <h1>Scoring Social Need</h1>
        <div className="App-subtitle">
          Where are sidewalks needed the most?
        </div>

        <p className="sm">
        This map shows where households are in poverty, and where children and older populations live. These groups need sidewalks because driving and public transit might be unaffordable or inaccessible for them. 
        </p>
        <p className="sm">
          How would you determine social need? 
        </p>
        <p className="sm">
          The darker the hexagon, the larger the population of people needing sidewalks. 
        </p>
      </div>
    ),
    defaultState: features => {
      let property = "social_need_score"
      return {
        property,
        color: d3.scaleSequential(
          d3.extent(features, d => d.properties[property]),
          d3.interpolateGreens
        ),
        opacity: 1,
        legendFormat: d3.format(".0%")
      }
    }
  },

  allThreeThings: {
    buttonTitle: "Tradeoffs",
    hoverInfo: ({hoverFeatures, sectionState}) => null,
    body: ({sectionState, setSectionState}) => {
      let {composition} = sectionState
      let round = d3.format(".0%")

      return (
        <div>
          <h1>Tradeoffs</h1>
          <div className="App-subtitle">
            Data and decisions
          </div>
          <p className="sm">
            How might we combine sidewalk, walkability, and social need scores to decide which sidewalks to repair first? Drag the white circle to change the importance of each data set, and watch the map update priority hexagons in yellow
          </p>

          {composition && (
            <div>
              <p className="scores">
                <div className="social-need-score">
                  {round(composition[2])} social need
                </div>{" "}
                +{" "}
                <div className="walkability-score">
                  {round(composition[1])} walkability
                </div>{" "}
                +{" "}
                <div className="sidewalk-score">
                  {round(composition[0])} sidewalk
                </div>
              </p>

              <TriangleSlider
                composition={sectionState.composition}
                onChange={_.throttle(
                  composition => {
                    setSectionState(Object.assign({}, sectionState, {composition}))
                  },
                  250,
                  {leading: true}
                )}
              />
            </div>
          )}
        </div>
      )
    },
    defaultState: features => {
      let property = `tradeoff_score`
      return {
        property,
        color: d3.scaleSequential([0, 1], d3.interpolateViridis),
        opacity: 1,
        legendFormat: d3.format(".0%"),
        composition: [0.1, 0.1, 0.8]
      }
    }
  }
}

const triArea = (a, b, c) => {
  let [xa, ya] = a,
    [xb, yb] = b,
    [xc, yc] = c
  return 0.5 * (xa * yb + xb * yc + xc * ya - xa * yc - xc * yb - xb * ya)
}

let TriangleSlider = ({composition, onChange}) => {
  let areaGen = d3.area()
  let R = 40
  let {PI, sin, cos, sqrt, abs, pow, max} = Math
  let pi = PI,
    twopi = 2 * PI,
    halfpi = PI / 2
  let o = -halfpi
  let a = [cos(o), sin(o)]
  let b = [cos(o + twopi / 3), sin(o + twopi / 3)]
  let c = [cos(o + (2 * twopi) / 3), sin(o + (2 * twopi) / 3)]
  let pathData = areaGen([a, b, c, a])

  let event = p => {
    let total = triArea(a, b, c)
    let areas = makeComposition(
      [triArea(b, c, p), triArea(c, a, p), triArea(a, b, p)].map(
        area => max(0, area) / total
      )
    )
    onChange(areas)
    return areas
  }

  const triRef = useCallback(node => {
    if (node !== null) {
      let _node = d3.select(node)
      let dragged = () => {
        // [d3.event.x / R, d3.event.y / R]
        let areas = event(d3.mouse(node, node.parentElement))
        // todo: set the circle position immediately
        let x = R * d3.sum([a[0] * areas[0], b[0] * areas[1], c[0] * areas[2]])
        let y = R * d3.sum([a[1] * areas[0], b[1] * areas[1], c[1] * areas[2]])
        circleRefCurrent &&
          d3
            .select(circleRefCurrent)
            .attr("cx", x)
            .attr("cy", y)
      }
      _node.call(
        d3
          .drag()
          .on("drag", dragged)
          .on("start", dragged)
      )
    }
  }, [])

  let circleRefCurrent = null
  const circleRef = useCallback(node => {
    if (node !== null) {
      circleRefCurrent = node
    }
  }, [])

  let areas = composition
  let x = R * d3.sum([a[0] * areas[0], b[0] * areas[1], c[0] * areas[2]])
  let y = R * d3.sum([a[1] * areas[0], b[1] * areas[1], c[1] * areas[2]])

  return (
    <svg
      className="TriangleSlider"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="400"
      height="300"
      viewBox="-50 -50 100 75">
      <defs>
        <linearGradient
          id="a-grad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="rgb(255,0,0,1)" />
          <stop offset="100%" stopColor="rgb(255,255,255,0)" />
        </linearGradient>
        <linearGradient
          id="b-grad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="rgb(0,0,255,1)" />
          <stop offset="100%" stopColor="rgb(255,255,255,0)" />
        </linearGradient>
        <linearGradient
          id="c-grad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="rgb(0,255, 0,1)" />
          <stop offset="100%" stopColor="rgb(255,255,255,0)" />
        </linearGradient>
      </defs>

      <g transform={`scale(${R}, ${R})`}>
        <path
          d={pathData}
          ref={triRef}
          pointerEvents="all"
          stroke="transparent"
          fill={`url(${""}#a-grad)`}
          transform="rotate(0)"
        />
        <path
          d={pathData}
          pointerEvents="none"
          stroke="transparent"
          fill={`url(${""}#b-grad)`}
          transform="rotate(120)"
        />
        <path
          d={pathData}
          pointerEvents="none"
          stroke="transparent"
          fill={`url(${""}#c-grad)`}
          transform="rotate(240)"
        />
      </g>
      <circle
        ref={circleRef}
        cx={x}
        cy={y}
        fill={"#fff"}
        stroke={"#666"}
        r={4.5}
        strokeWidth={0.5}
        pointerEvents="none"
      />
      {[a, b, c].map(([x, y], i) => (
        <circle
          pointerEvents="none"
          key={i}
          r="1"
          cx={R * x}
          cy={R * y}
          fill="#fff"
        />
      ))}
    </svg>
  )
}

export const appIntro = (
  <>
    <h1>Decide Where Change Happens</h1>
    <div className="App-subtitle">
      Can data be used for more sensitive decision-making?
    </div>
    <div className="App-intro-ps">
      <p>
        New technologies from sensors to social media are producing more and more data about our cities, neighborhoods, and streets.
      </p>

      <p>
        When cities make decisions about changing the public realm, they use a variety of data to consider different factors. 
      </p>

      <p>
        If you had to choose where to improve or replace Boston’s sidewalks, how would you do it?
      </p>

    </div>
  </>
)
