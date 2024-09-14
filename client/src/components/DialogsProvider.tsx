import React, { createContext, useContext, useState, ReactNode } from "react";
import PaymentPromptDialog from "./PaymentPromptDialog";

interface DialogContextType {
  openPaymentPromptDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogsProvider: React.FC<DialogProviderProps> = ({
  children,
}) => {
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  const openPaymentPromptDialog = () => setIsHelpDialogOpen(true);

  return (
    <DialogContext.Provider value={{ openPaymentPromptDialog }}>
      {children}
      <PaymentPromptDialog
        open={isHelpDialogOpen}
        onClose={() => setIsHelpDialogOpen(false)}
      />
    </DialogContext.Provider>
  );
};

export const useDialogs = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogsProvider");
  }
  return context;
};
