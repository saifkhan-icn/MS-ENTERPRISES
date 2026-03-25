import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product, ProductDraft } from './models/product';
import { ProductStoreService } from './services/product-store.service';

type AccessRole = 'visitor' | 'admin';
type ScreenState = 'loading' | 'entry' | 'catalog';
type PageView = 'website' | 'admin';

interface LoginFormModel {
  email: string;
  password: string;
}

interface ProductFormModel {
  name: string;
  category: string;
  image: string;
  price: string;
  headline: string;
  description: string;
  applications: string;
  finish: string;
  leadTime: string;
  minOrder: string;
}

interface EditableProductFormModel extends ProductFormModel {
  id: string | null;
  featured: boolean;
}

interface AdminAccount {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  addedBy: string;
  lastLoginAt: string;
}

@Component({
  selector: 'app-root',
  imports: [DatePipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  private readonly productStore = inject(ProductStoreService);
  private readonly accessStorageKey = 'ms-enterprises-access-role';
  private readonly currentAdminEmailKey = 'ms-enterprises-current-admin-email';
  private readonly adminAccountsKey = 'ms-enterprises-admin-accounts';
  private readonly bootDurationMs = 7000;
  private bootTimer: number | null = null;

  readonly products = this.productStore.products;
  readonly screen = signal<ScreenState>('loading');
  readonly activeView = signal<PageView>('website');
  readonly accessRole = signal<AccessRole | null>(null);
  readonly currentAdminEmail = signal('');
  readonly adminAccounts = signal<AdminAccount[]>(this.loadAdminAccounts());
  readonly contactProduct = signal<Product | null>(null);
  readonly isAdmin = computed(() => this.accessRole() === 'admin');
  readonly searchTerm = signal('');
  readonly activeCategory = signal('All');
  readonly selectedProductId = signal<string | null>(this.products()[0]?.id ?? null);
  readonly adminSelectedProductId = signal<string | null>(this.products()[0]?.id ?? null);
  readonly feedbackMessage = signal(
    'Click any product card to read complete information and contact us for pricing.',
  );
  readonly loginError = signal('');
  readonly adminCredentialsHint = 'Use your own admin email and password';
  readonly contactPriceLabel = 'Contact for price';
  readonly adminPriceLabel = 'Add price';
  readonly salesPhone = '917021865345';
  readonly displayPhone = '+91 70218 65345';

  readonly heroTags = ['Polyester textured', 'Cotton & blends', 'Direct inquiry', 'PAN India supply'];
  readonly accessHighlights = [
    {
      title: 'Trusted supply partner',
      text: 'Source PTY, cotton, blended, rope, and specialty yarns through one dependable inquiry desk for handloom and powerloom buyers.',
    },
    {
      title: 'Buyer-ready catalog',
      text: 'Review product applications, finish details, and inquiry options quickly without waiting for separate product sheets.',
    },
    {
      title: 'Responsive business support',
      text: 'Move from product discovery to WhatsApp or call support in one clean flow designed for faster business conversations.',
    },
  ];
  readonly operations = [
    {
      title: 'Product Procurement',
      text: 'Requirement-based sourcing support for polyester, filament, cotton, carpet, and blended yarn categories.',
    },
    {
      title: 'Quality Testing',
      text: 'A practical review flow that prioritizes usable lots, dependable texture, and cleaner dispatch confidence.',
    },
    {
      title: 'Storage & Packing',
      text: 'Warehouse-managed handling for bulk orders so yarn reaches buyers in ready-to-dispatch condition.',
    },
    {
      title: 'PAN India Distribution',
      text: 'A supply approach built around quick communication, route planning, and location-based delivery support.',
    },
  ];
  readonly contactCards = [
    {
      title: 'Email',
      value: 'msenterprises.997@gmail.com',
      note: 'Share yarn counts, shades, or purchase inquiries directly.',
      href: 'mailto:msenterprises.997@gmail.com',
    },
    {
      title: 'WhatsApp',
      value: this.displayPhone,
      note: 'Fastest route for requirement discussion and follow-ups.',
      href: `https://wa.me/${this.salesPhone}`,
    },
    {
      title: 'Location',
      value: 'M.S. ENTERPRISES',
      note: 'Open the business location on Google Maps.',
      href: 'https://www.google.com/maps/place/MS+ENTERPRISES/data=!4m7!3m6!1s0x3be7bd0c8ff886bd:0x82aaf4e711b29ba1!8m2!3d19.2930885!4d73.0618056!16s%2Fg%2F11g69y421f!19sChIJvYb4jwy95zsRoZuyEef0qoI?authuser=0&hl=en&rclk=1',
    },
  ];

  readonly categories = computed(() => [
    'All',
    ...new Set(this.products().map((product) => product.category)),
  ]);

  readonly filteredProducts = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const category = this.activeCategory();

    return this.products().filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.applications.some((application) => application.toLowerCase().includes(search));

      return matchesCategory && matchesSearch;
    });
  });

  readonly selectedProduct = computed(() => {
    const currentId = this.selectedProductId();
    const visibleProducts = this.filteredProducts();

    return visibleProducts.find((product) => product.id === currentId) ?? visibleProducts[0] ?? null;
  });

  readonly adminSelectedProduct = computed(() => {
    const currentId = this.adminSelectedProductId();
    const items = this.products();

    return items.find((product) => product.id === currentId) ?? items[0] ?? null;
  });

  readonly dashboardStats = computed(() => [
    { label: 'Catalog items', value: `${this.products().length}`.padStart(2, '0') },
    { label: 'Visible now', value: `${this.filteredProducts().length}`.padStart(2, '0') },
    {
      label: 'Product families',
      value: `${new Set(this.products().map((product) => product.category)).size}`.padStart(2, '0'),
    },
  ]);

  readonly adminStats = computed(() => [
    { label: 'Products', value: `${this.products().length}`.padStart(2, '0') },
    {
      label: 'Priced items',
      value: `${this.products().filter((product) => this.hasRealPrice(product)).length}`.padStart(2, '0'),
    },
    { label: 'Admin users', value: `${this.adminAccounts().length}`.padStart(2, '0') },
  ]);

  readonly sortedAdminAccounts = computed(() =>
    [...this.adminAccounts()].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
  );

  readonly currentYear = new Date().getFullYear();

  loginForm = this.createEmptyLoginForm();
  newProduct = this.createEmptyProductForm();
  productEditor = this.createEditableProductForm(this.products()[0] ?? null);
  newAdminForm = this.createEmptyLoginForm();

  constructor() {
    const savedAccessRole = this.readStoredAccessRole();

    if (this.shouldSkipPreloader()) {
      this.finishBoot(savedAccessRole);
      return;
    }

    this.bootTimer = globalThis.setTimeout(() => {
      this.finishBoot(savedAccessRole);
    }, this.bootDurationMs);
  }

  ngOnDestroy(): void {
    if (this.bootTimer !== null) {
      globalThis.clearTimeout(this.bootTimer);
    }
  }

  continueAsVisitor(): void {
    this.loginError.set('');
    this.loginForm = this.createEmptyLoginForm();
    this.activeView.set('website');
    this.setAccessRole('visitor');
    this.feedbackMessage.set('Browse products and tap Contact for price to reach us directly.');
  }

  loginAsAdmin(): void {
    const email = this.loginForm.email.trim().toLowerCase();
    const password = this.loginForm.password.trim();

    if (!email || !password) {
      this.loginError.set('Admin email and password are required.');
      return;
    }

    const accounts = this.adminAccounts();

    if (accounts.length === 0) {
      const firstAdmin = this.createAdminAccount(email, password, 'Founding admin');
      this.setAdminAccounts([firstAdmin]);
      this.currentAdminEmail.set(firstAdmin.email);
    } else {
      const matchedAdmin = accounts.find(
        (account) => account.email === email && account.password === password,
      );

      if (!matchedAdmin) {
        this.loginError.set('Invalid admin email or password.');
        return;
      }

      this.currentAdminEmail.set(matchedAdmin.email);
      this.touchAdminLogin(matchedAdmin.email);
    }

    this.loginError.set('');
    this.loginForm = this.createEmptyLoginForm();
    this.activeView.set('website');
    this.setAccessRole('admin');
    this.persistCurrentAdminEmail(this.currentAdminEmail());
    this.feedbackMessage.set('Admin mode active. Open the admin panel anytime to manage products, pricing, and users.');
    this.syncEditorFromProduct(this.adminSelectedProduct());
  }

  openAccessGate(): void {
    this.loginError.set('');
    this.loginForm = this.createEmptyLoginForm();
    this.screen.set('entry');
  }

  openAdminPage(): void {
    if (!this.isAdmin()) {
      return;
    }

    this.activeView.set('admin');
    this.syncEditorFromProduct(this.adminSelectedProduct());
  }

  openWebsiteView(): void {
    this.activeView.set('website');
  }

  logout(): void {
    this.clearStoredAccessRole();
    this.clearStoredCurrentAdminEmail();
    this.accessRole.set(null);
    this.currentAdminEmail.set('');
    this.contactProduct.set(null);
    this.loginError.set('');
    this.loginForm = this.createEmptyLoginForm();
    this.activeView.set('website');
    this.screen.set('entry');
    this.feedbackMessage.set('Choose visitor or admin access to continue.');
  }

  selectCategory(category: string): void {
    this.activeCategory.set(category);
  }

  selectProduct(productId: string): void {
    this.selectedProductId.set(productId);
  }

  selectAdminProduct(productId: string): void {
    this.adminSelectedProductId.set(productId);
    const product = this.products().find((item) => item.id === productId) ?? null;
    this.syncEditorFromProduct(product);
  }

  addProduct(): void {
    if (!this.isAdmin()) {
      this.feedbackMessage.set('Only admin can add products.');
      return;
    }

    const draft = this.buildProductDraftFromForm(this.newProduct);

    if (!draft) {
      this.feedbackMessage.set('Name, category, and description are required before adding a product.');
      return;
    }

    const createdProduct = this.productStore.addProduct(draft);
    this.searchTerm.set('');
    this.activeCategory.set('All');
    this.selectedProductId.set(createdProduct.id);
    this.adminSelectedProductId.set(createdProduct.id);
    this.syncEditorFromProduct(createdProduct);
    this.feedbackMessage.set(`${createdProduct.name} added to the catalog.`);
    this.newProduct = this.createEmptyProductForm();
  }

  saveAdminProduct(): void {
    if (!this.isAdmin() || !this.productEditor.id) {
      this.feedbackMessage.set('Select a product first to update it.');
      return;
    }

    const draft = this.buildProductDraftFromEditor(this.productEditor);

    if (!draft) {
      this.feedbackMessage.set('Name, category, and description are required before saving a product.');
      return;
    }

    const updatedProduct = this.productStore.updateProduct(this.productEditor.id, draft);

    if (!updatedProduct) {
      this.feedbackMessage.set('Unable to save this product right now.');
      return;
    }

    this.selectedProductId.set(updatedProduct.id);
    this.adminSelectedProductId.set(updatedProduct.id);
    this.syncEditorFromProduct(updatedProduct);
    this.feedbackMessage.set(`${updatedProduct.name} updated successfully.`);
  }

  restoreDefaults(): void {
    if (!this.isAdmin()) {
      this.feedbackMessage.set('Only admin can restore original products.');
      return;
    }

    const restoredCount = this.productStore.restoreDefaultProducts();
    this.searchTerm.set('');
    this.activeCategory.set('All');

    const firstProductId = this.products()[0]?.id ?? null;
    this.selectedProductId.set(firstProductId);
    this.adminSelectedProductId.set(firstProductId);
    this.syncEditorFromProduct(this.adminSelectedProduct());

    if (restoredCount === 0) {
      this.feedbackMessage.set('All original products are already present in the catalog.');
      return;
    }

    this.feedbackMessage.set(
      `${restoredCount} original product${restoredCount > 1 ? 's were' : ' was'} restored to the catalog.`,
    );
  }

  deleteProduct(productId: string, event?: Event): void {
    event?.stopPropagation();

    if (!this.isAdmin()) {
      this.feedbackMessage.set('Only admin can delete products.');
      return;
    }

    const product = this.products().find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const shouldDelete =
      typeof globalThis.confirm === 'function'
        ? globalThis.confirm(`Delete "${product.name}" from the catalog?`)
        : true;

    if (!shouldDelete) {
      return;
    }

    this.productStore.deleteProduct(productId);
    this.feedbackMessage.set(`${product.name} removed from the catalog.`);

    const fallbackId = this.filteredProducts()[0]?.id ?? this.products()[0]?.id ?? null;

    if (this.selectedProductId() === productId) {
      this.selectedProductId.set(fallbackId);
    }

    if (this.adminSelectedProductId() === productId) {
      const nextAdminId = this.products()[0]?.id ?? null;
      this.adminSelectedProductId.set(nextAdminId);
      this.syncEditorFromProduct(this.adminSelectedProduct());
    }
  }

  addAdminUser(): void {
    if (!this.isAdmin()) {
      this.feedbackMessage.set('Only admin can create more admin users.');
      return;
    }

    const email = this.newAdminForm.email.trim().toLowerCase();
    const password = this.newAdminForm.password.trim();

    if (!email || !password) {
      this.feedbackMessage.set('Admin email and password are required.');
      return;
    }

    const alreadyExists = this.adminAccounts().some((account) => account.email === email);

    if (alreadyExists) {
      this.feedbackMessage.set('This email is already registered as admin.');
      return;
    }

    const newAdmin = this.createAdminAccount(email, password, this.currentAdminEmail() || 'Admin');
    this.setAdminAccounts([...this.adminAccounts(), newAdmin]);
    this.newAdminForm = this.createEmptyLoginForm();
    this.feedbackMessage.set(`${newAdmin.email} added as admin.`);
  }

  isSelected(productId: string): boolean {
    return this.selectedProduct()?.id === productId;
  }

  isAdminProductSelected(productId: string): boolean {
    return this.adminSelectedProduct()?.id === productId;
  }

  openContactOptions(product: Product, event?: Event): void {
    if (this.isAdmin() || this.hasRealPrice(product)) {
      return;
    }

    event?.stopPropagation();
    this.contactProduct.set(product);
  }

  closeContactOptions(): void {
    this.contactProduct.set(null);
  }

  priceFor(product: Product): string {
    const normalizedPrice = this.normalizedPrice(product);

    if (normalizedPrice) {
      return normalizedPrice;
    }

    return this.isAdmin() ? this.adminPriceLabel : this.contactPriceLabel;
  }

  priceDisplay(product: Product): string {
    const label = this.priceFor(product);
    return this.hasRealPrice(product) || !this.isAdmin() ? `₹ ${label}` : label;
  }

  isContactPrice(product: Product): boolean {
    return !this.isAdmin() && !this.hasRealPrice(product);
  }

  hasRealPrice(product: Product): boolean {
    return this.normalizedPrice(product).length > 0;
  }

  whatsappLink(product: Product): string {
    const message = encodeURIComponent(
      `Hello, I want price details for ${product.name}. Please share the quotation.`,
    );

    return `https://wa.me/${this.salesPhone}?text=${message}`;
  }

  callLink(): string {
    return `tel:+${this.salesPhone}`;
  }

  trackAdminEmail(_index: number, account: AdminAccount): string {
    return account.id;
  }

  private finishBoot(savedAccessRole: AccessRole | null): void {
    if (savedAccessRole === 'admin') {
      this.accessRole.set('admin');
      this.currentAdminEmail.set(this.readStoredCurrentAdminEmail());
      this.activeView.set('website');
      this.screen.set('catalog');
      this.feedbackMessage.set('Admin mode active. Open the admin panel to manage catalog and users.');
      this.syncEditorFromProduct(this.adminSelectedProduct());
      return;
    }

    if (savedAccessRole === 'visitor') {
      this.accessRole.set('visitor');
      this.activeView.set('website');
      this.screen.set('catalog');
      this.feedbackMessage.set('Browse products and tap Contact for price to reach us directly.');
      return;
    }

    this.screen.set('entry');
    this.feedbackMessage.set('Choose visitor or admin access to continue.');
  }

  private setAccessRole(role: AccessRole): void {
    this.accessRole.set(role);

    if (role === 'admin') {
      this.persistAccessRole(role);
    } else {
      this.clearStoredAccessRole();
    }

    this.selectedProductId.set(this.products()[0]?.id ?? null);
    this.screen.set('catalog');
  }

  private buildProductDraftFromForm(form: ProductFormModel): ProductDraft | null {
    return this.buildDraft(
      form.name,
      form.category,
      form.image,
      form.price,
      form.headline,
      form.description,
      form.applications,
      form.finish,
      form.leadTime,
      form.minOrder,
    );
  }

  private buildProductDraftFromEditor(form: EditableProductFormModel): ProductDraft | null {
    return this.buildDraft(
      form.name,
      form.category,
      form.image,
      form.price,
      form.headline,
      form.description,
      form.applications,
      form.finish,
      form.leadTime,
      form.minOrder,
      form.featured,
    );
  }

  private buildDraft(
    name: string,
    category: string,
    image: string,
    price: string,
    headline: string,
    description: string,
    applications: string,
    finish: string,
    leadTime: string,
    minOrder: string,
    featured = false,
  ): ProductDraft | null {
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedCategory || !trimmedDescription) {
      return null;
    }

    return {
      name: trimmedName,
      category: trimmedCategory,
      image: image.trim(),
      price: price.trim(),
      headline: headline.trim(),
      description: trimmedDescription,
      applications: applications
        .split(',')
        .map((application) => application.trim())
        .filter(Boolean),
      finish: finish.trim(),
      leadTime: leadTime.trim(),
      minOrder: minOrder.trim(),
      featured,
    };
  }

  private syncEditorFromProduct(product: Product | null): void {
    this.productEditor = this.createEditableProductForm(product);
  }

  private createEmptyLoginForm(): LoginFormModel {
    return {
      email: '',
      password: '',
    };
  }

  private createEmptyProductForm(): ProductFormModel {
    return {
      name: '',
      category: 'Custom Yarn',
      image: '',
      price: '',
      headline: '',
      description: '',
      applications: '',
      finish: '',
      leadTime: '',
      minOrder: '',
    };
  }

  private createEditableProductForm(product: Product | null): EditableProductFormModel {
    const finishMetric = product?.metrics.find((metric) => metric.label === 'Finish')?.value ?? '';
    const leadTimeMetric = product?.metrics.find((metric) => metric.label === 'Lead time')?.value ?? '';
    const minOrderMetric = product?.metrics.find((metric) => metric.label === 'MOQ')?.value ?? '';

    return {
      id: product?.id ?? null,
      name: product?.name ?? '',
      category: product?.category ?? '',
      image: product?.image ?? '',
      price: this.normalizedPrice(product ?? null),
      headline: product?.headline ?? '',
      description: product?.description ?? '',
      applications: product?.applications.join(', ') ?? '',
      finish: finishMetric,
      leadTime: leadTimeMetric,
      minOrder: minOrderMetric,
      featured: Boolean(product?.featured),
    };
  }

  private normalizedPrice(product: Product | null): string {
    const rawPrice = product?.price?.trim() ?? '';

    if (!rawPrice || rawPrice.toLowerCase() === this.contactPriceLabel.toLowerCase()) {
      return '';
    }

    return rawPrice;
  }

  private loadAdminAccounts(): AdminAccount[] {
    if (!this.canUseStorage()) {
      return [];
    }

    try {
      const rawAccounts = globalThis.localStorage.getItem(this.adminAccountsKey);

      if (!rawAccounts) {
        return [];
      }

      const parsedAccounts = JSON.parse(rawAccounts);

      if (!Array.isArray(parsedAccounts)) {
        return [];
      }

      return parsedAccounts.filter(this.isValidAdminAccount);
    } catch {
      return [];
    }
  }

  private setAdminAccounts(accounts: AdminAccount[]): void {
    this.adminAccounts.set(accounts);
    this.persistAdminAccounts(accounts);
  }

  private persistAdminAccounts(accounts: AdminAccount[]): void {
    if (!this.canUseStorage()) {
      return;
    }

    try {
      globalThis.localStorage.setItem(this.adminAccountsKey, JSON.stringify(accounts));
    } catch {
      // Ignore storage write errors and keep admin accounts in memory.
    }
  }

  private touchAdminLogin(email: string): void {
    const updatedAccounts = this.adminAccounts().map((account) =>
      account.email === email
        ? {
            ...account,
            lastLoginAt: new Date().toISOString(),
          }
        : account,
    );

    this.setAdminAccounts(updatedAccounts);
  }

  private createAdminAccount(email: string, password: string, addedBy: string): AdminAccount {
    const now = new Date().toISOString();

    return {
      id: this.createId(),
      email,
      password,
      createdAt: now,
      addedBy,
      lastLoginAt: now,
    };
  }

  private isValidAdminAccount(candidate: unknown): candidate is AdminAccount {
    if (!candidate || typeof candidate !== 'object') {
      return false;
    }

    const account = candidate as Partial<AdminAccount>;

    return (
      typeof account.id === 'string' &&
      typeof account.email === 'string' &&
      typeof account.password === 'string' &&
      typeof account.createdAt === 'string' &&
      typeof account.addedBy === 'string' &&
      typeof account.lastLoginAt === 'string'
    );
  }

  private readStoredAccessRole(): AccessRole | null {
    if (!this.canUseStorage()) {
      return null;
    }

    try {
      const rawRole = globalThis.localStorage.getItem(this.accessStorageKey);

      if (rawRole === 'admin') {
        return 'admin';
      }

      if (rawRole === 'visitor') {
        this.clearStoredAccessRole();
      }

      return null;
    } catch {
      return null;
    }
  }

  private persistAccessRole(role: AccessRole): void {
    if (!this.canUseStorage()) {
      return;
    }

    try {
      globalThis.localStorage.setItem(this.accessStorageKey, role);
    } catch {
      // Ignore storage errors and keep access state in memory.
    }
  }

  private clearStoredAccessRole(): void {
    if (!this.canUseStorage()) {
      return;
    }

    try {
      globalThis.localStorage.removeItem(this.accessStorageKey);
    } catch {
      // Ignore storage errors and just clear the in-memory session.
    }
  }

  private readStoredCurrentAdminEmail(): string {
    if (!this.canUseStorage()) {
      return '';
    }

    try {
      return globalThis.localStorage.getItem(this.currentAdminEmailKey)?.trim().toLowerCase() ?? '';
    } catch {
      return '';
    }
  }

  private persistCurrentAdminEmail(email: string): void {
    if (!this.canUseStorage()) {
      return;
    }

    try {
      globalThis.localStorage.setItem(this.currentAdminEmailKey, email.trim().toLowerCase());
    } catch {
      // Ignore storage errors and keep the session in memory.
    }
  }

  private clearStoredCurrentAdminEmail(): void {
    if (!this.canUseStorage()) {
      return;
    }

    try {
      globalThis.localStorage.removeItem(this.currentAdminEmailKey);
    } catch {
      // Ignore storage errors and just clear the in-memory session.
    }
  }

  private createId(): string {
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return globalThis.crypto.randomUUID();
    }

    return `id-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }

  private canUseStorage(): boolean {
    try {
      return typeof globalThis.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  private shouldSkipPreloader(): boolean {
    try {
      return /jsdom/i.test(globalThis.navigator?.userAgent ?? '');
    } catch {
      return false;
    }
  }
}
