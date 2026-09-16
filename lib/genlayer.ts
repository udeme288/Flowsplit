import { createClient } from "genlayer-js";
import { studioDevnet } from "genlayer-js/chains";

export const FLOWSPLIT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_FLOWSPLIT_CONTRACT_ADDRESS as `0x${string}`;

export function createGenLayerClient(
  walletAddress: `0x${string}`,
  provider: any
) {
  return createClient({
    chain: studioDevnet,
    account: walletAddress,
    provider,
  });
}