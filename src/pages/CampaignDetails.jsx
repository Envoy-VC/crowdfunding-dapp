import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { serializeError } from "eth-rpc-errors";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, getCampaign, withdraw } =
    useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [metadata, setMetadata] = useState({});
  const [donators, setDonators] = useState([]);
  const avatar = `https://avatars.dicebear.com/api/micah/${metadata.ownerAddress}.svg?size=32`;

  const remainingDays = daysLeft(state.deadline);

  const errorNotification = (message) => {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000,
    });
  };

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    const metadata = await getCampaign(state.pId);
    setMetadata(metadata);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    if (address === undefined) {
      errorNotification("Please connect your Metamask Wallet");
    } else {
      try {
        setIsLoading(true);
        await donate(state.pId, amount);
        navigate("/");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const serializedError = serializeError(error);
        const jsonError = { serializedError };
        const lines = jsonError.serializedError.message.split("\n");
        const e = JSON.parse(lines.at(-1)).reason;
        errorNotification(e);
      }
    }
  };
  const handleWithdraw = async () => {
    setIsLoading(true);
    await withdraw(state.pId);
    navigate("/");
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-410 object-cover object-center rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={avatar}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {metadata.ownerAddress}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Donators
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                <ol className="md:flex md:flex-wrap -mx-4">
                  {donators.map((item, index) => (
                    <li key={index} className="md:w-1/3 px-4 mb-6 md:mb-0">
                      <div className="font-bold mb-2 text-white mt-2">
                        {item.donator} {item.donation} MATIC
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        {metadata.ownerAddress === address ? (
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Withdraw
            </h4>

            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
              <div className="mt-[30px]">
                <CustomButton
                  btnType="button"
                  title="Withdraw"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleWithdraw}
                />
              </div>
              <div className="w-full max-w-xs rounded-lg overflow-hidden shadow-lg bg-[#1c1c24] my-[20px] p-4 mt-[20px]">
                <img
                  src={state.nft}
                  alt="NFT"
                  className="w-full h-64 object-cover object-center rounded-xl "
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-white">
                    You will receive this NFT as a reward
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Fund
            </h4>

            <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
              <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                Fund the campaign
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  placeholder="MATIC 5"
                  step="1"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                    Back it because you believe in it.
                  </h4>
                  <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                    Support the project just because it speaks to you.
                  </p>
                </div>
                <CustomButton
                  btnType="button"
                  title="Fund Campaign"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleDonate}
                />
              </div>
              <div className="w-full max-w-xs rounded-lg overflow-hidden shadow-lg bg-[#1c1c24] my-[20px] p-4 mt-[20px]">
                <img
                  src={state.nft}
                  alt="NFT"
                  className="w-full h-64 object-cover object-center rounded-xl "
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-white">
                    You will receive this NFT as a reward
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CampaignDetails;
