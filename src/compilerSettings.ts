export const MAUVE_CORE_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    optimizer: {
      enabled: true,
      runs: 850,
    },
    metadata: {
      // do not include the metadata hash, since this is machine dependent
      // and we want all generated code to be deterministic
      // https://docs.soliditylang.org/en/v0.7.6/metadata.html
      bytecodeHash: "none",
    },
  },
};

export const MAUVE_PERIPHERY_DEFAULT_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

export const MAUVE_PERIPHERY_LOW_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 450,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

export const MAUVE_PERIPHERY_LOWEST_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 450,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

export const MAUVE_SWAP_ROUTER_COMPILER_SETTINGS = {
  version: "0.7.6",
  settings: {
    evmVersion: "istanbul",
    optimizer: {
      enabled: true,
      runs: 49350,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};
