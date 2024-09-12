import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";

const PaymentPromptDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>开启缘分之旅</DialogTitle>
      <DialogContent>
        <DialogContentText>支付59元后即可进入活动</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>再想想</Button>
        <Button onClick={onClose}>确定</Button>
      </DialogActions>
    </Dialog>
  );
};

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
