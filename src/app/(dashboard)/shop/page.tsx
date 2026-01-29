'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { TabPanel } from '@/components/shop/TabPanel';
import { AddProductForm } from '@/components/shop/AddProductForm';
import { InventoryList } from '@/components/shop/InventoryList';
import { CreateBundleForm } from '@/components/shop/CreateBundleForm';
import { CreateEbookForm } from '@/components/shop/CreateEbookForm';

const tabs = [
  { label: 'Inventory List', value: 'list' },
  { label: 'Add Inventory', value: 'add' },
  { label: 'Add Ebook', value: 'add-ebook' },
  { label: 'Create Bundle', value: 'bundle' },
];

export default function ShopManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.some((tab) => tab.value === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);

    const params = new URLSearchParams(searchParams.toString());
    if (newValue === 'list') {
      params.delete('tab');
    } else {
      params.set('tab', newValue);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
      >
        Shop Manager
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage products and inventory
      </Typography>

      <TabPanel tabs={tabs} value={activeTab} onChange={handleTabChange} />

      {activeTab === 'add' && <AddProductForm />}
      {activeTab === 'add-ebook' && <CreateEbookForm />}
      {activeTab === 'bundle' && <CreateBundleForm />}
      {activeTab === 'list' && <InventoryList />}
    </Box>
  );
}
