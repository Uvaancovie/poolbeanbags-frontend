

"use client";

import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import { formatPriceFromCents, formatPriceNumber } from '../../lib/formatPrice';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { useCart } from '../../components/CartContext';

type Product = {
	id: number;
	slug: string;
	title: string;
	description?: string;
	base_price_cents?: number;
	is_promotional?: boolean;
	promotion_text?: string;
	promotion_discount_percent?: number;
	images?: { id: number; url: string; alt: string }[];
};

export default function ShopPage() {
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
	const { addItem } = useCart();
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	async function fetchProducts() {
		try {
			setLoading(true);
			const res = await fetch(`${API_BASE}/api/products`);
			const data = await res.json();
			setProducts(data.products || []);
			setFilteredProducts(data.products || []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchProducts();
	}, []);

	useEffect(() => {
		let filtered = products;

		// Filter by search query
		if (searchQuery) {
			filtered = filtered.filter(product =>
				product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description?.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Filter by price range
		filtered = filtered.filter(product => {
			const price = (product.base_price_cents || 0) / 100;
			return price >= priceRange[0] && price <= priceRange[1];
		});

		// Filter by category (for now, we'll use promotional vs regular)
		if (selectedCategory === 'promotional') {
			filtered = filtered.filter(product => product.is_promotional);
		} else if (selectedCategory === 'regular') {
			filtered = filtered.filter(product => !product.is_promotional);
		}

		setFilteredProducts(filtered);
	}, [products, searchQuery, priceRange, selectedCategory]);

	const formatPrice = (cents: number) => formatPriceFromCents(cents);

	const getDisplayPrice = (product: Product) => {
		if (product.is_promotional && product.promotion_discount_percent) {
			const originalPrice = product.base_price_cents || 0;
			const discount = product.promotion_discount_percent;
			const discountedPrice = originalPrice * (1 - discount / 100);
			return {
				original: formatPrice(originalPrice),
				discounted: formatPrice(discountedPrice)
			};
		}
		return { original: formatPrice(product.base_price_cents || 0) };
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
				<div className="text-center">
					<span className="loading loading-spinner loading-lg text-primary"></span>
					<p className="mt-4 text-base-content/70">Loading products...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-base-content mb-4">Pool Beanbags Shop</h1>
					<p className="text-lg text-base-content/70 max-w-2xl mx-auto">Discover our premium collection of pool beanbags. Find the perfect comfort for your poolside relaxation.</p>
				</div>

				{/* Search and Filters */}
				<div className="mb-8">
					<Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{/* Search */}
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-base-content mb-2">Search Products</label>
								<Input
									type="text"
									placeholder="Search by name or description..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full"
								/>
							</div>

							{/* Price Range */}
							<div>
								<label className="block text-sm font-medium text-base-content mb-2">Max Price: {formatPriceNumber(priceRange[1])}</label>
								<input
									type="range"
									min="0"
									max="500"
									step="10"
									value={priceRange[1]}
									onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
									className="range range-primary w-full"
								/>
							</div>

							{/* Category Filter */}
							<div>
								<label className="block text-sm font-medium text-base-content mb-2">Category</label>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="select select-bordered w-full"
								>
									<option value="all">All Products</option>
									<option value="promotional">On Sale</option>
									<option value="regular">Regular Price</option>
								</select>
							</div>
						</div>
					</Card>
				</div>

				{/* Products Grid */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-base-content">Products</h2>
						<Badge className="badge-primary badge-lg font-semibold">
							{filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
						</Badge>
					</div>

					{filteredProducts.length === 0 ? (
						<Card className="p-12 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
							<div className="text-6xl mb-4">🔍</div>
							<h3 className="text-xl font-semibold text-base-content mb-2">No products found</h3>
							<p className="text-base-content/70">Try adjusting your search or filters to find what you're looking for.</p>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredProducts.map((product) => {
								const priceInfo = getDisplayPrice(product);
								return (
									<Card key={product.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
										{/* Product Image */}
										<div className="aspect-square bg-base-200 relative overflow-hidden">
											{product.images && product.images.length > 0 ? (
												<img
													src={product.images[0].url}
													alt={product.images[0].alt || product.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-6xl">
													🏊‍♂️
												</div>
											)}
											{product.is_promotional && (
												<Badge className="badge-error badge-sm absolute top-3 left-3 font-semibold">
													SALE
												</Badge>
											)}
										</div>

										{/* Product Info */}
										<div className="p-4">
											<h3 className="font-semibold text-lg text-base-content mb-2 line-clamp-2">
												{product.title}
											</h3>
											<p className="text-sm text-base-content/70 mb-3 line-clamp-2">
												{product.description}
											</p>

											{/* Price */}
																	<div className="mb-4">
																		{priceInfo.discounted ? (
																			<div className="flex items-center gap-2">
																				<span className="text-lg font-bold text-error">
																					{priceInfo.discounted}
																				</span>
																				<span className="text-sm text-base-content/50 line-through">
																					{priceInfo.original}
																				</span>
																				<Badge className="badge-error badge-xs">
																					-{product.promotion_discount_percent}%
																				</Badge>
																			</div>
																		) : (
																			<span className="text-lg font-bold text-base-content">
																				{priceInfo.original}
																			</span>
																		)}
																	</div>

											{/* Action Buttons */}
											<div className="space-y-2">
												<button
													onClick={() => addItem(product)}
													className="w-full bg-success hover:bg-success-focus text-success-content font-medium py-2 px-4 rounded-lg transition-all duration-200"
												>
													Add to Cart
												</button>
												<a
													href={`/product/${product.slug}`}
													className="w-full bg-primary hover:bg-primary-focus text-primary-content font-medium py-2 px-4 rounded-lg transition-all duration-200 text-center block"
												>
													View Details
												</a>
											</div>
										</div>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
