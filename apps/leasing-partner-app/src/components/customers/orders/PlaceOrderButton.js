import { usePlaceOrderMutation } from '@/features/customer/order/api';
import { Button } from '@nextui-org/react';

export default function PlaceOrderButton({ order, onClose }) {
  const [placeOrder, { isLoading: isPlaceOrderLoading }] =
    usePlaceOrderMutation();

  const handlePlaceOrder = async (order) => {
    try {
      await placeOrder(order.id).unwrap();
      onClose();
    } catch (error) {
      return;
    }
  };

  return (
    <Button
      radius='lg'
      fullWidth
      className='text-white bg-black-10'
      onClick={() => handlePlaceOrder(order)}
      isLoading={isPlaceOrderLoading}
    >
      Place order
    </Button>
  );
}
