export interface ProductMetric {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  headline: string;
  description: string;
  applications: string[];
  metrics: ProductMetric[];
  featured?: boolean;
}

export interface ProductDraft {
  name: string;
  category: string;
  image: string;
  price: string;
  headline: string;
  description: string;
  applications: string[];
  finish: string;
  leadTime: string;
  minOrder: string;
  featured?: boolean;
}
