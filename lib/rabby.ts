
export type EIP1193Provider = {
  request: (args: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;
};

type EIP6963ProviderDetail = {
  info: {
    name: string;
    rdns: string;
  };
  provider: EIP1193Provider;
};

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

function findRabbyProvider(): Promise<EIP1193Provider> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Wallet is only available in the browser."));
      return;
    }

    let finished = false;

    const handleProvider = (event: Event) => {
      const customEvent = event as CustomEvent<EIP6963ProviderDetail>;
      const detail = customEvent.detail;

      if (!detail?.provider || !detail?.info) {
        return;
      }

      if (detail.info.rdns === "io.rabby") {
        finished = true;
        window.removeEventListener(
          "eip6963:announceProvider",
          handleProvider
        );
        resolve(detail.provider);
      }
    };

    window.addEventListener(
      "eip6963:announceProvider",
      handleProvider
    );

    window.dispatchEvent(new Event("eip6963:requestProvider"));

    setTimeout(() => {
      if (finished) {
        return;
      }

      window.removeEventListener(
        "eip6963:announceProvider",
        handleProvider
      );

      if (window.ethereum) {
        resolve(window.ethereum);
      } else {
        reject(
          new Error(
            "Rabby was not detected. Please make sure the Rabby browser extension is installed and unlocked."
          )
        );
      }
    }, 1000);
  });
}

export async function connectRabby() {
  const provider = await findRabbyProvider();

  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error("Rabby did not return a wallet address.");
  }

  const chainId = (await provider.request({
    method: "eth_chainId",
  })) as string;

  const numericChainId = parseInt(chainId, 16);

  if (numericChainId !== 61997) {
    throw new Error(
      `Rabby is currently connected to chain ${numericChainId}. FlowSplit requires GenLayer Studio-dev (chain 61997). Please switch Rabby to chain 61997 and try again.`
    );
  }

  return {
    address: accounts[0] as `0x${string}`,
    provider,
  };
}
