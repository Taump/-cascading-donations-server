import obyteInstance from "../services/obyteInstance.js";

export const getDecimals = async (asset) => {

  if (asset === "base") return 9

  const descriptionHashVar = await obyteInstance.api.getAaStateVars({ address: process.env.TOKEN_REGISTRY_ADDRESS, var_prefix: `current_desc_${asset}` });
  const descriptionHash = descriptionHashVar[`current_desc_${asset}`]
  const decimalsVar = descriptionHash && await obyteInstance.api.getAaStateVars({ address: process.env.TOKEN_REGISTRY_ADDRESS, var_prefix: `decimals_${descriptionHash}` });

  return decimalsVar?.[`decimals_${descriptionHash}`] || 0
}