import { MantineProvider, Text } from '@mantine/core';
import FlavanoidsStatsTable from './Flavonoids';
import data from './Wine-Data.json';
import GammaStats from './GammaStats';

export default function App() {
  return (
    <MantineProvider >
      <FlavanoidsStatsTable data={data} />
       <GammaStats data={data} />
    </MantineProvider>
  );
}