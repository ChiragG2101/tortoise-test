"use client";

import {
  DeviceTypeChip,
  TortoiseTable,
  ProductCellItem,
  IconTitlePageHeading,
} from "@repo/ui/components";
import ProductCardModal from "@/components/devices/ProductCardModal";
import { useGetSupplierProductListingQuery } from "@/features/available-products/api";
import { formatAsCurrency } from "@/features/common/utils";
import { useDisclosure } from "@nextui-org/react";
import { Devices } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useState } from "react";

const columns = [
  { key: "manufacturer_product_code", label: "Product ID" },
  { key: "supplier_name", label: "Product name" },
  { key: "device_type", label: "Product category" },
  { key: "default_price", label: "MRP" },
  { key: "price", label: "MOP" },
];

const sortKeyMapping = Object.freeze({
  manufacturer_product_code: "product__manufacturer_product_code",
  supplier_name: "product__short_name",
  device_type: "product__device_type",
  default_price: "product__default_price",
  price: "price",
});

export default function AvailableDevices() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
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
      case "default_price":
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
    <div className="flex flex-col gap-5">
      <IconTitlePageHeading title={"Available Devices"} Icon={Devices} />
      <div className="flex flex-col gap-5 px-5">
        {/* <Button
          className='btn-primary w-fit'
          startContent={<PlusCircle size={20} weight='fill' />}
        >
          Add new device
        </Button> */}
        <TortoiseTable
          queryHook={useGetSupplierProductListingQuery}
          columns={columns}
          renderCell={renderCell}
          pageSize={10}
          isSearchEnabled
          onRowClick={handleRowClick}
          sortKeyMapping={sortKeyMapping}
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
