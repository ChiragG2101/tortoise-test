"use client";

import React, { useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { ArrowLeft } from "@phosphor-icons/react";
import { useDisclosure, Spinner } from "@nextui-org/react";
import DeviceTypeChip from "@/components/common/chip/DeviceTypeChip";
import { TortoiseTable, ProductCellItem } from "@repo/ui/components";
import ProductCardModal from "@/components/devices/ProductCardModal";
import { useGetPricingChannelByIdQuery } from "@/features/pricing-channel/api";
import { useGetPricingChannelListingQuery } from "@/features/pricing-channel/api";
import { formatAsCurrency } from "@/features/common/utils";

const columns = [
  { key: "manufacturer_product_code", label: "Product ID" },
  { key: "supplier_name", label: "Product name" },
  { key: "device_type", label: "Product category" },
  { key: "mrp", label: "MRP" },
  { key: "price", label: "MOP" },
];

// const sortKeyMapping = Object.freeze({
//   manufacturer_product_code: 'product__manufacturer_product_code',
//   supplier_name: 'product__short_name',
//   device_type: 'product__device_type',
//   mrp: 'product__default_price',
//   price: 'price',
// });

export default function PricingChannelPage() {
  const router = useRouter();
  const params = useParams();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: pricingChannel, isLoading: isPricingChannelLoading } =
    useGetPricingChannelByIdQuery(params?.pricing_id ?? skipToken);

  const renderCell = useCallback((device, columnKey) => {
    switch (columnKey) {
      case "device_type":
        return (
          <DeviceTypeChip deviceType={device?.product_details?.device_type} />
        );
      case "supplier_name":
        return (
          <ProductCellItem
            products={[device?.product_details]}
            subtitle={
              Object.entries(device?.product_details?.properties ?? {})
                .filter(([key]) => key !== "model")
                .map(([key, value]) =>
                  (key === "storage" &&
                    device?.product_details?.properties?.ram) ||
                  (key === "ram" &&
                    device?.product_details?.properties?.storage)
                    ? `${value["name"]} ${key.charAt(0).toUpperCase() + key.slice(1)}`
                    : `${value["name"]}`
                )
                .join(", ") ?? "-"
            }
          />
        );
      case "mrp":
      case "price":
        return formatAsCurrency(
          device[columnKey] ?? device?.product_details?.[columnKey]
        );
      default:
        return device[columnKey] ?? device?.product_details?.[columnKey] ?? "-";
    }
  }, []);

  const handleRowClick = (row) => {
    setSelectedProduct(row.product_details);
    onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className=" flex items-center px-5 pb-5 gap-2 border-b-1">
        <ArrowLeft
          weight="bold"
          size={32}
          className="cursor-pointer"
          onClick={() => router.push("/devices/pricing-channels")}
        />
        <div className="font-semibold body-xlarge">
          {isPricingChannelLoading ? <Spinner /> : pricingChannel?.name}
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <TortoiseTable
          queryHook={useGetPricingChannelListingQuery}
          columns={columns}
          queryParameters={{ id: params?.pricing_id }}
          renderCell={renderCell}
          pageSize={10}
          isSearchEnabled
          onRowClick={handleRowClick}
          //   sortKeyMapping={sortKeyMapping}
        />
        <ProductCardModal
          product={selectedProduct}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      </div>
    </div>
  );
}
