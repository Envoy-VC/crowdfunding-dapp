import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  HomePage,
  Profile,
  CreateCampaign,
  CampaignDetails,
  FAQPage,
} from "./pages";
import { Navbar, Sidebar } from "./components";

import {
  ChainId,
  useNetworkMismatch,
  useNetwork,
  useAddress,
} from "@thirdweb-dev/react";

export default function Home() {
  const address = useAddress(); // Get connected wallet address
  const [, switchNetwork] = useNetwork(); // Switch to desired chain
  const isMismatched = useNetworkMismatch();

  useEffect(() => {
    // Check if the user is connected to the wrong network
    if (isMismatched) {
      // Prompt their wallet to switch networks
      switchNetwork(ChainId.Mumbai); // the chain you want here
    }
  }, [address]);

  return (
    <div className="relative sm:-8 p-4 bg-[#13131A] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </div>
    </div>
  );
}
