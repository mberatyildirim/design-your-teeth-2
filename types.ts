import React from 'react';

export type ViewState = 'landing' | 'app' | 'contact' | 'privacy' | 'terms' | 'admin' | 'quick-smile';

export type AppStep = 1 | 2 | 3 | 4 | 5;

export interface FormData {
  style: string;
  shade: string;
  image: File | null;
  name: string;
  email: string;
  phone: string;
}

export interface SmileStyleOption {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface ShadeOption {
  id: string;
  title: string;
  hex: string;
}