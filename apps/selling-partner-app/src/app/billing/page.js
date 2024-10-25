"use client";

import React, { useCallback, useState, useMemo } from "react";
import { CalendarBlank } from "@phosphor-icons/react";
import Billing from "@/components/billing";
import LessorSelect from "@/components/common/form/LessorSelect";
import IconTitleHeadingTabsLayout from "@/components/common/layouts/page-heading/IconTitleTabsHeading";
import { BILLING_STATUS, getStatusFilter } from "@/features/billing/constants";
import { Notepad } from "@phosphor-icons/react";
import { useGetBillingOverviewQuery } from "@/features/billing/api";
import { TabGroup, MonthYearSelect } from "@repo/ui/components";

const statusTabs = Object.freeze([
  { key: BILLING_STATUS.UPCOMING, label: "Upcoming payments" },
  { key: BILLING_STATUS.UNPAID, label: "Unpaid payments" },
  { key: BILLING_STATUS.PAID, label: "Settled payments" },
]);

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState(BILLING_STATUS.UPCOMING);
  const [activeCycle, setActiveCycle] = useState("cycle_1");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [monthYear, setMonthYear] = useState(null);

  const { data: billingOverview, isLoading: isBillingOverviewLoading } =
    useGetBillingOverviewQuery(
      {
        configId: selectedConfig?.id,
        due_month: monthYear?.month,
        due_year: monthYear?.year,
        statusFilter: getStatusFilter(activeTab),
      },
      { skip: !selectedConfig?.id || !monthYear }
    );

  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);

  const cycleTabs = useMemo(() => {
    return billingOverview?.map((item, index) => ({
      key: `cycle_${index + 1}`,
      label: (
        <div className="flex flex-row gap-2 items-center justify-center">
          <CalendarBlank size={16} />
          {`Cycle ${index + 1}`}
        </div>
      ),
    }));
  }, [billingOverview, selectedConfig?.id]);

  const label = {
    [BILLING_STATUS.UPCOMING]: "Upcoming payments",
    [BILLING_STATUS.UNPAID]: "Unpaid payments",
    [BILLING_STATUS.PAID]: "Settled payments",
  };

  return (
    <div className="flex flex-col gap-5">
      <IconTitleHeadingTabsLayout
        Icon={Notepad}
        title={"Billing"}
        activeTab={activeTab}
        tabs={statusTabs}
        onTabChange={handleTabChange}
      />

      <div className="flex flex-col w-full gap-5 self-center px-5">
        <div className="text-base leading-4 font-semibold text-black-10">
          {label[activeTab]}
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <div className="w-48">
              <LessorSelect setSelectedConfig={setSelectedConfig} />
            </div>
            <div className="w-36">
              <MonthYearSelect setMonthYear={setMonthYear} />
            </div>
          </div>
          <div>
            <TabGroup
              activeTab={activeCycle}
              tabs={cycleTabs || []}
              onSelectionChange={setActiveCycle}
              tabsProps={{ variant: "underlined" }}
            />
          </div>
        </div>

        <Billing
          status={activeTab}
          monthYear={monthYear}
          isBillingOverviewLoading={isBillingOverviewLoading}
          billingOverview={billingOverview?.[activeCycle.split("_")[1] - 1]}
          configId={selectedConfig?.id}
        />
      </div>
    </div>
  );
}
