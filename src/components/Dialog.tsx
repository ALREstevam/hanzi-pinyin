import { FunctionComponent, ReactNode } from "react";

export interface DialogProps {
  children?: ReactNode;
}

const Dialog: FunctionComponent<DialogProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Dialog;
