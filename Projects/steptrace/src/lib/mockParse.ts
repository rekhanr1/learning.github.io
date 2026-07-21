import type { ParsedStep } from "./types";

const BRACKET_TORQUE_STEPS: ParsedStep[] = [
  {
    title: "Stage bracket on fixture",
    description:
      "Place mounting bracket BRK-4471 onto assembly fixture F-12 with the chamfered edge facing up and toward the operator. Confirm the bracket seats flush against the fixture stops.",
    tools: [],
    materials: ["Mounting bracket, P/N BRK-4471"],
    caution: null,
    captureType: "none",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Install bolts hand-tight",
    description:
      "Insert one M6x20 hex bolt through each of the four mounting holes, each with a split lock washer underneath the bolt head. Thread each bolt in by hand until snug. Do not use a power tool for this step.",
    tools: [],
    materials: ["M6x20 hex bolt (qty 4)", "M6 split lock washer (qty 4)"],
    caution: null,
    captureType: "none",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Apply threadlocker",
    description:
      "Remove bolt 3 (lower-right position) and apply one drop of medium-strength blue threadlocker to the threads before reinstalling hand-tight.",
    tools: [],
    materials: ["Threadlocker, medium strength (blue)"],
    caution:
      "Threadlocker is a skin and eye irritant. Wear nitrile gloves and safety glasses. Avoid contact with painted surfaces.",
    captureType: "none",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Torque bolts to spec",
    description:
      "Using the torque wrench and 10mm socket, torque all four bolts in a star (criss-cross) pattern to the specification below. Record the final torque reading observed on the wrench.",
    tools: ["Torque wrench, 5-25 Nm range", "10mm socket"],
    materials: [],
    caution: null,
    captureType: "numeric",
    specLabel: "Torque",
    specValue: "12",
    specUnit: "Nm",
  },
  {
    title: "Inspect bracket alignment",
    description:
      "Visually confirm the bracket is flush and parallel to the reference edge of the fixture, with no visible gap greater than 0.5mm on any side.",
    tools: [],
    materials: [],
    caution: null,
    captureType: "pass_fail",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Final visual inspection",
    description:
      "Inspect all four bolt heads for damage, confirm no threadlocker residue is visible outside the joint, and confirm the bracket is free of scratches.",
    tools: [],
    materials: [],
    caution: null,
    captureType: "pass_fail",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
];

const WIRE_HARNESS_STEPS: ParsedStep[] = [
  {
    title: "Verify harness part number",
    description:
      "Confirm the part number and revision printed on the harness tag matches the traveler for this build (WH-8842). Do not proceed if the part number does not match.",
    tools: [],
    materials: ["Wire harness assembly, P/N WH-8842"],
    caution: null,
    captureType: "none",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Route harness along channel",
    description:
      "Route the harness along wiring channel C-7 per the routing diagram posted at this station, maintaining a minimum 1 inch clearance from any moving components.",
    tools: [],
    materials: [],
    caution:
      "Do not route the harness within 3 inches of hydraulic lines. Chafing against a hydraulic line is a known failure mode at this station.",
    captureType: "none",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Secure harness with cable ties",
    description:
      "Secure the harness to the channel with a nylon cable tie approximately every 4 inches along its length. Trim excess tie length flush with flush-cut snips.",
    tools: ["Flush-cut wire snips"],
    materials: ["Nylon cable ties, 4 inch (qty 10)"],
    caution: null,
    captureType: "none",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Connect and torque connector J12",
    description:
      "Mate connector J12 to the bulkhead receptacle. Using the torque screwdriver, tighten the connector's coupling nut to the specification below.",
    tools: ["Torque screwdriver, 0.5-5 in-lb range"],
    materials: ["Bulkhead connector J12"],
    caution: null,
    captureType: "numeric",
    specLabel: "Torque",
    specValue: "2.5",
    specUnit: "in-lb",
  },
  {
    title: "Continuity check",
    description:
      "Using the continuity tester, verify continuity on all pins of connector J12 per the pin-out chart at this station.",
    tools: ["Continuity tester"],
    materials: [],
    caution: null,
    captureType: "pass_fail",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
  {
    title: "Final dress and tie-off inspection",
    description:
      "Confirm no harness segment sags more than 0.5 inch between tie points, no tie is over-cinched (visibly deforming the harness jacket), and all trimmed tie ends are flush.",
    tools: [],
    materials: [],
    caution: null,
    captureType: "pass_fail",
    specLabel: null,
    specValue: null,
    specUnit: null,
  },
];

export function mockParseWorkInstruction(fileName: string): ParsedStep[] {
  return /harness|wh-8842|2\b/i.test(fileName)
    ? WIRE_HARNESS_STEPS
    : BRACKET_TORQUE_STEPS;
}
