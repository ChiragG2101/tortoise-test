"use client";

import { useGetOrdersQuery } from "@/features/order/api";
import { Bag } from "@phosphor-icons/react";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import IconTitleHeadingTabsLayout from "@/components/common/layouts/page-heading/IconTitleTabsHeading";
import TortoiseTable from "@/components/common/table/TortoiseTable";
import { formatAsCurrency } from "@/features/common/utils";
import ProductCellItem from "@/components/common/table/cell-item/ProductCellItem";
import OrganizationCellItem from "@/components/common/table/cell-item/OrganizationCellItem";
import OrderDrawer from "@/components/orders/drawer/OrderDrawer";
import { useSelector } from "react-redux";
import { selectSupplier } from "@/features/auth/slice";

const columns = [
  { key: "id", label: "Order ID" },
  { key: "consumer", label: "Ordered by" },
  { key: "order", label: "Order" },
  { key: "created_at", label: "Order date" },
  { key: "organization", label: "Customer" },
  { key: "amount", label: "Amount" },
  // { key: 'shipping', label: 'Shipping partner' },
];

const tabs = Object.freeze([
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
]);

const orderStatus = Object.freeze({
  pending: "pending",
  confirmed: "confirmed",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  processed: "processed",
});

export default function Orders() {
  const [activeTab, setActiveTab] = useState("pending");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});

  const supplier = useSelector(selectSupplier);
  const handleRowClick = useCallback((row) => {
    setIsDrawerOpen((prevState) => !prevState);
    setSelectedRowData(row);
  }, []);

  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);

  const renderCell = useCallback((order, columnKey) => {
    const cellValue = order[columnKey];
    switch (columnKey) {
      case "id":
        return `#${cellValue}`;
      case "amount":
        return formatAsCurrency(cellValue);
      case "created_at":
        return format(cellValue, "dd MMM yyyy");
      case "order":
        return <ProductCellItem products={order.order_products} />;
      case "consumer":
        return (
          <div>
            <div>{order?.consumer_details?.full_name}</div>
            <div className="text-xs text-black-8">
              {order?.consumer_details?.email}
            </div>
          </div>
        );
      case "organization":
        return (
          <OrganizationCellItem
            name={order.organization_details.display_name}
            logo={order.organization_details.logo}
          />
        );
      case "shipping":
        return (
          <>
            {order && order.shipping_provider && order.tracking_number ? (
              <div>
                <p>{order?.shipping_provider}</p>
                <p>{order?.tracking_number}</p>
              </div>
            ) : (
              <>NA</>
            )}
          </>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <IconTitleHeadingTabsLayout
        Icon={Bag}
        title={"Orders"}
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={handleTabChange}
      />
      <div className="px-5">
        <TortoiseTable
          queryHook={useGetOrdersQuery}
          columns={columns}
          renderCell={renderCell}
          queryParameters={{
            supplierId: supplier,
            status: activeTab,
          }}
          pageSize={10}
          // isSearchEnabled
          onRowClick={handleRowClick}
        />
      </div>
      <OrderDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedRowData.id}
      />
    </div>
  );
}
