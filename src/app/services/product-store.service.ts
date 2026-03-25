import { Injectable, effect, signal } from '@angular/core';

import { SEED_PRODUCTS } from '../data/product.seed';
import { Product, ProductDraft } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductStoreService {
  private readonly storageKey = 'ms-enterprises-angular-catalog';
  private readonly defaultPrice = '';

  readonly products = signal<Product[]>(this.loadProducts());

  constructor() {
    effect(() => {
      this.persistProducts(this.products());
    });
  }

  addProduct(draft: ProductDraft): Product {
    const product: Product = {
      id: this.createId(),
      name: draft.name.trim(),
      category: draft.category.trim(),
      image: draft.image.trim() || 'assets/logo.png',
      price: draft.price.trim() || this.defaultPrice,
      headline:
        draft.headline.trim() || 'Custom yarn option prepared for quick catalog review and quotation.',
      description: draft.description.trim(),
      applications: draft.applications.map((application) => application.trim()).filter(Boolean),
      metrics: this.buildMetrics(draft.finish, draft.leadTime, draft.minOrder),
      featured: draft.featured ?? false,
    };

    this.products.update((items) => [product, ...items]);
    return product;
  }

  updateProduct(productId: string, draft: ProductDraft): Product | null {
    let updatedProduct: Product | null = null;

    this.products.update((items) =>
      items.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        updatedProduct = {
          ...item,
          name: draft.name.trim(),
          category: draft.category.trim(),
          image: draft.image.trim() || 'assets/logo.png',
          price: draft.price.trim() || this.defaultPrice,
          headline:
            draft.headline.trim() ||
            'Custom yarn option prepared for quick catalog review and quotation.',
          description: draft.description.trim(),
          applications: draft.applications.map((application) => application.trim()).filter(Boolean),
          metrics: this.buildMetrics(draft.finish, draft.leadTime, draft.minOrder),
          featured: draft.featured ?? item.featured ?? false,
        };

        return updatedProduct;
      }),
    );

    return updatedProduct;
  }

  deleteProduct(id: string): void {
    this.products.update((items) => items.filter((item) => item.id !== id));
  }

  restoreDefaultProducts(): number {
    const restoredProducts = this.mergeWithSeedProducts(this.products());
    const restoredCount = restoredProducts.length - this.products().length;

    if (restoredCount > 0) {
      this.products.set(restoredProducts);
    }

    return restoredCount;
  }

  private loadProducts(): Product[] {
    return this.mergeWithSeedProducts(this.readStorage());
  }

  private readStorage(): Product[] {
    if (!this.canUseStorage()) {
      return [];
    }

    try {
      const raw = globalThis.localStorage.getItem(this.storageKey);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((candidate) => this.hydrateProduct(candidate))
        .filter((candidate): candidate is Product => candidate !== null);
    } catch {
      return [];
    }
  }

  private persistProducts(products: Product[]): void {
    if (!this.canUseStorage()) {
      return;
    }

    try {
      globalThis.localStorage.setItem(this.storageKey, JSON.stringify(products));
    } catch {
      // Ignore storage write errors and keep the catalog usable in memory.
    }
  }

  private hydrateProduct(candidate: unknown): Product | null {
    if (!candidate || typeof candidate !== 'object') {
      return null;
    }

    const item = candidate as Partial<Product>;
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    const category = typeof item.category === 'string' ? item.category.trim() : '';
    const description = typeof item.description === 'string' ? item.description.trim() : '';

    if (!name || !category || !description) {
      return null;
    }

    const metrics = Array.isArray(item.metrics)
      ? item.metrics
          .filter(
            (metric): metric is { label: string; value: string } =>
              typeof metric?.label === 'string' && typeof metric?.value === 'string',
          )
          .map((metric) => ({
            label: metric.label.trim(),
            value: metric.value.trim(),
          }))
          .filter((metric) => metric.label && metric.value)
      : [];

    return {
      id: typeof item.id === 'string' && item.id.trim() ? item.id : this.createId(),
      name,
      category,
      image: typeof item.image === 'string' && item.image.trim() ? item.image.trim() : 'assets/logo.png',
      price: typeof item.price === 'string' && item.price.trim() ? item.price.trim() : this.defaultPrice,
      headline:
        typeof item.headline === 'string' && item.headline.trim()
          ? item.headline.trim()
          : 'Live catalog profile.',
      description,
      applications: Array.isArray(item.applications)
        ? item.applications
            .filter((application): application is string => typeof application === 'string')
            .map((application) => application.trim())
            .filter(Boolean)
        : [],
      metrics,
      featured: Boolean(item.featured),
    };
  }

  private createId(): string {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }

    return `product-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }

  private canUseStorage(): boolean {
    try {
      return typeof globalThis.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  private mergeWithSeedProducts(products: Product[]): Product[] {
    const existingIds = new Set(products.map((product) => product.id));
    const missingDefaults = SEED_PRODUCTS.filter((product) => !existingIds.has(product.id));

    return [...products, ...missingDefaults];
  }

  private buildMetrics(finish: string, leadTime: string, minOrder: string) {
    return [
      { label: 'Finish', value: finish.trim() || 'Custom finish' },
      { label: 'Lead time', value: leadTime.trim() || 'Quick dispatch support' },
      { label: 'MOQ', value: minOrder.trim() || 'As per requirement' },
    ];
  }
}
