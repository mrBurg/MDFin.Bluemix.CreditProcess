export type TMarketingPopup = {
  className?: string;
  isRender: boolean;
  callbackAccept: () => void;
  callbackDecline: () => void;
  callbackClose: () => void;
  isRedesign?: boolean;
};
