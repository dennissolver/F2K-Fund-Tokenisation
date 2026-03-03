export const F2KNavAttestationABI = [
  {
    inputs: [{ internalType: "address", name: "admin", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "recordIndex", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "navPerToken", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalNav", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalSupply", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
      { indexed: false, internalType: "address", name: "publisher", type: "address" },
    ],
    name: "NavPublished",
    type: "event",
  },
  {
    inputs: [],
    name: "currentNav",
    outputs: [
      { internalType: "uint256", name: "navPerToken", type: "uint256" },
      { internalType: "uint256", name: "totalNav", type: "uint256" },
      { internalType: "uint256", name: "totalSupply", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "address", name: "publisher", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "getNavAt",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "navPerToken", type: "uint256" },
          { internalType: "uint256", name: "totalNav", type: "uint256" },
          { internalType: "uint256", name: "totalSupply", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "address", name: "publisher", type: "address" },
        ],
        internalType: "struct F2KNavAttestation.NavRecord",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNavHistory",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "navPerToken", type: "uint256" },
          { internalType: "uint256", name: "totalNav", type: "uint256" },
          { internalType: "uint256", name: "totalSupply", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "address", name: "publisher", type: "address" },
        ],
        internalType: "struct F2KNavAttestation.NavRecord[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "historyLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_navPerToken", type: "uint256" },
      { internalType: "uint256", name: "_totalNav", type: "uint256" },
      { internalType: "uint256", name: "_totalSupply", type: "uint256" },
    ],
    name: "publishNav",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
