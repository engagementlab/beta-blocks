// note: minSize = h3 size minus 2.
import * as hexes from "./res/data/result_8_min.json" // note: big file
import * as issue_density_map_module from "./res/data/issue_density_map_10.json"
import * as category_counts_module from "./res/data/category_counts_10.json"
import * as type_counts_module from "./res/data/type_counts.json"
import categories from "./res/data/categories_out.json"
import * as binned_issues_on_time from "./res/data/binned_issues_on_time_10.json"
import * as unclosed_issues from "./res/data/unclosed_issues_10.json"
import * as h3 from "h3-js"
import * as d3 from "d3"
import * as _ from "lodash"
import {fromPairs} from "lodash"
export const H3_LEVEL = 10 // 10 // 9 // the level of the geojson hexbins
export const MISSING = null

const issue_density_map = issue_density_map_module.data
const category_counts = category_counts_module.data
const type_counts = type_counts_module.data
const time_data = _.mapValues(
    _.groupBy(binned_issues_on_time.default, d => d.geocode),
    _.first
)
const unclosed_data = _.mapValues(
    _.groupBy(unclosed_issues.default, d => d.geocode),
    _.first
)

export {hexes, categories, type_counts}

const flattenNestedObjects = obj =>
    // Flatten nested objects by one level.
    fromPairs(
        Object.entries(obj).flatMap(kv => {
            let [k, v] = kv
            if (typeof v === "object" && !Array.isArray(v) && !!v) {
                return Object.entries(v).map(([sub_k, sub_v]) => [
                    k + "_" + sub_k,
                    sub_v
                ])
            } else {
                return [kv]
            }
        })
    )

export const lngLat = feature => {
    // Extract the center from a hexagon
    let lng = d3.mean(feature.geometry.coordinates[0].slice(1), d => d[1])
    let lat = d3.mean(feature.geometry.coordinates[0].slice(1), d => d[0])
    return [lng, lat]
}

export const h3Geocode = (feature, level) => {
    // note: sampling two opposite coordinates would suffice
    let [lng, lat] = lngLat(feature)
    return h3.geoToH3(lng, lat, level)
}

const smooth = (a, b, d, alpha) => (a + d * alpha) / (b + alpha)

export const CODE_TO_FEATURE = {}

export const CATEGORY_NAMES = [
    "LIVING CONDITIONS",
    "PARKING",
    "TRASH, RECYCLING, AND WASTE",
    "STREETS, SIDEWALKS, AND PARKS"
]

// Every separate dataset is processed in a separate enclosing scope
let id = 0 // used as a unique identifier for every feature
hexes.features.forEach((feature, featureIndex) => {
    // Mapbox doesn't like nested objects; flatten them to e.g. census_b07001057
    // Note that this doesn't iterate to a fixed-point; it de-nests objects one level.
    // featureIndex == 0 && console.log("props", feature.properties)

    feature.properties = flattenNestedObjects(feature.properties)
    feature.id = ++id // label every feature with a positive (truthy) integer for tracking hovers by id
    feature.code = h3Geocode(feature, H3_LEVEL)

    // Issue Density Map
    {
        let b311_issue_count = issue_density_map[feature.code] || MISSING

        // Total population in this census geometry
        // https://www.socialexplorer.com/data/ACS2007/metadata/?ds=ACS07&var=B01003001
        let total_population = feature.properties.census_b01003001
        let census_area = feature.properties.census_area
        let hex_area = feature.properties._area
        // note: this can be >1 if the census geometry is smaller than the hexagon.
        // we clip it to 1 as discussed March 20 2019.
        let proportion_of_census_geometry_in_hex = Math.min(
            1,
            hex_area / census_area
        )
        // Population count estimate for the hex bin
        let hex_population =
            total_population * proportion_of_census_geometry_in_hex

        // Compute a smoothed issues-per-population
        // if total_population === 0 we can gray these out, or define them as zero
        feature.properties.issues_normalized_by_population =
            hex_population === 0 || b311_issue_count === MISSING
                ? MISSING
                : smooth(b311_issue_count, hex_population, 0, 50)

        feature.properties.b311_issue_count = b311_issue_count
        feature.properties.total_population = total_population
        feature.properties.census_area = census_area
        feature.properties.hex_area = hex_area
        feature.properties.proportion_of_census_geometry_in_hex = proportion_of_census_geometry_in_hex
        feature.properties.hex_population = hex_population
    }

    // Most Common Issues
    {
        CATEGORY_NAMES.forEach(c => {
            feature.properties["category_ratio_" + c] = category_counts[c][
                feature.code
            ]
                ? category_counts[c][feature.code].ratio
                : MISSING // 1.0 // Treat missing as 1.
        })
    }

    // Timeliness
    {
        feature.properties.on_time_pc_smoothed =
            feature.code in time_data
                ? time_data[feature.code].on_time_pc_smoothed
                : MISSING
        feature.properties.pc_unclosed_smoothed =
            feature.code in unclosed_data
                ? unclosed_data[feature.code].pc_unclosed_smoothed
                : MISSING
        feature.properties.b311_unclosed_issue_count =
            feature.code in unclosed_data
                ? unclosed_data[feature.code].count
                : MISSING
    }

    // Scoring
    {
        const fp = feature.properties

        // https://drive.google.com/file/d/0B5xorwVOSRdXbGxHMHlabHlVM3c/view
        // average score of sidewalk quality; we invert (1-) so that this denotes the % of sidewalk that needs maintenance.
        fp.sidewalk_score = 1 - fp.sidewalks_area_score / fp.sidewalks_area / 100
        // number of overlapping walksheds; higher = more walkable
        fp.walkability_score = fp._count
        // social need score; higher = more social need
        fp.social_need_score =
            // 0.70 * % of population below poverty level
            0.70 * (fp.census_b17020002 / fp.census_b17020001) +
            // 0.15 * % of 65-year old+ population
            0.15 *
                ((fp.census_b01001020 +
                    fp.census_b01001021 +
                    fp.census_b01001022 +
                    fp.census_b01001023 +
                    fp.census_b01001024 +
                    fp.census_b01001025 +
                    fp.census_b01001044 +
                    fp.census_b01001045 +
                    fp.census_b01001046 +
                    fp.census_b01001047 +
                    fp.census_b01001048 +
                    fp.census_b01001049) /
                    fp.census_b01001001) +
            // 0.15 * % of households with children below age 6
            0.15 *
                ((fp.census_b11004004 +
                    fp.census_b11004011 +
                    fp.census_b11004017) /
                    fp.census_b11004001)
    }

    CODE_TO_FEATURE[feature.code] = feature
})

// Normalize all scores to [0, 1]
let max_sidewalk_score = d3.max(hexes.features, d => d.properties.sidewalk_score)
let max_walkability_score = d3.max(
    hexes.features,
    d => d.properties.walkability_score
)
let max_social_need_score = d3.max(
    hexes.features,
    d => d.properties.social_need_score
)
hexes.features.forEach(feature => {
    let fp = feature.properties
    // Normalize scores to [0, 1]
    fp.sidewalk_score /= max_sidewalk_score
    fp.walkability_score /= max_walkability_score
    fp.social_need_score /= max_social_need_score

    // If any score is missing, make all scores missing
    if (
        Number.isNaN(fp.sidewalk_score) ||
        Number.isNaN(fp.walkability_score) ||
        Number.isNaN(fp.social_need_score)
    ) {
        fp.sidewalk_score = MISSING
        fp.walkability_score = MISSING
        fp.social_need_score = MISSING
    }
})

hexes.features = hexes.features.filter(
    d => !(
        d.properties.sidewalk_score === MISSING &&
        d.properties.walkability_score === MISSING &&
        d.properties.social_need_score === MISSING &&
        d.properties.b311_issue_count === MISSING &&
        d.properties.on_time_pc_smoothed === MISSING
    )
)

export const mean_sidewalk_score = d3.mean(hexes.features, d => d.properties.sidewalk_score)
export const mean_walkability_score = d3.mean(hexes.features, d => d.properties.walkability_score)
export const mean_social_need_score = d3.mean(hexes.features, d => d.properties.social_need_score)

