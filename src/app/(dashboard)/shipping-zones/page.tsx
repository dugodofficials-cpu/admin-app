'use client';

import { CountryList, LocationForm } from '@/components/locations';
import { Country, State } from '@/components/locations/types';
import { ShippingZoneForm } from '@/components/shipping-zones/ShippingZoneForm';
import { ShippingZoneList } from '@/components/shipping-zones/ShippingZoneList';
import { ShippingZone } from '@/components/shipping-zones/types';
import { useCountries, useDeleteCountry } from '@/hooks/locations';
import {
  useDeleteShippingZone,
  useShippingZones,
} from '@/hooks/shipping-zones';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`shipping-tabpanel-${index}`}
      aria-labelledby={`shipping-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `shipping-tab-${index}`,
    'aria-controls': `shipping-tabpanel-${index}`,
  };
}

export default function ShippingZonesPage() {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<
    Country | State | null
  >(null);
  const [isEditLocationDialogOpen, setIsEditLocationDialogOpen] =
    useState(false);
  const [locationType, setLocationType] = useState<'country' | 'state'>(
    'country',
  );

  const { data: zonesData } = useShippingZones();

  const { data: countriesData } = useCountries();

  const { mutate: deleteZone } = useDeleteShippingZone();

  const { mutate: deleteCountry } = useDeleteCountry();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddZone = () => {
    setSelectedZone(null);
    setIsAddDialogOpen(true);
  };

  const handleAddLocation = (type: 'country' | 'state') => {
    setLocationType(type);
    setSelectedLocation(null);
    setIsAddLocationDialogOpen(true);
  };

  const handleEditLocation = (
    location: Country | State,
    type: 'country' | 'state',
  ) => {
    setLocationType(type);
    setSelectedLocation(location);
    setIsEditLocationDialogOpen(true);
  };

  const handleEditZone = (zone: ShippingZone) => {
    setSelectedZone(zone);
    setIsEditDialogOpen(true);
  };

  const handleDeleteZone = (zoneId: string) => {
    deleteZone(zoneId);
  };

  const handleDeleteCountry = (countryId: string) => {
    deleteCountry(countryId);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const zones = zonesData?.data || [];
  const countries = countriesData?.data || [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
      >
        Shipping Zones
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage shipping zones, rates, and delivery methods for different
        regions.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#2FD65D',
            },
          }}
        >
          <Tab
            label="Shipping Zones"
            {...a11yProps(0)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
          <Tab
            label="Available Countries"
            {...a11yProps(1)}
            sx={{
              '&.Mui-selected': {
                color: '#2FD65D',
              },
            }}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            color="text.primary"
            sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
          >
            Total shipping zones: {zones.length}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddZone}
            sx={{
              bgcolor: '#2FD65D',
              '&:hover': { bgcolor: '#2AC152' },
            }}
          >
            Add Shipping Zone
          </Button>
        </Box>

        <ShippingZoneList
          zones={zones}
          page={page}
          rowsPerPage={rowsPerPage}
          onEditZone={handleEditZone}
          onDeleteZone={handleDeleteZone}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            color="text.primary"
            sx={{ fontFamily: 'ClashDisplay', fontWeight: 700 }}
          >
            Total available countries: {countries.length}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAddLocation('country')}
            sx={{
              bgcolor: '#2FD65D',
              '&:hover': { bgcolor: '#2AC152' },
            }}
          >
            Add Country
          </Button>
        </Box>

        <CountryList
          countries={countries}
          onEditCountry={(country) => handleEditLocation(country, 'country')}
          onDeleteCountry={handleDeleteCountry}
        />
      </TabPanel>

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Shipping Zone</DialogTitle>
        <DialogContent>
          <ShippingZoneForm
            zone={null}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Shipping Zone</DialogTitle>
        <DialogContent>
          <ShippingZoneForm
            zone={selectedZone}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddLocationDialogOpen}
        onClose={() => setIsAddLocationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add {locationType === 'country' ? 'Country' : 'State/Region'}
        </DialogTitle>
        <DialogContent>
          <LocationForm
            location={null as Country | null}
            onCancel={() => setIsAddLocationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditLocationDialogOpen}
        onClose={() => setIsEditLocationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit {locationType === 'country' ? 'Country' : 'State/Region'}
        </DialogTitle>
        <DialogContent>
          <LocationForm
            location={selectedLocation as Country}
            onCancel={() => setIsEditLocationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
