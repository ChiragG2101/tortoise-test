import {
  CustomTortoiseDrawer,
  CustomTortoiseDrawerBody,
} from "@repo/ui/components";
import { useGetOrderByIdQuery } from "@/features/order/api";
import { Spinner } from "@nextui-org/react";
import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";
import OrderDrawerBody from "./OrderDrawerBody";
import { useSelector } from "react-redux";
import { selectSupplier } from "@/features/auth/slice";

export default function OrderDrawer({ isOpen, onClose, orderId }) {
  const supplier = useSelector(selectSupplier);
  const { isLoading: isOrderDataLoading, isFetching: isOrderDataFetching } =
    useGetOrderByIdQuery(
      orderId && supplier
        ? { orderId: orderId, supplierId: supplier }
        : skipToken
    );

  return (
    <CustomTortoiseDrawer
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title={orderId}
    >
      {isOrderDataLoading || isOrderDataFetching ? (
        <CustomTortoiseDrawerBody>
          <Spinner />
        </CustomTortoiseDrawerBody>
      ) : (
        <OrderDrawerBody orderId={orderId} />
      )}
    </CustomTortoiseDrawer>
  );
}
