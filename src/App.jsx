import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  HomePage,
  Profile,
  CreateCampaign,
  CampaignDetails,
  FAQPage,
} from "./pages";
import { Navbar, Sidebar } from "./components";

export default function Home() {
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
