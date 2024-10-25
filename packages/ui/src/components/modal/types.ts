import { Button } from "@nextui-org/react";
import { ReactNode } from "react";

// Define the props for the TortoiseModal component
export interface TortoiseModalProps {
  title: string; // The title to be displayed in the modal header
  isOpen: boolean; // Boolean to control the visibility of the modal
  onOpenChange: (isOpen: boolean) => void; // Callback function to handle modal open state changes
  children: ReactNode; // The content to be displayed inside the modal
}

// Define the props interface for the TortoiseModalFooter component
export interface TortoiseModalFooterProps {
  isForm: boolean; // Indicates if the modal contains a form
  positiveActionButtonText: string; // Text for the positive action button
  positiveActionButtonHandler: () => void; // Handler for the positive action button
  positiveActionButtonProps?: React.ComponentProps<typeof Button>; // Additional props for the positive action button
  negativeActionButtonHandler?: () => void; // Optional handler for the negative action button
  negativeActionButtionText?: string; // Optional text for the negative action button
  negativeActionButtonProps?: React.ComponentProps<typeof Button>; // Additional props for the negative action button
}
