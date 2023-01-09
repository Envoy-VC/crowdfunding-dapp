import React, { useContext, createContext } from "react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useStorageUpload } from "@thirdweb-dev/react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  ChainId,
  useNetworkMismatch,
  useNetwork,
  useDisconnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xb7A1C0949Fa55EC7e92c6Dbf7F18B1d61237aa74"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const storage = new ThirdwebStorage();
  const { mutateAsync: upload } = useStorageUpload();

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect({ reconnectPrevious: true });
  const [, switchNetwork] = useNetwork();
  const isMismatched = useNetworkMismatch();

  const checkChain = () => {
    if (isMismatched) {
      switchNetwork(ChainId.Mumbai);
      return true;
    } else return false;
  };

  const publishCampaign = async (form) => {
    const metadata = {
      owner: form.name,
      title: form.title,
      description: form.description,
      category: form.category,
      campaignImage: form.image,
      nftImage: form.nft,
    };
    const uri = await upload({ data: [metadata] });
    const startAt = new Date(form.startAt).getTime();
    const endAt = new Date(form.deadline).getTime();
    const data = await createCampaign([
      address,
      form.target,
      Math.floor(startAt / 1000),
      Math.floor(endAt / 1000),
      uri[0],
    ]);
    return data;
  };

  const generateNftUri = async (amount, pId) => {
    const campaign = await getCampaign(pId);
    const metadata = {
      name: campaign.title,
      description: campaign.description,
      image: campaign.nft,
      attributes: [
        {
          trait_type: "Donation",
          value: amount,
        },
      ],
    };
    const uri = await upload({ data: [metadata] });
    console.log(uri[0]);
    return uri[0];
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");
    const parsedCampaing = [];
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      if (campaign.owner === "0x0000000000000000000000000000000000000000") {
        continue;
      }
      const _metadata = await storage.downloadJSON(campaign.metadata);
      parsedCampaing.push({
        owner: _metadata.owner,
        ownerAddress: campaign.owner,
        title: _metadata.title,
        description: _metadata.description,
        category: _metadata.category,
        target: ethers.utils.formatEther(campaign.target.toString()),
        startAt: campaign.startAt.toNumber(),
        deadline: campaign.endAt.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: _metadata.campaignImage,
        nft: _metadata.nftImage,
        pId: i,
      });
    }
    return parsedCampaing;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.ownerAddress === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const _uri = await generateNftUri(amount, pId);
    const data = await contract.call("donateToCampaign", pId, _uri, {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };

  const withdraw = async (pId) => {
    checkChain();
    const data = await contract.call("withdraw", pId);
    return data;
  };

  const getCampaign = async (pId) => {
    const campaign = await contract.call("campaigns", pId);
    console.log(campaign);
    const _metadata = await storage.downloadJSON(campaign.metadata);
    console.log(_metadata);
    const parsedCampaign = {
      ownerAddress: campaign.owner,
      owner: _metadata.owner,
      title: _metadata.title,
      description: _metadata.description,
      category: _metadata.category,
      target: ethers.utils.formatEther(campaign.target.toString()),
      startAt: campaign.startAt.toNumber(),
      deadline: campaign.endAt.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: _metadata.campaignImage,
      nft: _metadata.nftImage,
    };
    return parsedCampaign;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getCampaign,
        generateNftUri,
        withdraw,
        checkChain,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
