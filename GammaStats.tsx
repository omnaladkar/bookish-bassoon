
  

  import React, { useState, useEffect } from 'react';
  import { Table } from '@mantine/core';

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

  function calculateGamma(data: WineData[]): WineData[] {
    return data.map(item => ({
        ...item,
        Gamma: (item.Ash * item.Hue) / item.Magnesium
    }));
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

function calculateStatistics(data: WineData[], property: keyof WineData): ClassStatistics {
    const valuesByClass: { [key: number]: number[] } = {};

    data.forEach(item => {
        const cls = item.Alcohol;
        if (!valuesByClass[cls]) {
            valuesByClass[cls] = [];
        }
        if (item[property] !== undefined) {
            valuesByClass[cls].push(item[property] as number);
        }
    });

    const statistics: ClassStatistics = {};
    Object.keys(valuesByClass).forEach(cls => {
        const values = valuesByClass[Number(cls)];
        statistics[Number(cls)] = {
            mean: parseFloat(mean(values).toFixed(3)),
            median: parseFloat(median(values).toFixed(3)),
            mode: mode(values).map(v => parseFloat(v.toFixed(3)))
        };
    });

    return statistics;
}




interface StatsProps {
    data: WineData[];
}

const GammaStats: React.FC<StatsProps> = ({ data }) => {
    const [stats, setStats] = useState<ClassStatistics>({});

    useEffect(() => {
        const gammaData = calculateGamma(data);
        setStats(calculateStatistics(gammaData, 'Gamma'));
    }, [data]);

    const headers = Object.keys(stats);

    return (
        <Table striped highlightOnHover>
            <thead>
                <tr>
                    <th>Measure</th>
                    {headers.map(cls => <th key={cls}>Class {cls}</th>)}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Gamma Mean</td>
                    {headers.map(cls => <td key={`mean-${cls}`}>{stats[Number(cls)].mean}</td>)}
                </tr>
                <tr>
                    <td>Gamma Median</td>
                    {headers.map(cls => <td key={`median-${cls}`}>{stats[Number(cls)].median}</td>)}
                </tr>
                <tr>
                    <td>Gamma Mode</td>
                    {headers.map(cls => <td key={`mode-${cls}`}>{stats[Number(cls)].mode.join(", ")}</td>)}
                </tr>
            </tbody>
        </Table>
    );
};

export default GammaStats;

