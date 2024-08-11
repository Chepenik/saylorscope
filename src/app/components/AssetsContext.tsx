"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Asset } from '../../types/asset';

interface AssetsContextType {
  assets: Asset[];
  addAsset: () => void;
  updateAsset: (index: number, field: keyof Asset, value: string | number | null) => void;
  clearAllAssets: () => void;
  isAnyAILoading: boolean;
  setIsAnyAILoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

const initialAsset: Asset = { name: '', value: null, maintenance: null, appreciation: null, type: '' };

export const AssetsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([initialAsset]);
  const [isAnyAILoading, setIsAnyAILoading] = useState(false);

  useEffect(() => {
    const savedAssets = localStorage.getItem('savedAssets');
    if (savedAssets) {
      try {
        const parsedAssets = JSON.parse(savedAssets);
        if (Array.isArray(parsedAssets) && parsedAssets.length > 0) {
          setAssets(parsedAssets);
        }
      } catch (error) {
        console.error('Error parsing saved assets:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedAssets', JSON.stringify(assets));
  }, [assets]);

  const addAsset = () => {
    setAssets(prevAssets => [...prevAssets, { ...initialAsset }]);
  };

  const updateAsset = (index: number, field: keyof Asset, value: string | number | null) => {
    setAssets(prevAssets => 
      prevAssets.map((asset, i) => 
        i === index ? { ...asset, [field]: value } : asset
      )
    );
  };

  const clearAllAssets = () => {
    setAssets([{ ...initialAsset }]);
    localStorage.removeItem('savedAssets');
  };

  const contextValue: AssetsContextType = {
    assets,
    addAsset,
    updateAsset,
    clearAllAssets,
    isAnyAILoading,
    setIsAnyAILoading
  };

  return (
    <AssetsContext.Provider value={contextValue}>
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
};