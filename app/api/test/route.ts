import { NextRequest, NextResponse } from "next/server";
import csv from 'csv-parser';
import { Readable } from 'stream';
import { RandomForestClassifier } from 'ml-random-forest';

export const maxDuration = 300;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { crimeDataUrl, pincode } = await req.json();

    const crimeData = await loadCrimeData(crimeDataUrl);
    const classifiedCrimeData = classifyCrime(crimeData);
    const aggregatedCrimes = aggregateCrimesByZip(classifiedCrimeData);
    const features = createFeatures(classifiedCrimeData);
    const model = trainCrimeClassifier(features);
    const predictedCrimeLevels = predictCrimeLevels(features, model);

    // Filter data based on pincode
    let filteredAggregatedCrimes = aggregatedCrimes;
    let filteredPredictedCrimeLevels = predictedCrimeLevels;
    if (pincode) {
      filteredAggregatedCrimes = aggregatedCrimes.filter(
        (item) => item.ZIP === pincode
      );
      filteredPredictedCrimeLevels = predictedCrimeLevels.filter(
        (item) => item.ZIP === pincode
      );
    }

    return NextResponse.json({
      status: 200,
      data: {
        aggregatedCrimes: filteredAggregatedCrimes,
        predictedCrimeLevels: filteredPredictedCrimeLevels,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      data: null,
      error: "An error occurred while processing the crime data.",
    });
  }
}

async function loadCrimeData(url: string): Promise<any[]> {
  const response = await fetch(url);
  const data = await response.text();
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    Readable.from(data)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function classifyCrime(crimeData: any[]): any[] {
  return crimeData.map(record => {
    const category = record['UCR CRIME CATEGORY'].toUpperCase();
    if (category.includes('AGGRAVATED ASSAULT') || category.includes('RAPE') || category.includes('MURDER')) {
      record['Crime Classification'] = 'ASSAULT';
    } else if (category.includes('BURGLARY') || category.includes('LARCENY') || category.includes('MOTOR VEHICLE') || category.includes('ROBBERY')) {
      record['Crime Classification'] = 'THEFT';
    } else {
      record['Crime Classification'] = 'OTHER';
    }
    return record;
  });
}

function normalizeFeatures(crimeData: any[]): any[] {
  return crimeData.map(record => {
    const totalCrimes = record.ASSAULT + record.THEFT + record.OTHER;
    return {
      ...record,
      NormalizedAssault: record.ASSAULT / totalCrimes,
      NormalizedTheft: record.THEFT / totalCrimes,
      NormalizedOther: record.OTHER / totalCrimes
    };
  });
}

function setCrimeLevelThresholds(features: any[]): number[] {
  const crimeCounts = features.map(f => f.CrimeCount).sort((a, b) => a - b);
  const q1 = crimeCounts[Math.floor(crimeCounts.length * 0.25)];
  const q2 = crimeCounts[Math.floor(crimeCounts.length * 0.5)];
  const q3 = crimeCounts[Math.floor(crimeCounts.length * 0.75)];

  return [q1, q2, q3];
}

function aggregateCrimesByZip(crimeData: any[]): any[] {
  const zipCodes = [...Array(99)].map((_, i) => 85001 + i).concat([...Array(10)].map((_, i) => 85280 + i));
  const filteredCrimeData = crimeData.filter(record => zipCodes.includes(Number(record['ZIP'])));
  
  const crimeCountByZip = filteredCrimeData.reduce((acc, record) => {
    const zip = record['ZIP'];
    acc[zip] = (acc[zip] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(crimeCountByZip).map(([ZIP, CrimeCount]) => ({ ZIP, CrimeCount }));
}

function createFeatures(crimeData: any[]): any[] {
  const crimeByZip = aggregateCrimesByZip(crimeData);
  const classificationCounts = crimeData.reduce((acc, record) => {
    const zip = record['ZIP'];
    const classification = record['Crime Classification'];
    if (!acc[zip]) acc[zip] = { ASSAULT: 0, THEFT: 0, OTHER: 0 };
    acc[zip][classification]++;
    return acc;
  }, {});

  const rawFeatures = crimeByZip.map(record => ({
    ...record,
    ...classificationCounts[record.ZIP]
  }));

  return normalizeFeatures(rawFeatures);
}

// Random Forest classification
function trainCrimeClassifier(features: any[]): RandomForestClassifier {
  const thresholds = setCrimeLevelThresholds(features);

  const X = features.map(f => [f.NormalizedAssault, f.NormalizedTheft, f.NormalizedOther]);
  const y = features.map(f => {
    if (f.CrimeCount > thresholds[2]) return 3; // VERY HIGH
    if (f.CrimeCount > thresholds[1]) return 2; // HIGH
    if (f.CrimeCount > thresholds[0]) return 1; // MEDIUM
    return 0; // LOW
  });

  const classifier = new RandomForestClassifier({
    nEstimators: 100,
    seed: 42
  });

  classifier.train(X, y);
  return classifier;
}

function predictCrimeLevels(features: any[], model: RandomForestClassifier): any[] {
  const X = features.map(f => [f.NormalizedAssault, f.NormalizedTheft, f.NormalizedOther]);
  const predictions = model.predict(X);
  
  const labels = ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];
  return features.map((f, i) => ({
    ZIP: f.ZIP,
    PredictedCrimeLevel: labels[predictions[i]]
  }));
}

// Mock Testing
const mockCrimeData = `
ZIP,UCR CRIME CATEGORY
85001,MURDER
85001,AGGRAVATED ASSAULT
85002,BURGLARY
85002,LARCENY
85002,LARCENY
85003,MOTOR VEHICLE
85003,MOTOR VEHICLE
85004,ROBBERY
85005,RAPE
85281,BURGLARY
85281,AGGRAVATED ASSAULT
85281,LARCENY
`;

async function loadMockCrimeData(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    Readable.from(mockCrimeData)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function test() {
  try {
      const crimeData = await loadMockCrimeData(); // Load your data
      const classifiedCrimeData = classifyCrime(crimeData); // Classify
      const features = createFeatures(classifiedCrimeData); // Create features
      const crimeClassifier = trainCrimeClassifier(features); // Train classifier
      const predictedLevels = predictCrimeLevels(features, crimeClassifier); // Predict
      
      // Console log the predicted crime levels
      console.log("Predicted Crime Levels:", predictedLevels);
  } catch (error) {
      console.error("Error during testing:", error);
  }
}

// Run the test
test();
