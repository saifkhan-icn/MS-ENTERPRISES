import { Product } from '../models/product';

const CONTACT_FOR_PRICE = '';

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'dyed-nim-lim-him',
    name: 'ALL DENIER DYED NIM & LIM & HIM',
    category: 'Dyed Textured',
    image: 'assets/products/dyed.webp',
    price: CONTACT_FOR_PRICE,
    headline: 'Shade-matched textured yarns for weaving, furnishing, and repeat production lots.',
    description:
      'A flexible dyed yarn range built for customers who need dependable shades, cleaner texture, and quick sourcing support for loom-ready manufacturing.',
    applications: ['Dress material', 'Home textile weaving', 'Repeat shade programs'],
    metrics: [
      { label: 'Format', value: 'NIM / LIM / HIM' },
      { label: 'Lead time', value: 'Fast quotation' },
      { label: 'Supply style', value: 'Made to requirement' },
    ],
    featured: true,
  },
  {
    id: '150-108-480-216',
    name: '150/108 & 480/216',
    category: 'Filament Yarn',
    image: 'assets/products/150.jpg',
    price: CONTACT_FOR_PRICE,
    headline: 'Targeted denier combinations for customers who buy by specification.',
    description:
      'This range is positioned for buyers looking for exact count support and stable dispatch planning across weaving and industrial textile use cases.',
    applications: ['Specification-based sourcing', 'Powerloom production', 'Consistent lot planning'],
    metrics: [
      { label: 'Profiles', value: '150/108, 480/216' },
      { label: 'Availability', value: 'Inquiry based' },
      { label: 'Use case', value: 'Structured yarn buying' },
    ],
    featured: true,
  },
  {
    id: 'white-nim-lim-him',
    name: 'ALL DENIER WHITE NIM & LIM & HIM',
    category: 'White Textured',
    image: 'assets/products/white.webp',
    price: CONTACT_FOR_PRICE,
    headline: 'Neutral white yarn options designed for dyeing, finishing, and clean base production.',
    description:
      'A white textured portfolio suited for mills and converters who prefer a clean starting point before custom coloring or finishing.',
    applications: ['Base stock for dyeing', 'Knitting preparation', 'Light-toned textile programs'],
    metrics: [
      { label: 'Finish', value: 'White stock' },
      { label: 'Format', value: 'NIM / LIM / HIM' },
      { label: 'Support', value: 'PAN India dispatch' },
    ],
  },
  {
    id: 'poy-fdy-dyed-white',
    name: 'POY & FDY DYED & WHITE',
    category: 'POY / FDY',
    image: 'assets/products/poy.webp',
    price: CONTACT_FOR_PRICE,
    headline: 'POY and FDY options covering both dyed and white sourcing requirements.',
    description:
      'Built for buyers who want one contact point for partially oriented and fully drawn yarn supply across multiple project requirements.',
    applications: ['Textile conversion', 'Multi-stage processing', 'Mixed procurement planning'],
    metrics: [
      { label: 'Portfolio', value: 'POY + FDY' },
      { label: 'Shade mode', value: 'Dyed / White' },
      { label: 'Order type', value: 'Custom requirement' },
    ],
  },
  {
    id: 'dyed-white-rope-yarn',
    name: 'DYED & WHITE ROPE YARN',
    category: 'Rope Yarn',
    image: 'assets/products/rope.webp',
    price: CONTACT_FOR_PRICE,
    headline: 'Heavier yarn presentation with color and white options for durable end-use categories.',
    description:
      'A rope-yarn focused offer suited for buyers needing a fuller build, visual texture, and dependable bulk handling for niche textile programs.',
    applications: ['Decorative weaving', 'Utility textile products', 'Heavy-texture fabric programs'],
    metrics: [
      { label: 'Range', value: 'Dyed / White' },
      { label: 'Strength', value: 'Bulk-friendly' },
      { label: 'Dispatch', value: 'Warehouse managed' },
    ],
    featured: true,
  },
  {
    id: 'fancy-yarn',
    name: 'FANCY YARN',
    category: 'Fancy Yarn',
    image: 'assets/products/fancy.webp',
    price: CONTACT_FOR_PRICE,
    headline: 'Texture-led yarn selection for value-added fabrics and standout woven surfaces.',
    description:
      'Designed for creative textile lines where visual character matters, with sourcing support that balances trend appeal and practical dispatch.',
    applications: ['Fashion fabrics', 'Decor accents', 'Premium woven detailing'],
    metrics: [
      { label: 'Visual appeal', value: 'High texture' },
      { label: 'Fit', value: 'Value-added products' },
      { label: 'Buying mode', value: 'Project based' },
    ],
  },
  {
    id: 'pc-pv-polyester-cotton',
    name: 'PC & PV & POLYSTER COTTON YARN',
    category: 'PC / PV Blends',
    image: 'assets/products/pc.jpg',
    price: CONTACT_FOR_PRICE,
    headline: 'Blend-focused yarn sourcing for balanced hand-feel, performance, and price planning.',
    description:
      'A practical blend category for buyers who want versatility across comfort, durability, and commercial textile production.',
    applications: ['Uniform fabric', 'Daily wear textiles', 'Commercial weaving'],
    metrics: [
      { label: 'Blend family', value: 'PC / PV' },
      { label: 'Buying focus', value: 'Balanced cost' },
      { label: 'Market fit', value: 'Broad demand' },
    ],
  },
  {
    id: 'high-bulk-yarn',
    name: 'HIGH BULK YARN',
    category: 'High Bulk',
    image: 'assets/products/high.jpg',
    price: CONTACT_FOR_PRICE,
    headline: 'Lofty yarn range for fuller feel, warmth, and volume-sensitive product categories.',
    description:
      'This category supports buyers looking for bulkier yarn construction without losing commercial usability in woven or furnishing programs.',
    applications: ['Warm textile lines', 'Soft furnishing surfaces', 'Volume-rich fabrics'],
    metrics: [
      { label: 'Character', value: 'High loft' },
      { label: 'Feel', value: 'Soft volume' },
      { label: 'Supply', value: 'Inquiry and dispatch support' },
    ],
  },
  {
    id: 'cotton-yarn',
    name: 'COTTON YARN',
    category: 'Cotton',
    image: 'assets/products/cotton.avif',
    price: CONTACT_FOR_PRICE,
    headline: 'Cotton-based sourcing support for breathable fabric programs and natural-fiber demand.',
    description:
      'A straightforward cotton category for mills, traders, and makers who need reliable buying support for natural-fiber production planning.',
    applications: ['Breathable fabric programs', 'Daily wear manufacturing', 'Natural fiber weaving'],
    metrics: [
      { label: 'Material', value: 'Cotton focused' },
      { label: 'Comfort', value: 'Breathable hand-feel' },
      { label: 'Supply mode', value: 'Requirement driven' },
    ],
  },
  {
    id: 'carpet-rugs-yarn',
    name: 'CARPET YARN & RUGS YARN',
    category: 'Carpet & Rug',
    image: 'assets/products/carpet.jpg',
    price: CONTACT_FOR_PRICE,
    headline: 'Durable yarn sourcing for carpet, rugs, and floor-textile programs.',
    description:
      'A category aligned to customers working on floor applications, where repeatable supply and practical strength matter for commercial orders.',
    applications: ['Carpet weaving', 'Rug making', 'Floor textile sourcing'],
    metrics: [
      { label: 'End use', value: 'Carpet / Rugs' },
      { label: 'Priority', value: 'Durability' },
      { label: 'Coverage', value: 'PAN India supply' },
    ],
    featured: true,
  },
];
