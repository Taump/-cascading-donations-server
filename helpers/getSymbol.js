import obyteInstance from "../services/obyteInstance.js";

export const getSymbol = async (asset) => {
  if (asset === "base") return "GBYTE"

  const aaStateVars = await obyteInstance.api.getAaStateVars({ address: process.env.TOKEN_REGISTRY_ADDRESS, var_prefix: `a2s_${asset}` });

  if (`a2s_${asset}` in aaStateVars) {
    return aaStateVars[`a2s_${asset}`];
  } else {
    return asset
  }
}