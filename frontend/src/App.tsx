import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import BkashVerification from './BkashVerification'

// ==================== API SERVICE ====================
const API_BASE_URL = 'https://robo-backend-gguf.onrender.com/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface BackendProduct {
  _id: string;
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  diamonds: number;
  price: number;
  bonus?: string;
  tag?: string;
  isActive: boolean;
}

export interface BackendCategory {
  _id: string;
  id: string;
  name: string;
  description?: string;
  badge?: string;
  isActive: boolean;
}

// Products API
export const productApi = {
  getAll: async (): Promise<ApiResponse<BackendProduct[]>> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.json();
  },
  
  getById: async (id: string): Promise<ApiResponse<BackendProduct>> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },
  
  getByCategory: async (categoryId: string): Promise<ApiResponse<BackendProduct[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
    return response.json();
  },
  
  create: async (productData: Omit<BackendProduct, '_id'>): Promise<ApiResponse<BackendProduct>> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  
  update: async (id: string, productData: Partial<BackendProduct>): Promise<ApiResponse<BackendProduct>> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Categories API
export const categoryApi = {
  getAll: async (): Promise<ApiResponse<BackendCategory[]>> => {
    const response = await fetch(`${API_BASE_URL}/products/categories/all`);
    return response.json();
  },
  
  create: async (categoryData: Omit<BackendCategory, '_id'>): Promise<ApiResponse<BackendCategory>> => {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return response.json();
  },
  
  update: async (id: string, categoryData: Partial<BackendCategory>): Promise<ApiResponse<BackendCategory>> => {
    const response = await fetch(`${API_BASE_URL}/products/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/categories/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Payments API
export const paymentApi = {
  verify: async (paymentData: {
    transactionId: string;
    amount: number;
    playerId: string;
    productId: string;
    productName?: string;
    diamonds?: number;
    price?: number;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },
  
  getStatus: async (transactionId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments/status/${transactionId}`);
    return response.json();
  },
  
  getAll: async (limit: number = 50): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payments?limit=${limit}`);
    return response.json();
  }
};

// Database seed (one-time use)
export const seedApi = {
  seedDatabase: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/seed`, {
      method: 'POST'
    });
    return response.json();
  }
};

// ==================== TYPES ====================
type Category = {
  id: string
  name: string
  description?: string
  badge?: string
}

type Product = {
  id: string
  categoryId: string
  name: string
  diamonds: number
  price: number
  bonus?: string
  tag?: string
}

const STORAGE_KEY = 'rtu_catalog_backup'
const SESSION_KEY = 'rtu_admin_session'

// ==================== CATALOG HOOK ====================
function useCatalog() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFromBackend()
  }, [])

  const loadFromBackend = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll()
      ])
      
      if (productsRes.success && productsRes.data) {
        const backendProducts: BackendProduct[] = productsRes.data
        const convertedProducts: Product[] = backendProducts
          .filter(p => p.isActive)
          .map(p => ({
            id: p.id,
            categoryId: p.categoryId,
            name: p.name,
            diamonds: p.diamonds,
            price: p.price,
            bonus: p.bonus,
            tag: p.tag
          }))
        setProducts(convertedProducts)
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          categories,
          products: convertedProducts
        }))
      } else {
        throw new Error(productsRes.message || 'Failed to load products')
      }
      
      if (categoriesRes.success && categoriesRes.data) {
        const backendCategories: BackendCategory[] = categoriesRes.data
        const convertedCategories: Category[] = backendCategories
          .filter(c => c.isActive)
          .map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            badge: c.badge
          }))
        setCategories(convertedCategories)
      } else {
        throw new Error(categoriesRes.message || 'Failed to load categories')
      }
      
    } catch (err) {
      console.error('Failed to load from backend:', err)
      setError('Backend connection failed. Using local backup.')
      
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { categories: Category[], products: Product[] }
          if (parsed.categories) setCategories(parsed.categories)
          if (parsed.products) setProducts(parsed.products)
        } catch (parseErr) {
          console.error('Failed to parse localStorage data:', parseErr)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const addCategoryToBackend = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        ...category
      }
      
      const response = await categoryApi.create({
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description || '',
        badge: newCategory.badge || '',
        isActive: true
      })
      
      if (response.success) {
        setCategories(prev => [...prev, newCategory])
        saveToStorage()
        return { success: true, data: newCategory }
      } else {
        throw new Error(response.message || 'Failed to create category')
      }
    } catch (err) {
      console.error('Failed to save category to backend:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create category' 
      }
    }
  }

  const deleteCategoryFromBackend = async (id: string) => {
    try {
      const response = await categoryApi.delete(id)
      if (response.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id))
        setProducts(prev => prev.filter(product => product.categoryId !== id))
        saveToStorage()
        return { success: true }
      }
      return { success: false, error: response.message }
    } catch (err) {
      console.error('Failed to delete category:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete category' 
      }
    }
  }

  const addProductToBackend = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        ...product
      }
      
      const category = categories.find(c => c.id === product.categoryId)
      
      const response = await productApi.create({
        id: newProduct.id,
        categoryId: newProduct.categoryId,
        name: newProduct.name,
        diamonds: newProduct.diamonds,
        price: newProduct.price,
        bonus: newProduct.bonus || '',
        tag: newProduct.tag || '',
        categoryName: category?.name || 'Unknown',
        isActive: true
      })
      
      if (response.success) {
        setProducts(prev => [...prev, newProduct])
        saveToStorage()
        return { success: true, data: newProduct }
      } else {
        throw new Error(response.message || 'Failed to create product')
      }
    } catch (err) {
      console.error('Failed to save product to backend:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create product' 
      }
    }
  }

  const deleteProductFromBackend = async (id: string) => {
    try {
      const response = await productApi.delete(id)
      if (response.success) {
        setProducts(prev => prev.filter(product => product.id !== id))
        saveToStorage()
        return { success: true }
      }
      return { success: false, error: response.message }
    } catch (err) {
      console.error('Failed to delete product:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete product' 
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, products }))
  }

  return { 
    categories, 
    products, 
    loading,
    error,
    addCategory: addCategoryToBackend,
    deleteCategory: deleteCategoryFromBackend,
    addProduct: addProductToBackend,
    deleteProduct: deleteProductFromBackend,
    refresh: loadFromBackend
  }
}

// ==================== ADMIN SESSION ====================
function useAdminSession() {
  const [isAuthed, setAuthed] = useState<boolean>(() => {
    return localStorage.getItem(SESSION_KEY) === 'true'
  })

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === '5566') {
      setAuthed(true)
      localStorage.setItem(SESSION_KEY, 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setAuthed(false)
    localStorage.removeItem(SESSION_KEY)
  }

  return { isAuthed, login, logout }
}

// ==================== COMPONENTS ====================
function Navbar() {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <div className="brand-mark">
          <span className="mark-glow" />
          <span className="mark-letter">R</span>
        </div>
        <div>
          <p className="brand-name">Robo Top Up</p>
          <p className="brand-sub">Free Fire Diamonds</p>
        </div>
      </Link>
      <nav className="nav-links">
        <Link className="active" to="/">
          Store
        </Link>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="pill">Instant delivery</p>
        <h1>
          Ekta fresh & clean Free Fire top-up hub
          <span className="text-highlight"> — Robo Top Up</span>
        </h1>
        <p className="lead">
          Diamond top-up in seconds with trusted local payment, safe admin panel, and
          crystal clear pricing. Easy for players, simple for admins.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#diamonds">
            Buy Diamonds
          </a>
        </div>
        <div className="badges">
          <span>⚡ Instant code</span>
          <span>🛡️ Secure payment</span>
          <span>💬 Bangla support</span>
        </div>
      </div>
    </section>
  )
}

function ProductGrid({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories.length ? categories[0].id : null,
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (!selectedCategory && categories.length) {
      setSelectedCategory(categories[0].id)
    }
  }, [categories, selectedCategory])

  const filtered = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products
  const categoryName =
    categories.find((c) => c.id === selectedCategory)?.name ?? 'All categories'

  return (
    <section id="diamonds" className="section">
      <div className="section-head">
        <div>
          <p className="pill">Top-up list</p>
          <h2>{categoryName}</h2>
          <p className="muted">Choose a category, then pick your perfect pack.</p>
        </div>
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.name}</span>
              {cat.badge ? <span className="tab-badge">{cat.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {filtered.map((item) => (
          <article key={item.id} className="product-card">
            <div className="product-top">
              <div>
                <p className="product-name">{item.name}</p>
                <p className="product-diamonds">
                  {item.diamonds ? `${item.diamonds} Diamonds` : 'Special item'}
                </p>
              </div>
              {item.tag ? <span className="tag">{item.tag}</span> : null}
            </div>
            {item.bonus ? <p className="bonus">{item.bonus}</p> : <div className="bonus placeholder" />}
            <div className="price-row">
              <p className="price">৳{item.price}</p>
              <button
                className="btn small"
                style={{
                  backgroundColor:"orange"
                }}
                onClick={() => navigate('/checkout', { state: { productId: item.id } })}
              >
                Top up now
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 ? <p className="muted empty">No products in this category.</p> : null}
      </div>
    </section>
  )
}

function Steps() {
  return (
    <section className="section steps">
      <div className="section-head">
        <p className="pill">How it works</p>
        <h2>3 easy steps</h2>
      </div>
      <div className="steps-grid">
        <div>
          <p className="step-num">01</p>
          <h3>Select diamonds</h3>
          <p className="muted">Pick the pack you want from Robo Top Up.</p>
        </div>
        <div>
          <p className="step-num">02</p>
          <h3>Give Player ID</h3>
          <p className="muted">Share your Free Fire UID, choose payment.</p>
        </div>
        <div>
          <p className="step-num">03</p>
          <h3>Get instant top-up</h3>
          <p className="muted">Within seconds diamonds appear in your account.</p>
        </div>
      </div>
    </section>
  )
}

function AdminLogin({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const ok = onLogin(username.trim(), password.trim())
    if (ok) {
      navigate('/admin')
    } else {
      setError('Username or password wrong')
    }
  }

  return (
    <div className="auth-card">
      <p className="pill">Admin</p>
      <h2>Login to manage packs</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="5566"
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn primary" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

function AdminPanel({
  onLogout,
}: {
  onLogout: () => void
}) {
  const { 
    categories, 
    products, 
    loading,
    error,
    addCategory,
    deleteCategory,
    addProduct,
    deleteProduct,
    refresh 
  } = useCatalog()

  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [catBadge, setCatBadge] = useState('')
  const [name, setName] = useState('')
  const [diamonds, setDiamonds] = useState('')
  const [price, setPrice] = useState('')
  const [bonus, setBonus] = useState('')
  const [tag, setTag] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.diamonds - b.diamonds || a.name.localeCompare(b.name)),
    [products],
  )

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault()
    if (!catName.trim()) {
      setMessage({ type: 'error', text: 'Category name is required' })
      return
    }

    const result = await addCategory({
      name: catName.trim(),
      description: catDesc.trim() || undefined,
      badge: catBadge.trim() || undefined,
    })

    if (result.success) {
      setMessage({ type: 'success', text: 'Category added to database!' })
      setCatName('')
      setCatDesc('')
      setCatBadge('')
      if (!categoryId) setCategoryId(result.data!.id)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add category' })
    }
  }

  const handleRemoveCategory = async (id: string) => {
    if (!window.confirm('Are you sure? Products in this category will also be removed.')) {
      return
    }

    const result = await deleteCategory(id)
    if (result.success) {
      setMessage({ type: 'success', text: 'Category deleted from database!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete category' })
    }
  }

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !price || !categoryId) {
      setMessage({ type: 'error', text: 'Product name, price and category are required' })
      return
    }

    const result = await addProduct({
      name: name.trim(),
      categoryId,
      diamonds: Number(diamonds) || 0,
      price: Number(price),
      bonus: bonus.trim() || undefined,
      tag: tag.trim() || undefined,
    })

    if (result.success) {
      setMessage({ type: 'success', text: 'Product added to database!' })
      setName('')
      setDiamonds('')
      setPrice('')
      setBonus('')
      setTag('')
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add product' })
    }
  }

  const handleRemoveProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    const result = await deleteProduct(id)
    if (result.success) {
      setMessage({ type: 'success', text: 'Product deleted from database!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete product' })
    }
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <div className="admin-head">
        <div>
          <p className="pill">Dashboard</p>
          <h2>Manage categories & products</h2>
          <p className="muted">All data is saved to MongoDB database</p>
          {error && <p className="error-text">{error}</p>}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn ghost" onClick={refresh}>
            Refresh Data
          </button>
          <button className="btn danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.type}`} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      <div className="admin-grid">
        <form className="admin-form" onSubmit={handleAddCategory}>
          <h3>Add Category</h3>
          <div className="field-grid">
            <label>
              Name *
              <input
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Diamond TopUp"
              />
            </label>
            <label>
              Badge (optional)
              <input
                value={catBadge}
                onChange={(e) => setCatBadge(e.target.value)}
                placeholder="Hot"
              />
            </label>
            <label>
              Description (optional)
              <input
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Fast delivery packs"
              />
            </label>
          </div>
          <button className="btn primary" type="submit">
            Add Category to Database
          </button>
        </form>

        <div className="table categories-table">
          <div className="table-head">
            <p>Category</p>
            <p>Badge</p>
            <p>Description</p>
            <p>Actions</p>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} className="table-row">
              <p><strong>{cat.name}</strong></p>
              <p>{cat.badge || '-'}</p>
              <p>{cat.description || '-'}</p>
              <div className="row-actions">
                <button 
                  className="btn danger small" 
                  onClick={() => handleRemoveCategory(cat.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="table-row">
              <p colSpan={4} className="muted empty">
                No categories yet. Add your first category.
              </p>
            </div>
          )}
        </div>
      </div>

      <form className="admin-form" onSubmit={handleAddProduct}>
        <h3>Add Product</h3>
        <div className="field-grid">
          <label>
            Category *
            <select 
              required 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Product Name *
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="50 Diamonds"
            />
          </label>
          <label>
            Diamonds
            <input
              type="number"
              min="0"
              value={diamonds}
              onChange={(e) => setDiamonds(e.target.value)}
              placeholder="50"
            />
          </label>
          <label>
            Price (৳) *
            <input
              required
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="45"
            />
          </label>
          <label>
            Bonus (optional)
            <input
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              placeholder="+10 bonus"
            />
          </label>
          <label>
            Tag (optional)
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Hot"
            />
          </label>
        </div>
        <button className="btn primary" type="submit">
          Add Product to Database
        </button>
      </form>

      <div className="table wide-table">
        <div className="table-head">
          <p>Product</p>
          <p>Category</p>
          <p>Diamonds</p>
          <p>Price</p>
          <p>Actions</p>
        </div>
        {sortedProducts.map((item) => (
          <div key={item.id} className="table-row">
            <p>
              <strong>{item.name}</strong>
              {item.tag && <span className="tag tiny">{item.tag}</span>}
              {item.bonus && <span className="bonus tiny"> ({item.bonus})</span>}
            </p>
            <p>{categories.find(c => c.id === item.categoryId)?.name || '-'}</p>
            <p>{item.diamonds || 'Special'}</p>
            <p>৳{item.price}</p>
            <div className="row-actions">
              <button 
                className="btn danger small" 
                onClick={() => handleRemoveProduct(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {sortedProducts.length === 0 && (
          <div className="table-row">
            <p colSpan={5} className="muted empty">
              No products yet. Add your first product.
            </p>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '30px', background: '#f8fafc' }}>
        <h4>Database Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p className="label">Categories</p>
            <p className="data"><strong>{categories.length}</strong> active</p>
          </div>
          <div>
            <p className="label">Products</p>
            <p className="data"><strong>{products.length}</strong> active</p>
          </div>
        </div>
        <p className="muted" style={{ marginTop: '10px', fontSize: '0.9rem' }}>
          All data is stored in MongoDB. Changes are automatically saved.
        </p>
      </div>
    </div>
  )
}

function Checkout({
  products,
}: {
  products: Product[]
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const productId =
    (location.state as { productId?: string } | undefined)?.productId ??
    new URLSearchParams(location.search).get('productId') ??
    ''
  const product = products.find((p) => p.id === productId) ?? products[0]
  const [uid, setUid] = useState('')
  const [payment, setPayment] = useState<'bkash'>('bkash')
  const [showBkashVerification, setShowBkashVerification] = useState(false)

  useEffect(() => {
    if (!products.length) navigate('/')
  }, [products, navigate])

  if (!product) {
    return <Navigate to="/" replace />
  }

  const handleBkashVerify = async (businessId: string) => {
    try {
      const response = await paymentApi.verify({
        transactionId: businessId,
        amount: product.price,
        playerId: uid,
        productId: product.id,
        productName: product.name,
        diamonds: product.diamonds,
        price: product.price
      })
      
      if (response.success) {
        alert('Payment verified successfully! Transaction ID: ' + businessId)
        setShowBkashVerification(false)
        navigate('/')
      } else {
        alert('Payment verification failed: ' + response.message)
        setShowBkashVerification(false)
      }
    } catch (err) {
      console.error('Payment verification error:', err)
      alert('Payment verification failed. Please try again.')
      setShowBkashVerification(false)
    }
  }

  const handleBkashClose = () => {
    setShowBkashVerification(false)
  }

  if (showBkashVerification) {
    return <BkashVerification 
      onVerify={handleBkashVerify} 
      onClose={handleBkashClose} 
      amount={product.price}
    />
  }

  return (
    <section className="section checkout">
      <div className="checkout-head">
        <div>
          <p className="pill">Free Fire</p>
          <h2>{product.name}</h2>
          <p className="muted">
            Complete your purchase. Enter your Free Fire UID then pay with bKash.
          </p>
        </div>
        <button className="btn ghost" onClick={() => navigate('/')}>
          Back to store
        </button>
      </div>

      <div className="checkout-grid">
        <div className="card">
          <p className="label">1) Account UID</p>
          <input
            required
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter your Free Fire UID"
          />
          <p className="help">We'll use this UID to deliver your diamonds.</p>

          <p className="label">2) Payment method</p>
          <div className="pay-options">
            <button
              className={`pay-card ${payment === 'bkash' ? 'active' : ''}`}
              onClick={() => setPayment('bkash')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="bkash-logo">
                  bK
                </div>
                <div>
                  <p className="pay-title">bKash</p>
                  <p className="muted">Instant Pay</p>
                </div>
              </div>
              <span className="tag bkash-tag">Recommended</span>
            </button>
          </div>

          <button
            className="btn primary full"
            disabled={!uid}
            onClick={() => setShowBkashVerification(true)}
          >
            Pay with bKash
          </button>
        </div>

        <div className="card summary">
          <p className="label">Order summary</p>
          <div className="summary-line">
            <span>Item</span>
            <strong>{product.name}</strong>
          </div>
          <div className="summary-line">
            <span>Diamonds</span>
            <strong>{product.diamonds || 'Special item'}</strong>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <strong>৳{product.price}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==================== MAIN APP ====================
function App() {
  const catalog = useCatalog()
  const { isAuthed, login, logout } = useAdminSession()
  const navigate = useNavigate()

  if (catalog.loading) {
    return (
      <div className="page">
        <Navbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
          {catalog.error && <p className="error-text">{catalog.error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <ProductGrid 
                categories={catalog.categories} 
                products={catalog.products} 
              />
              <Steps />
            </>
          }
        />
        <Route path="/checkout" element={<Checkout products={catalog.products} />} />
        <Route
          path="/admin"
          element={
            isAuthed ? (
              <AdminPanel onLogout={logout} />
            ) : (
              <AdminLogin onLogin={login} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="footer">
        <p>Robo Top Up — All data stored in MongoDB database</p>
      </footer>
    </div>
  )
}

export default App