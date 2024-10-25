import {
  Check,
  CheckCircle,
  Copy,
  PencilSimple,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { ProductCellItem } from "@repo/ui/components";
import { copyToClipboard, formatAsCurrency } from "@/features/common/utils";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { usePatchLessorOrderProductMutation } from "@/features/order/api";

const ProductItem = ({
  product,
  allowEdit,
  orderData,
  hasBottomBorder = true,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [productReferenceNumber, setProductReferenceNumber] = useState(
    product.product_reference_number ?? ""
  );
  const [
    patchLessorOrderProduct,
    { isLoading: isPatchLessorOrderProductLoading },
  ] = usePatchLessorOrderProductMutation();

  const { storage, color } = product?.properties || {};
  return (
    <div
      className={`flex flex-col gap-2 ${hasBottomBorder ? "pb-4 border-b-1 border-b-black-2" : ""}`}
    >
      <div className={`flex items-center justify-between`}>
        <ProductCellItem
          products={[product]}
          subtitle={
            <div className="flex gap-1 items-center text-inherit">
              {(storage?.name || color?.name) && (
                <p>
                  {storage?.name ? `${storage?.name}` : ""}
                  {storage?.name && color?.name ? "  •  " : ""}
                  {color?.name ? `${color?.name}` : ""}
                  {" | "}
                </p>
              )}
              {product?.manufacturer_product_code}{" "}
              <Copy
                onClick={() => {
                  copyToClipboard(product?.manufacturer_product_code);
                  toast.success("Product code copied to clipboard", {
                    autoClose: 1000,
                    hideProgressBar: true,
                  });
                }}
                className="text-inherit hover:text-black-7 cursor-pointer rounded hover:bg-black-1"
              />
            </div>
          }
        />
        <p className="text-sm">{formatAsCurrency(product.price)}</p>
      </div>
      <div className="pl-12">
        {allowEdit &&
          (isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                size="sm"
                variant="bordered"
                radius="lg"
                placeholder="Enter IMEI / Serial Number"
                className="w-full"
                value={productReferenceNumber}
                onChange={(e) => setProductReferenceNumber(e.target.value)}
              />
              <Button
                size="sm"
                radius="lg"
                variant="bordered"
                color="primary"
                isIconOnly
                onClick={() => {
                  setProductReferenceNumber(
                    product.product_reference_number ?? ""
                  );
                  setIsEditable(false);
                }}
                className="border-1"
              >
                <XCircle size={20} weight="fill" className="text-black-5" />
              </Button>
              <Button
                size="sm"
                radius="lg"
                variant="bordered"
                color="primary"
                isIconOnly
                isLoading={isPatchLessorOrderProductLoading}
                onClick={async () => {
                  try {
                    await patchLessorOrderProduct({
                      lessorOrderProductId: product.id,
                      orderId: orderData.id,
                      supplierId: product.supplier,
                      data: {
                        product_reference_number: productReferenceNumber,
                      },
                    }).unwrap();
                  } catch (error) {}
                  setIsEditable(false);
                }}
                className="border-1"
              >
                <CheckCircle size={20} weight="fill" className="text-green-8" />
              </Button>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              {product.product_reference_number && (
                <p className="text-xs text-black-6">
                  {product.product_reference_number}
                </p>
              )}
              <Button
                size="sm"
                radius="lg"
                variant="bordered"
                color="primary"
                onClick={() => setIsEditable(true)}
                endContent={
                  <PencilSimple
                    weight="fill"
                    size={14}
                    className="text-black-6"
                  />
                }
                className="border-1"
              >
                {product.product_reference_number
                  ? "Edit"
                  : "Add IMEI / Serial Number"}
              </Button>
            </div>
          ))}

        {!allowEdit && product.product_reference_number && (
          <div className="flex gap-1 items-center text-inherit">
            <p className="text-xs text-black-8 opacity-60 font-medium">
              {`IMEI: ${product.product_reference_number}`}
            </p>
            <Copy
              onClick={() => {
                copyToClipboard(product?.product_reference_number);
                toast.success("IMEI copied to clipboard", {
                  autoClose: 1000,
                  hideProgressBar: true,
                });
              }}
              className="text-inherit text-[#AFAFAF] hover:text-black-7 cursor-pointer rounded hover:bg-black-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProductCard({
  title = "Ordered Items",
  orderData,
  allowEdit = false,
  status = null,
}) {
  const filteredProducts = orderData?.order_products.filter(
    (product) =>
      status === null ||
      (Array.isArray(status)
        ? status.includes(product.status)
        : product.status === status)
  );
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <div className="mt-2 flex flex-col gap-4 border-1 border-black-3 p-4 rounded-lg">
        <div className="text-xs text-black-7 uppercase font-semibold tracking-wider">
          {filteredProducts.length} item
          {filteredProducts.length === 1 ? "" : "s"}
        </div>
        {filteredProducts.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            hasBottomBorder={
              status === null || index !== filteredProducts.length - 1
            }
            allowEdit={allowEdit}
            orderData={orderData}
          />
        ))}
        {status === null && (
          <div className="flex justify-between items-center text-sm font-semibold text-green-9">
            <p>Order Total</p>
            <p>
              {formatAsCurrency(
                filteredProducts.reduce(
                  (total, product) => total + (product.price || 0),
                  0
                )
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
