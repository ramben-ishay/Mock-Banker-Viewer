"use client";

import React, { useState } from "react";
import { VipListPage } from "@/components/vips/VipListPage";
import { AddVipModal } from "@/components/vips/AddVipModal";

export default function VipsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <VipListPage onAddVip={() => setIsAddModalOpen(true)} />
      <AddVipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
