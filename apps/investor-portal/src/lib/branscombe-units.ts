export type HouseType = "1A" | "1B" | "2A" | "2B" | "2C";

export interface UnitData {
  id: string;
  type: HouseType;
  zone: string;
  /** Grid column (0-based) for SVG map layout */
  col: number;
  /** Grid row (0-based) for SVG map layout */
  row: number;
}

/**
 * All 37 units with house type, zone, and approximate grid positions
 * for the interactive site map. The grid is oriented with Branscombe Road
 * at the bottom (south-west). Positions approximate the L-shaped site layout.
 */
export const UNITS: UnitData[] = [
  // SW Entry cluster (near Branscombe Rd)
  { id: "U1",  type: "1A", zone: "SW Entry",     col: 0, row: 7 },
  { id: "U2",  type: "1B", zone: "SW Entry",     col: 1, row: 7 },
  { id: "U3",  type: "1A", zone: "SW Mid",       col: 0, row: 6 },
  { id: "U4",  type: "2A", zone: "SW Mid",       col: 1, row: 6 },
  { id: "U5",  type: "2B", zone: "SW Entry",     col: 0, row: 8 },
  { id: "U6",  type: "2C", zone: "SW Entry",     col: 1, row: 8 },

  // Mid West along Road 1
  { id: "U7",  type: "1B", zone: "Mid West",     col: 0, row: 5 },
  { id: "U8",  type: "2A", zone: "Mid West",     col: 1, row: 5 },
  { id: "U9",  type: "1A", zone: "Mid West",     col: 2, row: 5 },

  // North / North-West cluster along Road 2
  { id: "U10", type: "2B", zone: "North Mid",    col: 1, row: 3 },
  { id: "U11", type: "1A", zone: "North West",   col: 0, row: 3 },
  { id: "U12", type: "1B", zone: "North West",   col: 0, row: 2 },
  { id: "U13", type: "2A", zone: "North",        col: 1, row: 2 },
  { id: "U14", type: "1A", zone: "North",        col: 1, row: 1 },
  { id: "U15", type: "2B", zone: "North",        col: 2, row: 1 },
  { id: "U16", type: "2C", zone: "North",        col: 2, row: 0 },
  { id: "U17", type: "1B", zone: "North Mid",    col: 2, row: 2 },

  // North-East cluster
  { id: "U18", type: "2A", zone: "NE",           col: 3, row: 1 },
  { id: "U19", type: "1A", zone: "NE Mid",       col: 3, row: 2 },
  { id: "U20", type: "2B", zone: "NE",           col: 4, row: 1 },
  { id: "U21", type: "2C", zone: "East Mid",     col: 4, row: 2 },

  // East / Central-East zone
  { id: "U22", type: "1A", zone: "East",         col: 5, row: 2 },
  { id: "U23", type: "1B", zone: "East Mid",     col: 5, row: 3 },
  { id: "U24", type: "2A", zone: "SE Mid",       col: 4, row: 4 },
  { id: "U25", type: "2B", zone: "SE Mid",       col: 5, row: 4 },

  // South-East cluster along Road 3
  { id: "U26", type: "2C", zone: "SE",           col: 5, row: 5 },
  { id: "U27", type: "1A", zone: "SE",           col: 4, row: 5 },
  { id: "U28", type: "1B", zone: "SE",           col: 5, row: 6 },
  { id: "U29", type: "2A", zone: "South",        col: 4, row: 7 },
  { id: "U30", type: "2B", zone: "South",        col: 3, row: 7 },

  // SE Corner along Road 3 terminus
  { id: "U31", type: "2C", zone: "SE Corner",    col: 5, row: 7 },
  { id: "U32", type: "1A", zone: "SE Corner",    col: 5, row: 8 },
  { id: "U33", type: "1B", zone: "East Lower",   col: 4, row: 6 },
  { id: "U34", type: "2A", zone: "East Lower",   col: 4, row: 3 },
  { id: "U35", type: "2B", zone: "East Lower",   col: 3, row: 4 },
  { id: "U36", type: "2C", zone: "East Mid",     col: 3, row: 3 },
  { id: "U37", type: "1A", zone: "East",         col: 3, row: 5 },
];

export const HOUSE_TYPE_INFO: Record<HouseType, { size: string; beds: number; deck: string }> = {
  "1A": { size: "104m²", beds: 3, deck: "24m² deck" },
  "1B": { size: "104m²", beds: 3, deck: "24m² deck" },
  "2A": { size: "114m²", beds: 3, deck: "24m² deck" },
  "2B": { size: "114m²", beds: 3, deck: "24m² deck" },
  "2C": { size: "114m²", beds: 3, deck: "24m² deck" },
};
