import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  faq,
} from "../assets";

export const navlinks = [
  {
    name: "Dashboard",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Campaign",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  {
    name: "Payment",
    imgUrl: payment,
    link: "/",
    disabled: true,
  },
  {
    name: "Profile",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "FAQs",
    imgUrl: faq,
    link: "/faq",
  },
];

export const faqs = [
  {
    id: 1,
    question: "What do I need to start a campaign on CrowdWork",
    answer:
      "To start your own campaign, you will need a web3 wallet like Metamask. If you don't already have one, you can download it from https://metamask.io/.",
  },
  {
    id: 2,
    question: "What is the minimum amount I can raise?",
    answer:
      "It depends on the campaign you are creating. For small campaigns, you can raise as low as 0.01 MATIC.",
  },
  {
    id: 3,
    question: "What Cryptocurrencies do you accept?",
    answer:
      "Currently, we only accept MATIC, but we will be adding more payment options soon.",
  },
  {
    id: 4,
    question: "When can I withdraw my funds?",
    answer:
      "You can withdraw your funds once your campaign is deadline has reached",
  },
  {
    id: 5,
    question:
      "Is there any Moderation on what types of Campaigns I can create?",
    answer:
      "Currently, there is no moderation on what types of campaigns you can create, but for the future we will be adding a Governance DAO to moderate campaigns.",
  },
  {
    id: 6,
    question: "How will I receive my funds?",
    answer:
      "Your funds will be transferred to your wallet address, which you used to create the campaign.",
  },
];
