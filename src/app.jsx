import { useEffect, useState } from 'react';

const API_BASE = 'https://fakestoreapi.com';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/products/categories`),
          fetch(`${API_BASE}/products`)
        ]);

        if (!categoriesRes.ok || !productsRes.ok) {
          throw new Error('Unable to load products or categories');
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategories(['all', ...categoriesData]);
        setProducts(productsData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <p className="eyebrow">Fake Store Frontend</p>
          <h1>Shop by category with real product style</h1>
          <p className="hero-text">
            Browse curated items from the Fake Store API, then filter by category to find
            what feels right for your next purchase.
          </p>
        </div>
      </header>

      <section className="controls">
        <div className="category-panel">
          <label htmlFor="category-select" className="filter-label">
            Filter by Category
          </label>
          {loading ? (
            <p>Loading categories…</p>
          ) : (
            <select
              id="category-select"
              className="category-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Products' : category}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      <main className="product-grid-section">
        {error && <div className="error-banner">{error}</div>}

        {!loading && (
          <div className="product-summary">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in{' '}
            <strong>{selectedCategory === 'all' ? 'all categories' : selectedCategory}</strong>
          </div>
        )}

        {loading ? (
          <div className="loading-state">Loading products…</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="product-content">
                  <p className="product-category">{product.category}</p>
                  <h3>{product.title}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <p className="product-description">{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
