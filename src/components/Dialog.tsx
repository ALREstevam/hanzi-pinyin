import { FunctionComponent, ReactNode } from "react";

export interface DialogProps {
  children?: ReactNode;
  title: string
}

const Dialog: FunctionComponent<DialogProps> = ({ children, title }) => {
  return <div style={{width: '100vw', marginBottom: '1em'}}>
    <h2>{title}</h2>
    <div>
    {children}
    </div>
  </div>;
};

export default Dialog;
