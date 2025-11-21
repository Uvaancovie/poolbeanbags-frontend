"use client";

import { useEffect, useState } from 'react';
import { API_BASE } from 'lib/api';
import { Button } from '../../components/ui/Button';
import { formatPriceFromCents, formatPriceNumber } from '../../lib/formatPrice';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { useCart } from '../../components/CartContext';
import Image from "next/image";
import Link from "next/link";
import Reviews from "@/components/Reviews";
import { FabricsCarousel } from '../../components/FabricsCarousel';

type Product = {
	_id?: string;
	id: string;
	slug: string;
	title: string;
	description?: string;
	base_price_cents?: number;
	is_promotional?: boolean;
	promotion_text?: string;
	promotion_discount_percent?: number;
	images?: { id?: string; _id?: string; url: string; alt: string }[];
};

export default function ShopPage() {
	// use shared API_BASE from lib/api
	const { addItem } = useCart();
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 4000]);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	async function fetchProducts() {
		try {
			setLoading(true);
			
			let res;
			try {
				// Try local proxy first for caching
				res = await fetch(`/api/products`, { cache: 'force-cache' });
				if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
			} catch (e) {
				console.warn("Local proxy failed, falling back to direct API", e);
				// Fallback to direct backend call
				res = await fetch(`${API_BASE}/api/products`, {
					cache: 'no-store',
					headers: { 'Cache-Control': 'no-cache' }
				});
			}
			
			if (!res.ok) {
				console.error(`API returned ${res.status}: ${res.statusText}`);
				setProducts([]);
				setFilteredProducts([]);
				return;
			}
			
			const data = await res.json();
			// Handle both { products: [...] } and [...] formats
			const rawProducts = Array.isArray(data) ? data : (data.products || []);
			
			// Map _id to id for compatibility
			const products = rawProducts.map((p: any) => ({ ...p, id: p._id || p.id }));
			
			setProducts(products);
			setFilteredProducts(products);
		} catch (err: any) {
			console.error('Fetch error:', err.message);
			setProducts([]);
			setFilteredProducts([]);
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
			<div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
				<div className="text-center">
					<span className="loading loading-spinner loading-lg text-[var(--fg)]"></span>
					<p className="mt-4 text-[var(--fg-muted)]">Loading products...</p>
				</div>
			</div>
		);
	}

	return (
		<main className="bg-[var(--bg)]">
			{/* HERO — quiet and minimal */}
			<section className="relative">
				<div className="relative h-[34vh] min-h-[280px]">
					<Image
						src="/lifestyle.jpg"
						alt="Pool Bean Bags — shop hero"
						fill
						priority
						sizes="100vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black/55" />
					<div className="relative z-10 h-full flex items-center justify-center px-4">
						<div className="text-center text-white">
							<h1 className="poppins-light text-[32px] md:text-[44px] leading-tight">Shop</h1>
							<p className="poppins-extralight text-white/90 mt-2">
								Minimal forms. Weather-ready fabrics. Calm comfort.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* AVAILABLE FABRICS */}
			<section className="px-4 py-10">
				<div className="mx-auto max-w-[1280px]">
					<h3 className="poppins-light text-[22px] md:text-[26px] text-[var(--fg)] mb-6">
						Available Fabrics
					</h3>
					<FabricsCarousel />
				</div>
			</section>

			{/* FILTER / SORT BAR — monochrome, subtle */}
			<section className="px-4">
				<div className="mx-auto max-w-[1280px] py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-[var(--border)]">
					<div className="text-sm text-[var(--fg-muted)]">
						{filteredProducts.length} products
					</div>
					<div className="flex items-center gap-3">
						{/* Search */}
						<div className="md:col-span-2">
							<Input
								type="text"
								placeholder="Search products..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-40"
							/>
						</div>

						{/* Price Range */}
						<div>
							<label className="block text-sm font-medium text-[var(--fg)] mb-2">Max Price: {formatPriceNumber(priceRange[1])}</label>
							<input
								type="range"
								min="0"
								max="4000"
								step="50"
								value={priceRange[1]}
								onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
								className="range range-primary w-full"
							/>
						</div>

						{/* Category Filter */}
						<div>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="input w-40"
							>
								<option value="all">All Products</option>
								<option value="promotional">On Sale</option>
								<option value="regular">Regular Price</option>
							</select>
						</div>
					</div>
				</div>
			</section>

			{/* GRID */}
			<section className="px-4">
				<div className="mx-auto max-w-[1280px] py-10">
					{filteredProducts.length === 0 ? (
						<div className="text-center py-16">
							<h3 className="text-2xl font-light text-[var(--fg)] mb-4">No products found</h3>
							<p className="text-[var(--fg-muted)]">Try adjusting your search or filters.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredProducts.map((product) => {
								const priceInfo = getDisplayPrice(product);
								return (
									<Card
										key={product.id}
										className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
									>
										<Link href={`/product/${product.slug}`} aria-label={product.title}>
											<div className="relative aspect-[4/3] w-full">
												{product.images && product.images.length > 0 ? (
													<Image
														src={product.images[0].url}
														alt={product.images[0].alt || product.title}
														fill
														sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
														className="object-cover transition-transform duration-500 hover:scale-[1.02]"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-[var(--muted)] text-6xl">
														🏊
													</div>
												)}
												{product.is_promotional && (
													<span className="absolute left-3 top-3 rounded-full border border-[var(--border)] bg-[var(--card)]/90 px-3 py-1 text-[11px] uppercase tracking-wide text-[var(--fg-muted)] backdrop-blur">
														SALE
													</span>
												)}
											</div>
										</Link>

										<div className="p-5">
											<Link href={`/product/${product.slug}`} className="block">
												<h3 className="poppins-regular text-[var(--fg)] leading-tight">
													{product.title}
												</h3>
												<div className="mt-2">
													{priceInfo.discounted ? (
														<div className="flex items-center gap-2">
															<span className="text-lg font-bold text-[var(--fg)]">
																{priceInfo.discounted}
															</span>
															<span className="text-sm text-[var(--fg-muted)] line-through">
																{priceInfo.original}
															</span>
															<span className="text-xs bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-1 rounded">
																-{product.promotion_discount_percent}%
															</span>
														</div>
													) : (
														<span className="text-lg font-bold text-[var(--fg)]">
															{priceInfo.original}
														</span>
													)}
												</div>
											</Link>
											<div className="mt-4 flex items-center gap-3">
												<Button asChild>
													<Link href={`/product/${product.slug}`}>View</Link>
												</Button>
												<button
													onClick={() => addItem(product)}
													className="btn-primary"
												>
													Add to Cart
												</button>
											</div>
										</div>
									</Card>
								);
							})}
						</div>
					)}

					{/* Pagination — simple, monochrome */}
					<div className="mt-10 flex items-center justify-center gap-2">
						<Link
							href="/shop?page=1"
							className="btn-outline rounded-full px-4 py-2 text-sm"
						>
							1
						</Link>
						<Link
							href="/shop?page=2"
							className="btn-outline rounded-full px-4 py-2 text-sm"
						>
							2
						</Link>
						<span className="text-[var(--fg-muted)] text-sm px-2">…</span>
						<Link
							href="/shop?page=next"
							className="btn-outline rounded-full px-4 py-2 text-sm"
						>
							Next →
						</Link>
					</div>
				</div>
			</section>

			{/* SOCIAL PROOF / REVIEWS — minimal, rounded, no stars */}
			<Reviews />
		</main>
	);
}
