/**
 * Seafields Estate — 141-lot residential subdivision
 * Lots 81, 82, 9001 & 9005 Pepper Gate, Waggrakine, Geraldton WA 6530
 * CLE Town Planning + Design — Plan No. 3027-06-01
 */

export type LotCategory = "compact" | "standard" | "large" | "premium";

export interface LotData {
  id: string;
  lotNumber: number;
  area: number; // m²
  zone: string;
  category: LotCategory;
}

function cat(area: number): LotCategory {
  if (area < 500) return "compact";
  if (area < 600) return "standard";
  if (area < 700) return "large";
  return "premium";
}

function lot(n: number, area: number, zone: string): LotData {
  return { id: `L${n}`, lotNumber: n, area, zone, category: cat(area) };
}

/**
 * All 141 residential lots.
 * Lot numbers and areas from the CLE subdivision plan.
 * Sizes approximate from plan annotations.
 */
export const LOTS: LotData[] = [
  // ── Collins Road North (top strip) ──
  lot(1, 600, "Collins Road"),
  lot(2, 580, "Collins Road"),
  lot(3, 625, "Collins Road"),
  lot(4, 680, "Collins Road"),
  lot(5, 600, "Collins Road"),
  lot(6, 550, "Collins Road"),
  lot(7, 560, "Collins Road"),
  lot(8, 575, "Collins Road"),

  // ── North Internal ──
  lot(9, 520, "North Internal"),
  lot(10, 548, "North Internal"),
  lot(11, 625, "North Internal"),
  lot(12, 600, "North Internal"),
  lot(13, 560, "North Internal"),
  lot(14, 580, "North Internal"),
  lot(15, 540, "North Internal"),
  lot(16, 502, "North Internal"),
  lot(17, 535, "North Internal"),
  lot(18, 600, "North Internal"),
  lot(19, 680, "North Internal"),
  lot(20, 525, "North Internal"),

  // ── Central North ──
  lot(21, 600, "Central North"),
  lot(22, 625, "Central North"),
  lot(23, 560, "Central North"),
  lot(24, 580, "Central North"),
  lot(25, 520, "Central North"),
  lot(26, 545, "Central North"),
  lot(27, 600, "Central North"),
  lot(28, 680, "Central North"),
  lot(29, 548, "Central North"),
  lot(30, 570, "Central North"),
  lot(31, 525, "Central North"),
  lot(32, 590, "Central North"),
  lot(33, 560, "Central North"),
  lot(34, 600, "Central North"),
  lot(35, 540, "Central North"),

  // ── Central (around POS) ──
  lot(36, 625, "Central"),
  lot(37, 600, "Central"),
  lot(38, 521, "Central"),
  lot(39, 487, "Central"),
  lot(40, 501, "Central"),
  lot(41, 580, "Central"),
  lot(42, 560, "Central"),
  lot(43, 525, "Central"),
  lot(44, 600, "Central"),
  lot(45, 680, "Central"),
  lot(46, 548, "Central"),
  lot(47, 590, "Central"),
  lot(48, 501, "Central"),
  lot(49, 520, "Central"),
  lot(50, 560, "Central"),

  // ── Central South ──
  lot(51, 745, "Central South"),
  lot(52, 525, "Central South"),
  lot(53, 580, "Central South"),
  lot(54, 600, "Central South"),
  lot(55, 548, "Central South"),
  lot(56, 560, "Central South"),
  lot(57, 625, "Central South"),
  lot(58, 590, "Central South"),
  lot(59, 540, "Central South"),
  lot(60, 575, "Central South"),

  // ── South Internal ──
  lot(61, 520, "South Internal"),
  lot(62, 680, "South Internal"),
  lot(63, 600, "South Internal"),
  lot(64, 560, "South Internal"),
  lot(65, 548, "South Internal"),
  lot(66, 580, "South Internal"),
  lot(67, 525, "South Internal"),
  lot(68, 590, "South Internal"),
  lot(69, 540, "South Internal"),
  lot(70, 600, "South Internal"),

  // ── South Central (near Half Moon / Pepper Gate) ──
  lot(85, 560, "South Central"),
  lot(86, 580, "South Central"),
  lot(87, 600, "South Central"),
  lot(88, 548, "South Central"),
  lot(89, 575, "South Central"),
  lot(90, 525, "South Central"),
  lot(91, 502, "South Central"),
  lot(92, 560, "South Central"),
  lot(111, 680, "South Central"),

  // ── David Road Cluster (west section) ──
  lot(71, 576, "David Road"),
  lot(72, 510, "David Road"),
  lot(73, 575, "David Road"),
  lot(74, 521, "David Road"),
  lot(75, 572, "David Road"),
  lot(76, 570, "David Road"),
  lot(77, 640, "David Road"),
  lot(78, 890, "David Road"),
  lot(79, 580, "David Road"),
  lot(80, 510, "David Road"),
  lot(93, 575, "David Road"),
  lot(94, 560, "David Road"),
  lot(95, 548, "David Road"),
  lot(96, 640, "David Road"),
  lot(97, 520, "David Road"),
  lot(98, 580, "David Road"),
  lot(99, 590, "David Road"),
  lot(100, 560, "David Road"),
  lot(105, 575, "David Road"),
  lot(110, 510, "David Road"),
  lot(442, 1522, "David Road"),

  // ── Pepper Gate (south-east) ──
  lot(201, 550, "Pepper Gate"),
  lot(202, 560, "Pepper Gate"),
  lot(203, 580, "Pepper Gate"),
  lot(204, 600, "Pepper Gate"),
  lot(205, 525, "Pepper Gate"),
  lot(206, 548, "Pepper Gate"),
  lot(207, 580, "Pepper Gate"),
  lot(208, 560, "Pepper Gate"),

  // ── Pead Fairway ──
  lot(209, 625, "Pead Fairway"),
  lot(210, 600, "Pead Fairway"),
  lot(211, 580, "Pead Fairway"),
  lot(212, 560, "Pead Fairway"),
  lot(213, 548, "Pead Fairway"),
  lot(214, 575, "Pead Fairway"),
  lot(215, 590, "Pead Fairway"),
  lot(216, 520, "Pead Fairway"),
  lot(217, 560, "Pead Fairway"),
  lot(218, 540, "Pead Fairway"),

  // ── Pirrotta Link ──
  lot(219, 480, "Pirrotta Link"),
  lot(220, 502, "Pirrotta Link"),
  lot(221, 525, "Pirrotta Link"),
  lot(222, 548, "Pirrotta Link"),

  // ── Sutcliffe Road North ──
  lot(225, 505, "Sutcliffe Road"),
  lot(226, 825, "Sutcliffe Road"),
  lot(227, 501, "Sutcliffe Road"),
  lot(228, 505, "Sutcliffe Road"),
  lot(229, 475, "Sutcliffe Road"),
  lot(230, 520, "Sutcliffe Road"),
  lot(231, 553, "Sutcliffe Road"),
  lot(232, 510, "Sutcliffe Road"),
  lot(233, 541, "Sutcliffe Road"),
  lot(234, 462, "Sutcliffe Road"),

  // ── Half Moon Drive ──
  lot(426, 560, "Half Moon Drive"),
  lot(427, 580, "Half Moon Drive"),
  lot(428, 600, "Half Moon Drive"),
  lot(429, 548, "Half Moon Drive"),
  lot(430, 575, "Half Moon Drive"),
  lot(431, 590, "Half Moon Drive"),
  lot(432, 560, "Half Moon Drive"),
  lot(433, 525, "Half Moon Drive"),
  lot(434, 540, "Half Moon Drive"),
];

/** Category display info */
export const CATEGORY_INFO: Record<LotCategory, { label: string; size: string }> = {
  compact:  { label: "Compact",  size: "Under 500m²" },
  standard: { label: "Standard", size: "500–599m²" },
  large:    { label: "Large",    size: "600–699m²" },
  premium:  { label: "Premium",  size: "700m²+" },
};
