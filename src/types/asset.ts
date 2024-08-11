export interface Asset {
    name: string;
    value: number | null;
    maintenance: number | null;
    appreciation: number | null;
    type: 'physical' | 'digital' | 'financial' | '';
  }
  
  export interface AssetWithCalculations extends Asset {
    lifespan?: string;
    roi?: string;
    doubleYourMoneyTime?: string;
    projectedValue?: string;
    annualCost?: string;
    annualReturn?: string;
  }