
  

  import React, { useState, useEffect } from 'react';

  type WineData = {
    Alcohol: number;
    MalicAcid: number;
    Ash: number;
    Alcalinityofash: number;
    Magnesium: number;
    Totalphenols: number;
    Flavanoids: number;
    Nonflavanoidphenols: number;
    Proanthocyanins: string;
    Colorintensity: number;
    Hue: number;
   
    Unknown: number;
}

type Statistics = {
    mean: number;
    median: number;
    mode: number[];
}

type ClassStatistics = {
    [key: number]: Statistics;
}


  interface FlavanoidsStatsTableProps {
      data: WineData[];
  }

  function mean(values: number[]): number {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
}

function median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mode(values: number[]): number[] {
    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    let modes: number[] = [];

    values.forEach((value) => {
        frequency[value] = (frequency[value] || 0) + 1;
        if (frequency[value] > maxFreq) {
            maxFreq = frequency[value];
            modes = [value];
        } else if (frequency[value] === maxFreq) {
            modes.push(value);
        }
    });

    return modes.length === values.length ? [] : [...new Set(modes)];
}

function calculateStatistics(data: WineData[]): ClassStatistics {
    const flavanoidsByClass: { [key: number]: number[] } = {};

    data.forEach(item => {
        const alcoholClass = item.Alcohol;
        if (!flavanoidsByClass[alcoholClass]) {
            flavanoidsByClass[alcoholClass] = [];
        }
        flavanoidsByClass[alcoholClass].push(item.Flavanoids);
    });

    const statistics: ClassStatistics = {};
    Object.keys(flavanoidsByClass).forEach(cls => {
        const flavanoids = flavanoidsByClass[parseInt(cls)];
        statistics[cls] = {
            mean: mean(flavanoids),
            median: median(flavanoids),
            mode: mode(flavanoids)
        };
    });

    return statistics;
}

  
  const FlavanoidsStatsTable: React.FC<FlavanoidsStatsTableProps> = ({ data }) => {
      const [stats, setStats] = useState<ClassStatistics>({});
  
      useEffect(() => {
          setStats(calculateStatistics(data));
      }, [data]);
  
      return (
          <table>
              <thead>
                  <tr>
                      <th>Class</th>
                      <th>Mean</th>
                      <th>Median</th>
                      <th>Mode</th>
                  </tr>
              </thead>
              <tbody>
                  {Object.entries(stats).map(([cls, { mean, median, mode }]) => (
                      <tr key={cls}>
                          <td>{cls}</td>
                          <td>{mean.toFixed(2)}</td>
                          <td>{median.toFixed(2)}</td>
                          <td>{mode.join(", ")}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      );
  };
  
  export default FlavanoidsStatsTable;

