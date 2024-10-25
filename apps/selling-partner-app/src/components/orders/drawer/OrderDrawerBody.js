import { CustomTortoiseDrawerBody } from "@/components/common/Drawer";
import { TabGroup } from "@repo/ui/components";
import { useGetOrderByIdQuery } from "@/features/order/api";
import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback, useMemo, useState } from "react";
import OrderDetails from "../tabs/OrderDetails";
import ShippingDetails from "../tabs/ShippingDetails";
import ShippedItems from "../tabs/ShippedItems";
import { useSelector } from "react-redux";
import { selectSupplier } from "@/features/auth/slice";
import { LESSOR_ORDER_PRODUCT_STATUS } from "@/features/order/constants";

export default function OrderDrawerBody({ orderId }) {
  const supplier = useSelector(selectSupplier);
  const {
    data: orderData,
    isLoading: isOrderDataLoading,
    isFetching: isOrderDataFetching,
  } = useGetOrderByIdQuery(
    orderId && supplier ? { orderId: orderId, supplierId: supplier } : skipToken
  );

  const [activeTab, setActiveTab] = useState("order-details");
  const tabs = useMemo(
    () => [
      { key: "order-details", label: "Order Details" },
      ...(orderData?.order_products.some(
        (product) => product.status === LESSOR_ORDER_PRODUCT_STATUS.CONFIRMED
      )
        ? [{ key: "shipping-details", label: "Shipping Details" }]
        : []),
      ...(orderData?.order_products.some(
        (product) =>
          product.status === LESSOR_ORDER_PRODUCT_STATUS.DELIVERED ||
          product.status === LESSOR_ORDER_PRODUCT_STATUS.SHIPPED
      )
        ? [{ key: "shipped-items", label: "Shipped Items" }]
        : []),
    ],
    [orderData]
  );

  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);

  if (isOrderDataFetching || isOrderDataLoading) {
    return <CustomTortoiseDrawerBody>Loading...</CustomTortoiseDrawerBody>;
  }

  return (
    <>
      <div className="px-8 bg-black-1 py-1 border-b-1">
        <TabGroup
          activeTab={activeTab}
          tabs={tabs}
          onSelectionChange={handleTabChange}
        />
      </div>
      <CustomTortoiseDrawerBody>
        {(() => {
          switch (activeTab) {
            case "order-details":
              return <OrderDetails orderId={orderId} />;
            case "shipping-details":
              return <ShippingDetails orderId={orderId} />;
            case "shipped-items":
              return <ShippedItems orderId={orderId} />;
            default:
              return null;
          }
        })()}
      </CustomTortoiseDrawerBody>
    </>
  );
}
