import mapboxgl from "mapbox-gl"
import mapboxToken from "./mapbox-token.js"
import React, {useState, useEffect, useRef} from "react"
import * as d3 from "d3"
import * as h3 from "h3-js"
import pin from "./res/img/pin.png"
import labels from "./res/img/Labels.svg"
import * as City_of_Boston_Boundary from "./res/data/City_of_Boston_Boundary.json"
import {h3Geocode, lngLat, H3_LEVEL, CODE_TO_FEATURE} from "./data.js"

mapboxgl.accessToken = mapboxToken

const DEFAULT_COLOR = "rgba(255,255,255,0.15)"
const params = new URL(document.baseURI).searchParams

const labelsAreHere = [42.330158, -71.083664].reverse() // center of the figma layers image, Elizabeth's version, default fonts

const youAreHere =
    params.has("lng") && params.has("lat")
        ? [+params.get("lng"), +params.get("lat")]
        : [42.330158, -71.083664].reverse() 

const youAreHereZoom = 15

const bostonCenter = [-71.083664, 42.330158]
const bostonZoom = 11.2
const mapClickZoom = 13

const markerImg = src => {
    let img = document.createElement("img")
    img.src = src
    img.style.width = "64px"
    img.style.transform = "translate(-50%, -100%)"
    return img
}

const labelImg = src => {
    let img = document.createElement("img")
    img.className = "label-img-marker"
    img.src = src
    img.style.width = `${1156 / 2}px`
    img.style.transform = "translate(-50%, -100%)"
    return img
}

// Used to fill hexagons on the tradeoff screen
const mapboxFillComposition = (features, properties, composition, color) => {
    let nstops = 10
    let extent = d3.extent(color.domain())
    let scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range(extent)

    let scores = features
        .map(
            d =>
                d.properties[properties[0]] * composition[0] +
                d.properties[properties[1]] * composition[1] +
                d.properties[properties[2]] * composition[2]
        )
        .filter(d => !Number.isNaN(d))
        .sort()

    let q = d3.quantile(scores, 0.97) // highlight the top percentile

    let [pc_1, pc_2, pc_3] = composition
    let expr = [
        "case",
        ["==", null, ["get", properties[0]]],
        DEFAULT_COLOR,

        [
            "interpolate",
            ["linear"],
            [
                "+",
                ["*", pc_1, ["get", properties[0]]],
                ["*", pc_2, ["get", properties[1]]],
                ["*", pc_3, ["get", properties[2]]]
            ],
            ...d3.range(nstops).flatMap(d => {
                let pc = d / (nstops - 1)
                let s = scale(pc)
                return s < q ? [s, color(scale(pc))] : []
            }),

            // highlight the top cells to show the distribution of where needs would be addressed
            q - 0.01,
            color(scale(q - 0.01)),
            q,
            "#FCFF61"
        ]
    ]
    return expr
}

// Regular data-based hexagon fill
const mapboxFill = (features, property, color) => {
    // Given a list of features, a property, and a color scale,
    // return a mapbox-compatible fill specification.
    let nstops = 10
    let extent = d3.extent(color.domain()) // d3.extent(features, d => d.properties[property])
    let scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range(extent)

    return {
        property,
        stops: d3.range(nstops).map(d => {
            let pc = d / (nstops - 1)
            return [scale(pc), color(scale(pc))]
        }),
        default: DEFAULT_COLOR
    }
}

let markerInstance;
export const Map = ({
    showNeighborhoods,
    hexes,
    property,
    color,
    opacity,
    fadeOpacity,
    stroke,
    showYouAreHere,
    onHover,
    onUnhover,
    composition,
    sectionIndex,
    clickZoomable
}) => {
    let container = useRef(null)
    let [map, setMap] = useState(null)
    let [mapReady, setMapReady] = useState(false)

    let features = hexes.features

    const youAreHereMarker = new mapboxgl.Marker(markerImg(pin), {
        offset: {
            x: 0,
            y: -10
        }
    }).setLngLat(youAreHere)

    const labelMarker = new mapboxgl.Marker(labelImg(labels), {
        offset: {
            x: 0,
            y: -10
        }
    }).setLngLat(labelsAreHere)

    let topLayer = "water-point-label"

    // Set map state when the map is loaded
    useEffect(() => {
        let map = new mapboxgl.Map({
            container: container.current,
            style: "mapbox://styles/johnnycrich/cjvwv51ii27h21cmue64bauc7",
            center: bostonCenter,
            zoom: bostonZoom,
            interactive: false
        })

        map.on("load", () => {
            // Move the fade layer up to the top. There doesn't
            // appear to be a way to do this from within Mapbox Studio
            map.moveLayer("fade", topLayer)

            // Mapbox is bad at updating the local when the style has changed...
            // Move the neighborhood layer into oblivion.
            // map.setLayoutProperty("settlement-subdivision-label", "visibility", "none")

            map.addSource("boston-boundary", {
                type: "geojson",
                data: City_of_Boston_Boundary.default,
                maxzoom: Math.ceil(youAreHereZoom),
                buffer: 64 // default: 128
            })

            // Add an initial static hexbin GeoJSON for testing
            map.addSource("hexes", {
                type: "geojson",
                data: hexes,
                maxzoom: Math.ceil(youAreHereZoom),
                buffer: 64 // default: 128
            })

            map.addSource("youAreHere", {
                type: "geojson",
                data: {
                    type: "Point",
                    coordinates: youAreHere
                }
            })

            let hexBefore = topLayer

            map.addLayer(
                {
                    id: "boston-boundary-stroke",
                    type: "line",
                    source: "boston-boundary",
                    paint: {
                        "line-color": "#A6B3BC",
                        "line-width": 0.75,
                        "line-opacity": 0.75
                    }
                },
                hexBefore
            )

            map.addLayer(
                {
                    id: "boston-boundary-fill",
                    type: "fill",
                    source: "boston-boundary",
                    paint: {
                        "fill-color": "#A6B3BC",
                        "fill-opacity": 0.15
                    }
                },
                hexBefore
            )

            map.addLayer(
                {
                    id: "hex-fills",
                    type: "fill",
                    source: "hexes",
                    transition: {
                        duration: 500, // match css fade transitions
                        delay: 0
                    },
                    paint: {
                        "fill-opacity": 0
                    }
                },
                hexBefore
            )

            map.addLayer(
                {
                    id: "hex-strokes",
                    type: "line",
                    source: "hexes",
                    transition: {
                        duration: 500, // match css fade transitions
                        delay: 0
                    },
                    paint: {
                        "line-color": "#A6B3BC",
                        // some hex outlines don't overlap, leading to visible artifacts.
                        // set the color to off-white rather than using white + opacity.
                        "line-opacity": 0,
                        "line-width": 0.75
                        // "line-width": 1.5,
                    }
                },
                hexBefore
            )

            map.addLayer(
                {
                    id: "blip",
                    source: "youAreHere",
                    type: "circle",
                    paint: {
                        "circle-radius": 0,
                        "circle-radius-transition": {
                            duration: 0
                        },
                        "circle-opacity-transition": {
                            duration: 0
                        },
                        "circle-color": "#4C85AA"
                    }
                },
                hexBefore
            )

            map.addLayer(
                {
                    id: "hex-hovers",
                    type: "fill",
                    source: "hexes",
                    transition: {
                        duration: 500, // match css fade transitions
                        delay: 0
                    },

                    paint: {
                        "fill-color": "#000",
                        "fill-opacity": [
                            "case",
                            ["boolean", ["feature-state", "hover"], false],
                            0.35,
                            0
                        ]
                    }
                },
                hexBefore
            )

            if(showYouAreHere) 
                markerInstance = youAreHereMarker.addTo(map)

            labelMarker.addTo(map)
        })

        let hoveredHexCodes = []

        // When the user moves their mouse over the hex-hovers layer, we'll update the
        // feature state for the feature under the mouse.
        map.on("mousemove", "hex-hovers", e => {
            if (e.features.length > 0) {
                // Trigger outside events based on mouse interactions.
                // Note: This may trigger unhover-hover in sequence for some hexagons

                onUnhover(hoveredHexCodes.map(code => CODE_TO_FEATURE[code]))

                hoveredHexCodes.forEach(code =>
                    map.setFeatureState(
                        {source: "hexes", id: CODE_TO_FEATURE[code].id},
                        {hover: false}
                    )
                )

                let code = h3Geocode(e.features[0], H3_LEVEL)
                hoveredHexCodes = h3
                    .kRing(code, H3_LEVEL > 9 ? 2 : 1)
                    .filter(code => code in CODE_TO_FEATURE)

                hoveredHexCodes.forEach(code => {
                    map.setFeatureState(
                        {source: "hexes", id: CODE_TO_FEATURE[code].id},
                        {hover: true}
                    )
                })

                onHover(hoveredHexCodes.map(code => CODE_TO_FEATURE[code]))
            }
        })

        // When the mouse leaves the hex-fill layer, update the feature state of the
        // previously hovered feature.
        map.on("mouseleave", "hex-hovers", () => {
            onUnhover(hoveredHexCodes.map(code => CODE_TO_FEATURE[code]))

            hoveredHexCodes.forEach(code =>
                map.setFeatureState(
                    {source: "hexes", id: CODE_TO_FEATURE[code].id},
                    {hover: false}
                )
            )
            hoveredHexCodes.length = 0
        })

        setMapReady(false)
        setMap(map)

        // this is questionable but the best way I've discovered thus far
        // to reliably check for the style being loaded and the map ready for use.
        map.on("idle", e => {
            setMapReady(map.isStyleLoaded())
        })

        return () => {
            map.remove()
        }
    }, [container])

    useEffect(() => {
        let animating = true

        let flip = true
        let fn = e => {
            clickZoomable &&
                map.flyTo({
                    center: flip ? lngLat(e.features[0]).reverse() : bostonCenter,
                    zoom: flip ? mapClickZoom : bostonZoom,
                    bearing: 0,
                    speed: 0.75
                })
            flip = !flip
        }

        if (mapReady) {
            let target, targetZoom

            // Make this the default with || true; that way you can skip around sections with no problem.
            if (
                sectionIndex === null ||
                sectionIndex === 2 ||
                sectionIndex === 5 ||
                true
            ) {
                target = bostonCenter
                targetZoom = bostonZoom
            }

            if (sectionIndex === 0 || sectionIndex === 1) {
                target = youAreHere
                targetZoom = youAreHereZoom
            }
            
            // this is not caching as a Marker instance for some reason, so use dom accessor which works fine
            // remove pin after first step
            // if (sectionIndex > 0)
                markerInstance['_element'].style.display = (sectionIndex > 0 && !showYouAreHere) ? 'none' : 'block'
            // else if(showYouAreHere === true)
            //     markerInstance['_element'].style.display = 'block'            

                console.log(showYouAreHere)
           
            if (target && targetZoom) {
                map.flyTo({
                    // These options control the ending camera position: centered at
                    // the target, at zoom level 9, and north up.
                    center: target,
                    zoom: targetZoom,
                    bearing: 0,
                    offset: [300, -100],
                    // These options control the flight curve, making it move
                    // slowly and zoom out almost completely before starting
                    // to pan.
                    speed: 0.75 // 0.4 // make the flying slow
                    // curve: 1, // change the speed at which it zooms out
                })
            }

            if (composition) {
                let properties = [
                    "sidewalk_score",
                    "walkability_score",
                    "social_need_score"
                ]
                map.setPaintProperty(
                    "hex-fills",
                    "fill-color",
                    mapboxFillComposition(features, properties, composition, color)
                )
            } else {
                map.setPaintProperty(
                    "hex-fills",
                    "fill-color",
                    mapboxFill(features, property, color)
                )
            }

            map.setPaintProperty("fade", "background-opacity", fadeOpacity)
            map.setPaintProperty(
                "hex-fills",
                "fill-opacity",
                Math.max(0.01, opacity)
            )
            map.setPaintProperty("hex-strokes", "line-opacity", stroke ? 1 : 0)
            map.setLayoutProperty(
                "hex-hovers",
                "visibility",
                opacity > 0 ? "visible" : "none"
            )

            map.on("click", "hex-fills", fn)

            let blipStartTime = performance.now()
            let frame = timestamp => {
                let s = 2 * ((timestamp - blipStartTime) / 1000) + Math.PI / 2
                // console.log(t - blipTime)
                let radius = 10 + 5 * Math.sin(s)
                let opacity = Math.max(0, Math.cos(s))
                // console.log('radius', radius, 'opacity', opacity)
                map.setPaintProperty("blip", "circle-radius", radius)
                map.setPaintProperty("blip", "circle-opacity", opacity)
                animating && requestAnimationFrame(frame)
            }

            requestAnimationFrame(frame)
        }

        return () => {
            animating = false
            map && map.off("click", "hex-fills", fn)
        }
    }, [
        showNeighborhoods,
        features,
        property,
        color,
        fadeOpacity,
        opacity,
        stroke,
        showYouAreHere,
        mapReady,
        composition,
        sectionIndex,
        clickZoomable
    ])

    return (
        <div className="Map">
            <div ref={container} className="Map-container" />
        </div>
    )
}
