import { CaretLeft, CaretRight, XCircle } from "@phosphor-icons/react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import React from "react";

interface CustomTortoiseDrawerBodyProps {
  /** The content to be displayed inside the drawer body */
  children: React.ReactNode;
}

/**
 * `CustomTortoiseDrawerBody` is a component that wraps the content of the drawer,
 * providing consistent padding and layout.
 */
export function CustomTortoiseDrawerBody({
  children,
}: CustomTortoiseDrawerBodyProps): JSX.Element {
  return <div className="flex flex-col p-4 md:p-5 lg:p-6">{children}</div>;
}

interface CustomTortoiseDrawerProps {
  /** Flag to control the visibility of the drawer */
  isDrawerOpen: boolean;
  /** Flag to determine if navigation controls should be displayed */
  hasNavigationControls?: boolean;
  /** The title to display at the top of the drawer */
  title: string;
  /** Callback function to be called when the drawer is closed */
  onClose: () => void;
  /** The content to be displayed inside the drawer */
  children: React.ReactNode;
  /** Optional footer content to display at the bottom of the drawer */
  footer?: React.ReactNode;
}

/**
 * `CustomTortoiseDrawer` is a customizable drawer component that can contain content,
 * a title, and optional navigation controls and footer.
 *
 * Usage:
 * ```
 * <CustomTortoiseDrawer
 *   isDrawerOpen={isOpen}
 *   onClose={handleClose}
 *   title="Drawer Title"
 *   hasNavigationControls={true}
 *   footer={<div>Footer Content</div>}
 * >
 *   <CustomTortoiseDrawerBody>
 *     <p>Your content goes here</p>
 *   </CustomTortoiseDrawerBody>
 * </CustomTortoiseDrawer>
 * ```
 *
 * Props:
 * - `isDrawerOpen`: boolean - Controls the visibility of the drawer.
 * - `hasNavigationControls`: boolean (optional) - Displays navigation controls if true.
 * - `title`: string - The title displayed at the top of the drawer.
 * - `onClose`: function - Callback function to handle drawer closing.
 * - `children`: ReactNode - The content to be displayed inside the drawer.
 * - `footer`: ReactNode (optional) - Optional footer content to be displayed at the bottom.
 */
export function CustomTortoiseDrawer({
  isDrawerOpen,
  hasNavigationControls = false,
  title,
  onClose,
  children,
  footer,
}: CustomTortoiseDrawerProps): JSX.Element {
  return (
    <Drawer
      open={isDrawerOpen}
      onClose={onClose}
      direction="right"
      lockBackgroundScroll
      style={{ minWidth: "27.5rem", width: "40%" }}
    >
      <div className="flex flex-col overflow-y-auto h-full">
        <div className="flex h-12 bg-grey px-8 py-6 items-center justify-between border-b-1 bg-black-1">
          {hasNavigationControls && (
            <div className="flex">
              <div className="p-1 border border-r-0 border-b-2 rounded-lg rounded-r-none bg-white">
                <CaretLeft size={16} weight="bold" className="text-black-4" />
              </div>
              <div className="p-1 border border-b-2 rounded-lg rounded-l-none bg-white">
                <CaretRight size={16} weight="bold" className="text-black-4" />
              </div>
            </div>
          )}
          <div className="text-black-10 font-semibold body-small">{title}</div>
          <div
            className="p-1 border border-b-2 rounded-lg bg-white cursor-pointer"
            onClick={onClose}
          >
            <XCircle weight="fill" size={16} className="text-black-4" />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">{children}</div>
        {footer && (
          <div className="w-full p-4 border-t border-black-3">{footer}</div>
        )}
      </div>
    </Drawer>
  );
}
