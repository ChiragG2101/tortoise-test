import React from 'react';
import { ModalFooter, Button } from '@nextui-org/react';

export default function TortoiseModalFooter({
  isForm,
  positiveActionButtonText,
  positiveActionButtonHandler,
  positiveActionButtonProps,
  negativeActionButtonHandler,
  negativeActionButtionText,
  negativeActionButtonProps,
}) {
  return (
    <ModalFooter>
      {(negativeActionButtionText || negativeActionButtonHandler) && (
        <Button
          color='danger'
          variant='light'
          onPress={negativeActionButtonHandler}
        >
          {negativeActionButtionText ?? 'Close'}
        </Button>
      )}
      {positiveActionButtonText && (
        <Button
          color='primary'
          variant='bordered'
          onPress={!isForm ? positiveActionButtonHandler : undefined}
          type={isForm ? 'submit' : 'button'}
          {...positiveActionButtonProps}
        >
          {positiveActionButtonText}
        </Button>
      )}
    </ModalFooter>
  );
}
