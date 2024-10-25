import { User } from "@nextui-org/react";
import React from "react";

interface Product {
  /** The primary name of the product */
  name: string;
  /** Optional shortened name for compact display */
  short_name?: string;
  /** URL or source path for the product's image */
  image_url?: string;
}

interface ProductCellItemProps {
  /** Array of product objects, where the first product represents the main product */
  products: Product[];
  /** Optional subtitle text to override default description */
  subtitle?: string;
}

/**
 * `ProductCellItem` is a reusable component for displaying a product with an optional subtitle.
 * It displays the first product’s name and image and indicates additional products if present.
 *
 * Usage:
 * ```
 * <ProductCellItem products={[{ name: "Basic Plan", short_name: "Basic", image_url: "/path/to/image.png" }]} />
 * ```
 *
 * Props:
 * - `products`: Array of product objects. The first item represents the main product.
 * - `subtitle`: Optional custom text that overrides the default description.
 */
export default function ProductCellItem({
  products,
  subtitle,
}: ProductCellItemProps): JSX.Element {
  return (
    <User
      name={products[0]?.short_name ?? products[0]?.name} // Display short name if available, otherwise full name
      description={
        subtitle
          ? subtitle
          : products.length === 1
            ? "No add-ons" // Default for a single product with no add-ons
            : `+${products.length - 1} add-ons` // Shows count of additional products as add-ons
      }
      avatarProps={{
        src: products[0]?.image_url,
        radius: "md", // Medium border radius for the avatar
        className: "p-0.5 bg-black-2", // Custom styling for padding and background color
      }}
    />
  );
}
