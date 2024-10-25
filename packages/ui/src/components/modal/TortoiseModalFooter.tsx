import React from "react";
import { ModalFooter, Button } from "@nextui-org/react";
import { TortoiseModalFooterProps } from "./types";

// TortoiseModalFooter component definition
export default function TortoiseModalFooter({
  isForm,
  positiveActionButtonText,
  positiveActionButtonHandler,
  positiveActionButtonProps,
  negativeActionButtonHandler,
  negativeActionButtionText,
  negativeActionButtonProps,
}: TortoiseModalFooterProps) {
  return (
    <ModalFooter>
      {/* Render the negative action button if text or handler is provided */}
      {(negativeActionButtionText || negativeActionButtonHandler) && (
        <Button
          color="danger"
          variant="light"
          onPress={negativeActionButtonHandler}
          {...negativeActionButtonProps} // Spread additional props for customization
        >
          {negativeActionButtionText ?? "Close"}{" "}
          {/* Default text is 'Close' if none provided */}
        </Button>
      )}
      {/* Render the positive action button if text is provided */}
      {positiveActionButtonText && (
        <Button
          color="primary"
          variant="bordered"
          onPress={!isForm ? positiveActionButtonHandler : undefined} // Only attach handler if not a form
          type={isForm ? "submit" : "button"} // Set button type based on form status
          {...positiveActionButtonProps} // Spread additional props for customization
        >
          {positiveActionButtonText}
        </Button>
      )}
    </ModalFooter>
  );
}
