import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { serializeError } from "eth-rpc-errors";

import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, address } = useStateContext();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    category: "",
    startAt: "",
    deadline: "",
    image: "",
    nft: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const errorNotification = (message) => {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000,
    });
  };

  const successNotification = (message) => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address === undefined) {
      errorNotification("Please connect your Metamask Wallet");
    } else if (form.target == 0) {
      errorNotification("Target amount cannot be 0");
    } else {
      try {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        navigate("/");
        successNotification("Transaction Successful");
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

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="MATIC 500"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            labelName="Category *"
            placeholder="Education"
            inputType="text"
            value={form.category}
            handleChange={(e) => handleFormFieldChange("category", e)}
          />
        </div>
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Start Date *"
            placeholder="Start Date"
            inputType="datetime-local"
            step={60}
            value={form.startAt}
            handleChange={(e) => handleFormFieldChange("startAt", e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="datetime-local"
            step={60}
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>

        <FormField
          labelName="Campaign Image *"
          placeholder="Image URL for your Campaign"
          inputType="string"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />

        <FormField
          labelName="Reward NFT *"
          placeholder="NFT Image URL Reward for your Campaign"
          inputType="string"
          value={form.nft}
          handleChange={(e) => handleFormFieldChange("nft", e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCampaign;
